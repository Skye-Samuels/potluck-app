import { json } from '@sveltejs/kit';
import { fetchVotes, getConfig } from '$lib/sheets.js';

/**
 * API endpoint for polling vote data
 * GET /api/votes
 */
export async function GET() {
	try {
		const [votes, config] = await Promise.all([
			fetchVotes(),
			getConfig()
		]);

		return json({
			votes,
			config,
			timestamp: Date.now()
		});
	} catch (error) {
		console.error('API Error:', error);
		return json(
			{
				error: 'Failed to fetch data',
				votes: [],
				config: { all_scores_submitted: false, event_started: false },
				timestamp: Date.now()
			},
			{ status: 500 }
		);
	}
}
