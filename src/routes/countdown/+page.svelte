<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	export let data;

	const targetDate = new Date(data.targetDate);
	let days = 0,
		hours = 0,
		minutes = 0,
		seconds = 0;

	function updateCountdown() {
		const now = new Date();
		const diff = targetDate.getTime() - now.getTime();

		if (diff <= 0) {
			days = hours = minutes = seconds = 0;
			goto('/scoreboard');
			return;
		}

		days = Math.floor(diff / 86400000);
		hours = Math.floor((diff / 3600000) % 24);
		minutes = Math.floor((diff / 60000) % 60);
		seconds = Math.floor((diff / 1000) % 60);

		const set = (id, value) => {
			const el = document.getElementById(id);
			if (el) {
				el.style.setProperty('--value', value);
				el.textContent = value.toString().padStart(2, '0');
			}
		};

		set('days', days);
		set('hours', hours);
		set('minutes', minutes);
		set('seconds', seconds);
	}

	onMount(() => {
		updateCountdown();
		const timer = setInterval(updateCountdown, 1000);
		return () => clearInterval(timer);
	});
</script>

<div class="absolute top-4 right-4 z-20">
	<button
		class="btn btn-circle border-2 border-base-content text-2xl btn-ghost hover:ring-2 hover:ring-base-content/30"
		on:click={() => document.getElementById('info_modal').showModal()}
	>
		?
	</button>
</div>

<dialog id="info_modal" class="modal">
	<div class="modal-box max-w-xl">
		<h3 class="text-center text-2xl font-bold">ORTSOC Potluck & Cook-Off</h3>

		<div class="mt-4 flex flex-wrap items-center justify-center gap-2">
			<span class="badge badge-outline">Friday, December 5, 2025</span>
			<span class="badge badge-outline">3:00 PM - 7:00 PM</span>
			<span class="badge badge-outline">Location: To be determined</span>
		</div>

		<p class="mt-4 text-sm leading-relaxed">
			End-of-term social for the ORTSOC community. Bring a dish to share, hang out, and celebrate.
		</p>

		<div class="divider my-4">Competition</div>

		<p class="text-sm leading-relaxed">
			SecOps and GRC tracks can compete. Mentors score dishes, and each track's <b>average score</b>
			determines the winner.
		</p>

		<ul class="mt-2 ml-5 list-disc space-y-1 text-sm">
			<li>Compete with a homemade dish</li>
			<li>Or volunteer to bring food or supplies without competing</li>
			<li>Setup/teardown help appreciated</li>
		</ul>

		<div class="divider my-4"></div>

		<div class="alert text-sm alert-warning">
			<span
				>Please label dishes with allergens and dietary info to keep the event safe and inclusive.</span
			>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-100">
	<img
		src="/src/lib/assets/favicon.png"
		alt=""
		class="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-10 select-none"
	/>
	<div class="relative z-10 text-center">
		<h1 class="text-5xl font-bold">Potluck Countdown!</h1>
		<p class="py-6">We are excited to bring you the potluck in...</p>
		<div class="grid auto-cols-max grid-flow-col justify-center gap-5 text-center">
			<div class="flex flex-col items-center">
				<span class="countdown font-mono text-5xl"><span id="days" style="--value:0">00</span></span
				>
				days
			</div>
			<div class="flex flex-col items-center">
				<span class="countdown font-mono text-5xl"
					><span id="hours" style="--value:0">00</span></span
				>
				hours
			</div>
			<div class="flex flex-col items-center">
				<span class="countdown font-mono text-5xl"
					><span id="minutes" style="--value:0">00</span></span
				>
				min
			</div>
			<div class="flex flex-col items-center">
				<span class="countdown font-mono text-5xl"
					><span id="seconds" style="--value:0">00</span></span
				>
				sec
			</div>
		</div>
	</div>
</div>
