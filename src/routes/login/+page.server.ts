import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { userTable } from '$lib/server/db/schema/user';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/home');
	}
	return {};
};

export const actions: Actions = {
	login: login,
	register: register
};

async function login(event: RequestEvent) {
	const formData = await event.request.formData();
	const username = formData.get('username');
	const password = formData.get('password');

	if (!validateUsername(username)) {
		return fail(400, {
			message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
		});
	}
	if (!validatePassword(password)) {
		return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
	}

	const results = await db.select().from(userTable).where(eq(userTable.username, username));

	const existingUser = results.at(0);
	if (!existingUser) {
		return fail(400, { message: 'Incorrect username or password' });
	}

	const validPassword = await verify(existingUser.passwordHash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
	if (!validPassword) {
		return fail(400, { message: 'Incorrect username or password' });
	}

	const sessionToken = auth.generateSessionToken();
	const session = await auth.createSession(sessionToken, existingUser.id);
	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return redirect(302, '/home');
}

async function register(event: RequestEvent) {
	const formData = await event.request.formData();
	const username = formData.get('username');
	const password = formData.get('password');

	if (!validateUsername(username)) {
		return fail(400, { message: 'Invalid username' });
	}
	if (!validatePassword(password)) {
		return fail(400, { message: 'Invalid password' });
	}

	const passwordHash = await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	try {
		const res = await db.insert(userTable).values({ username, passwordHash }).returning({generatedId: userTable.id});
		const userId = res[0].generatedId;
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userId);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} catch (e) {
		console.log(e);
		return fail(500, { message: 'An error has occurred' });
	}
	return redirect(302, '/home');
}

// function generateUserId() {
// 	// ID with 120 bits of entropy, or about the same as UUID v4.
// 	const bytes = crypto.getRandomValues(new Uint8Array(15));
// 	const id = encodeBase32LowerCase(bytes);
// 	return id;
// }

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
