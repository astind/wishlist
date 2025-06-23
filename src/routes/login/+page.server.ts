import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/home');
  }
  return {};
}

export const actions: Actions = {
  login: login,
  register: register
}


async function login(event: RequestEvent) {
  
}

async function register(event: RequestEvent) {
  const form = await event.request.formData();
  const username = form.get('username');
  const pw = form.get('password');
}
