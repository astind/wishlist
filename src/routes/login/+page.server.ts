import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/home');
  }
  return {};
}

export const actions: Actions = {
  login: login,
}


async function login({request}) {
  
}

async function register({request}) {
  
}
