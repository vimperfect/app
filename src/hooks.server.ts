import { auth, type Session } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});
	event.locals.session = session as Session;

	if (event.url.pathname.startsWith('/profile') && !session?.user) throw redirect(303, '/');

	return svelteKitHandler({ event, resolve, auth, building });
}
