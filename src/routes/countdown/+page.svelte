<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	export let data;

	const targetDate = new Date(data.targetDate);
	let days = 0,
		hours = 0,
		minutes = 0,
		seconds = 0;
	let activeFormTab = 'interest';

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

<!-- Help Button in top right -->
<div class="absolute top-4 right-4 z-20">
	<button
		class="btn btn-circle border-2 border-base-content text-2xl btn-ghost hover:ring-2 hover:ring-base-content/30"
		on:click={() => document.getElementById('info_modal').showModal()}
	>
		?
	</button>
</div>

<!-- Help/Info Modal -->
<dialog id="info_modal" class="modal">
	<div class="modal-box max-w-xl">
		<h3 class="text-center text-2xl font-bold">ORTSOC Potluck & Cook-Off</h3>

		<div class="mt-4 flex flex-wrap items-center justify-center gap-2">
			<span class="badge badge-outline">Saturday, December 6, 2025</span>
			<span class="badge badge-outline">4:00 PM - 7:00 PM</span>
			<span class="badge badge-outline">Corvallis Community Center's Willow Room, 2601 NW Tyler Ave</span>
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

<!-- Interest Form Modal -->
<dialog id="interest_form_modal" class="modal">
	<div class="modal-box h-5/6 max-w-4xl">
		<h3 class="mb-4 text-center text-2xl font-bold">Interest Form</h3>

		<div class="h-full pb-20">
			<iframe
				src="https://docs.google.com/forms/d/e/1FAIpQLSdDQRo9ZX--aHwFl-Hj-avC6U3VdC5ghz_ovkGo5PYa6PCICA/viewform?embedded=true"
				width="100%"
				height="100%"
				frameborder="0"
				marginheight="0"
				marginwidth="0"
				class="rounded-lg"
				title="Interest Form"
			>
				Loading form...
			</iframe>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<!-- Mentor Interest Form Modal -->
<dialog id="mentor_form_modal" class="modal">
	<div class="modal-box h-5/6 max-w-4xl">
		<h3 class="mb-4 text-center text-2xl font-bold">Mentor Interest Form</h3>

		<div class="h-full pb-20">
			<iframe
				src="https://docs.google.com/forms/d/e/1FAIpQLSeZ8AW8bCC68c6hrF6wGGdF_NAS59A9Qm8EgBTtEwJGNBWbyg/viewform?embedded=true"
				width="100%"
				height="100%"
				frameborder="0"
				marginheight="0"
				marginwidth="0"
				class="rounded-lg"
				title="Mentor Interest Form"
			>
				Loading form...
			</iframe>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<!-- Main Countdown -->
<div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-100">
	<img
		src="/favicon.png"
		alt=""
		class="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-10 select-none"
	/>
	<div class="relative z-10 text-center">
		<h1 class="text-5xl font-bold">Potluck Countdown!</h1>
		<p class="py-6">We are excited to bring you the potluck in...</p>
		<div class="grid auto-cols-max grid-flow-col justify-center gap-5 text-center">
			<div class="flex flex-col items-center font-bold">
				<span class="countdown font-mono text-5xl"><span id="days" style="--value:0">00</span></span
				>
				days
			</div>
			<div class="flex flex-col items-center font-bold">
				<span class="countdown font-mono text-5xl"
					><span id="hours" style="--value:0">00</span></span
				>
				hours
			</div>
			<div class="flex flex-col items-center font-bold">
				<span class="countdown font-mono text-5xl"
					><span id="minutes" style="--value:0">00</span></span
				>
				min
			</div>
			<div class="flex flex-col items-center font-bold">
				<span class="countdown font-mono text-5xl"
					><span id="seconds" style="--value:0">00</span></span
				>
				sec
			</div>
		</div>

		<!-- Form Buttons Below Countdown -->
		<div class="mt-7 flex justify-center gap-4">
			<button
				class="btn border-2 border-base-content/20 btn-neutral hover:border-base-content/40"
				on:click={() => document.getElementById('interest_form_modal').showModal()}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-5 w-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
					/>
				</svg>
				Interest Form
			</button>
			<button
				class="btn border-2 border-base-content/20 btn-neutral hover:border-base-content/40"
				on:click={() => document.getElementById('mentor_form_modal').showModal()}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-5 w-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
					/>
				</svg>
				Mentor Form
			</button>
		</div>
	</div>
</div>
