import { redirect } from '@sveltejs/kit';
import { TARGET_ISO } from '$lib/config.js';

export function load() {
	const now = new Date();
	const target = new Date(TARGET_ISO);

	if (now >= target) throw redirect(302, '/scoreboard');
	throw redirect(302, '/countdown');
}
