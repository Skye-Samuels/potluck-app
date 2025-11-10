import { redirect } from '@sveltejs/kit';
import { TARGET_ISO } from '$lib/config.js';

export function handle({ event, resolve }) {
	const now = new Date();
	const target = new Date(TARGET_ISO);

	if (now < target) {
		const path = event.url.pathname;
		if (
			!path.startsWith('/countdown') &&
			!path.startsWith('/_app') &&
			!path.startsWith('/favicon')
		) {
			throw redirect(302, '/countdown');
		}
	}

	return resolve(event);
}
