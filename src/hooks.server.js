import { redirect } from '@sveltejs/kit';
import { TARGET_ISO } from '$lib/config.js';

export function handle({ event, resolve }) {
	const now = new Date();
	const target = new Date(TARGET_ISO);
	const path = event.url.pathname;

	if (now < target) {
		if (!path.startsWith('/countdown') && !path.startsWith('/favicon')) {
			throw redirect(302, '/countdown');
		}
	} else {
		if (!path.startsWith('/scoreboard') && !path.startsWith('/favicon')) {
			throw redirect(302, '/scoreboard');
		}
	}

	return resolve(event);
}
