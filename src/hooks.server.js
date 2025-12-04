import { redirect } from '@sveltejs/kit';
import { TARGET_ISO } from '$lib/config.js';

export function handle({ event, resolve }) {
	const now = new Date();
	const target = new Date(TARGET_ISO);
	const path = event.url.pathname;


	//Comment out before production, enables vote viewing
	
	if (path.startsWith('/api/') || path.startsWith('/favicon')) {
		return resolve(event);
	}

	if (now < target) {
		if (!path.startsWith('/countdown')) {
			throw redirect(302, '/countdown');
		}
	} else {
		if (!path.startsWith('/scoreboard')) {
			throw redirect(302, '/scoreboard');
		}
	}

	return resolve(event);
}