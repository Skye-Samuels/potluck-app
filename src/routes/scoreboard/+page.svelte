<script>
	// TODO: Add Chart.js integration and live data from Google Sheets
	// Will need to install: npm install chart.js
</script>

<div class="min-h-screen bg-base-100">
	<!-- Header -->
	<div class="navbar bg-base-200 shadow-lg">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost text-xl">ORTSOC Cook-off</a>
		</div>
		<div class="flex-none gap-2">
			<a href="/home" class="btn btn-secondary">Back to Voting</a>
		</div>
	</div>

	<!-- Main Content -->
	<div class="container mx-auto px-4 py-8">
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold mb-2">Live Scoreboard</h1>
			<p class="text-lg text-base-content/70">Real-time voting results</p>
		</div>

		<!-- Scoreboard Content -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Participation Category -->
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body">
					<h2 class="card-title text-2xl">Participation Votes</h2>
					<div class="h-64 flex items-center justify-center bg-base-300 rounded-lg mt-4">
						<div class="text-center">
							<p class="text-lg font-semibold">Chart Coming Soon</p>
							<p class="text-sm text-base-content/60 mt-2">
								Chart.js visualization will display here
							</p>
						</div>
					</div>
					<!-- TODO: Add Chart.js chart here -->
					<!-- <canvas id="participationChart"></canvas> -->
				</div>
			</div>

			<!-- Competition Category -->
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body">
					<h2 class="card-title text-2xl">Competition Votes</h2>
					<div class="h-64 flex items-center justify-center bg-base-300 rounded-lg mt-4">
						<div class="text-center">
							<p class="text-lg font-semibold">Chart Coming Soon</p>
							<p class="text-sm text-base-content/60 mt-2">
								Chart.js visualization will display here
							</p>
						</div>
					</div>
					<!-- TODO: Add Chart.js chart here -->
					<!-- <canvas id="competitionChart"></canvas> -->
				</div>
			</div>
		</div>

		<!-- Live Update Indicator -->
		<div class="flex justify-center mt-8">
			<div class="badge badge-success gap-2">
				<div class="w-2 h-2 bg-success-content rounded-full animate-pulse"></div>
				Live Updates Active (Coming Soon)
			</div>
		</div>

		<!-- Additional Info -->
		<div class="alert alert-warning mt-6">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
			<span>Charts will be connected to live Google Sheets data in the next phase.</span>
		</div>
	</div>
</div>