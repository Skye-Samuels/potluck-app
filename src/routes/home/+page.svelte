<script>
	let activeTab = $state('participation');
</script>

<div class="min-h-screen bg-base-100">
	<!-- Header -->
	<div class="navbar bg-base-200 shadow-lg">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost text-xl">ORTSOC Cook-off</a>
		</div>
		<div class="flex-none">
			<a href="/scoreboard" class="btn btn-primary">View Scoreboard</a>
		</div>
	</div>

	<!-- Main Content -->
	<div class="container mx-auto px-4 py-8">
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold mb-2">Cast Your Votes!</h1>
			<p class="text-lg text-base-content/70">Choose a category below to submit your vote</p>
		</div>

		<!-- Tabs -->
		<div class="flex justify-center mb-6">
			<div role="tablist" class="tabs tabs-boxed tabs-lg">
				<button
					role="tab"
					class="tab"
					class:tab-active={activeTab === 'participation'}
					onclick={() => activeTab = 'participation'}
				>
					Participation Vote
				</button>
				<button
					role="tab"
					class="tab"
					class:tab-active={activeTab === 'competition'}
					onclick={() => activeTab = 'competition'}
				>
					Competition Vote
				</button>
			</div>
		</div>

		<!-- Tab Content -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				{#if activeTab === 'participation'}
					<h2 class="card-title text-2xl mb-4">Participation Voting</h2>
					<p class="mb-4 text-base-content/70">
						Vote for dishes in the participation category. Every dish deserves recognition!
					</p>
					
					<!-- Replace this div with your iframe when ready -->
					<div class="w-full bg-base-300 rounded-lg p-8">
						<div class="text-center">
							<p class="text-lg font-semibold mb-4">Participation Form</p>
							<p class="text-sm text-base-content/60 mb-4">
								Google Form will be embedded here
							</p>
							<div class="divider">Instructions</div>
							<p class="text-sm">
								To complete embed:<br>
								1. need to replace this entire div with an iframe<br>
								2. Set src="https://docs.google.com/forms/d/e/1FAIpQLSdDQRo9ZX--aHwFl-Hj-avC6U3VdC5ghz_ovkGo5PYa6PCICA/viewform"<br>
								3. Set width="100%" height="800"
							</p>
						</div>
					</div>
					
					<!-- TODO: Replace the div above with:
					<iframe 
						src="YOUR_PARTICIPATION_FORM_URL" 
						width="100%" 
						height="800" 
						frameborder="0" 
						marginheight="0" 
						marginwidth="0"
						class="rounded-lg"
					>
						Loading...
					</iframe>
					-->
					
				{:else}
					<h2 class="card-title text-2xl mb-4">Competition Voting</h2>
					<p class="mb-4 text-base-content/70">
						Vote for your favorite dishes in the competition categories!
					</p>
					
					<!-- Replace this div with your iframe when ready -->
					<div class="w-full bg-base-300 rounded-lg p-8">
						<div class="text-center">
							<p class="text-lg font-semibold mb-4">Competition Form</p>
							<p class="text-sm text-base-content/60 mb-4">
								Google Form will be embedded here
							</p>
							<div class="divider">Instructions</div>
							<p class="text-sm">
								To embed your form:<br>
								1. Replace this entire div with an iframe<br>
								2. Set src="YOUR_GOOGLE_FORM_EMBED_URL"<br>
								3. Set width="100%" height="800"
							</p>
						</div>
					</div>
					
					<!-- TODO: Replace the div above with:
					<iframe 
						src="YOUR_COMPETITION_FORM_URL" 
						width="100%" 
						height="800" 
						frameborder="0" 
						marginheight="0" 
						marginwidth="0"
						class="rounded-lg"
					>
						Loading...
	</iframe>
					-->
					
				{/if}
			</div>
		</div>

		<!-- Instructions -->
		<div class="alert alert-info mt-8">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
			</svg>
			<div>
				<h3 class="font-bold">How to vote:</h3>
				<div class="text-sm">
					1. Select the category tab above<br>
					2. Fill out the Google Form<br>
					3. Check the live scoreboard to see results!
				</div>
			</div>
		</div>
	</div>
</div>