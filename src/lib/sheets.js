import { google } from 'googleapis';
import { GOOGLE_SHEETS_CREDENTIALS, GOOGLE_SHEET_ID } from '$env/static/private';

/**
 * Initialize Google Sheets API client
 */
function getAuthClient() {
	try {
		const credentials = JSON.parse(GOOGLE_SHEETS_CREDENTIALS);
		const auth = new google.auth.GoogleAuth({
			credentials,
			scopes: ['https://www.googleapis.com/auth/spreadsheets']
		});
		return auth;
	} catch (error) {
		console.error('Failed to initialize Google Sheets auth:', error);
		throw error;
	}
}

/**
 * Fetch all votes from the Votes sheet
 * Expected columns: Timestamp, Judge Name, Dish Name, Dish ID, Track, Score, Category
 * @returns {Promise<Array>} Array of vote objects
 */
export async function fetchVotes() {
	try {
		const auth = await getAuthClient();
		const sheets = google.sheets({ version: 'v4', auth });

		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: GOOGLE_SHEET_ID,
			range: 'Votes!A2:G' // Skip header row, read all data columns
		});

		const rows = response.data.values || [];
		
		// Transform rows into vote objects
		const votes = rows.map((row) => ({
			timestamp: row[0] || '',           // Column A: Timestamp
			judge: row[1] || '',               // Column B: Judge Name
			dishName: row[2] || '',            // Column C: Dish Name
			score: parseFloat(row[3]) || 0,    // Column D: Score ← MOVED
			dishId: row[4] || '',              // Column E: Dish ID
			track: row[5] || '',               // Column F: Track
			category: row[6] || '',            // Column G: Category
			imageUrl: ''
		}));

		return votes;
	} catch (error) {
		console.error('Error fetching votes from Google Sheets:', error);
		// Return empty array on error so the app still works
		return [];
	}
}

/**
 * Fetch configuration values from Config sheet
 * Expected columns: Key, Value
 * @returns {Promise<Object>} Configuration object
 */
export async function getConfig() {
	try {
		const auth = await getAuthClient();
		const sheets = google.sheets({ version: 'v4', auth });

		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: GOOGLE_SHEET_ID,
			range: 'Config!A2:B' // Skip header row
		});

		const rows = response.data.values || [];
		
		// Transform rows into config object
		const config = {};
		rows.forEach((row) => {
			const key = row[0];
			const value = row[1];
			
			// Convert string booleans to actual booleans
			if (value === 'true' || value === 'false') {
				config[key] = value === 'true';
			} else {
				config[key] = value;
			}
		});

		return config;
	} catch (error) {
		console.error('Error fetching config from Google Sheets:', error);
		// Return default config on error
		return {
			all_scores_submitted: false,
			event_started: false
		};
	}
}

/**
 * Update a configuration value
 * @param {string} key - The config key to update
 * @param {any} value - The new value
 * @returns {Promise<boolean>} Success status
 */
export async function updateConfig(key, value) {
	try {
		const auth = await getAuthClient();
		const sheets = google.sheets({ version: 'v4', auth });

		// First, find the row with this key
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: GOOGLE_SHEET_ID,
			range: 'Config!A:A'
		});

		const keys = response.data.values || [];
		const rowIndex = keys.findIndex((row) => row[0] === key);

		if (rowIndex === -1) {
			console.error(`Config key "${key}" not found in sheet`);
			return false;
		}

		// Update the value (rowIndex + 1 because sheets are 1-indexed)
		await sheets.spreadsheets.values.update({
			spreadsheetId: GOOGLE_SHEET_ID,
			range: `Config!B${rowIndex + 1}`,
			valueInputOption: 'RAW',
			resource: {
				values: [[value.toString()]]
			}
		});

		return true;
	} catch (error) {
		console.error('Error updating config in Google Sheets:', error);
		return false;
	}
}

/**
 * Fetch list of judges from a Judges sheet (if it exists)
 * Expected columns: Judge Name
 * @returns {Promise<Array<string>>} Array of judge names
 */
export async function fetchJudges() {
	try {
		const auth = await getAuthClient();
		const sheets = google.sheets({ version: 'v4', auth });

		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: GOOGLE_SHEET_ID,
			range: 'Judges!A2:A' // Skip header row
		});

		const rows = response.data.values || [];
		return rows.map((row) => row[0]).filter(Boolean);
	} catch (error) {
		console.error('Error fetching judges from Google Sheets:', error);
		return [];
	}
}

/**
 * Fetch list of dishes from a Dishes sheet (if it exists)
 * Expected columns: Dish ID, Dish Name, Track, Category
 * @returns {Promise<Array>} Array of dish objects
 */
export async function fetchDishes() {
	try {
		const auth = await getAuthClient();
		const sheets = google.sheets({ version: 'v4', auth });

		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: GOOGLE_SHEET_ID,
			range: 'Dishes!A2:D' // Skip header row
		});

		const rows = response.data.values || [];
		const dishes = rows.map((row) => ({
			dishId: row[0] || '',
			dishName: row[1] || '',
			track: row[2] || '',
			category: row[3] || ''
		}));

		return dishes;
	} catch (error) {
		console.error('Error fetching dishes from Google Sheets:', error);
		return [];
	}
}
