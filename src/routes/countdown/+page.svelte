<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  export let data;

  const targetDate = new Date(data.targetDate);
  let days = 0, hours = 0, minutes = 0, seconds = 0;

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      days = hours = minutes = seconds = 0;
      goto("/scoreboard");
      return;
    }

    days = Math.floor(diff / 86400000);
    hours = Math.floor((diff / 3600000) % 24);
    minutes = Math.floor((diff / 60000) % 60);
    seconds = Math.floor((diff / 1000) % 60);

    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.setProperty("--value", value);
        el.textContent = value.toString().padStart(2, "0");
      }
    };

    set("days", days);
    set("hours", hours);
    set("minutes", minutes);
    set("seconds", seconds);
  }

  onMount(() => {
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  });
</script>

<div class="absolute top-4 right-4 z-20">
  <button
    class="btn btn-circle btn-ghost text-2xl border-2 border-base-content"
    on:click={() => document.getElementById('info_modal').showModal()}
  >
    ?
  </button>
</div>

<dialog id="info_modal" class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Title</h3>
    <p class="py-4">
    Test Text.
    </p>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>

<div class="relative flex items-center justify-center min-h-screen bg-base-100 overflow-hidden">
  <img
    src="/src/lib/assets/favicon.png"
    alt=""
    class="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none select-none"
  />
  <div class="relative text-center z-10">
    <h1 class="text-5xl font-bold">Potluck Countdown!</h1>
    <p class="py-6">We are excited to bring you the potluck in...</p>
    <div class="grid auto-cols-max grid-flow-col gap-5 text-center justify-center">
      <div class="flex flex-col items-center">
        <span class="countdown font-mono text-5xl"><span id="days" style="--value:0">00</span></span>
        days
      </div>
      <div class="flex flex-col items-center">
        <span class="countdown font-mono text-5xl"><span id="hours" style="--value:0">00</span></span>
        hours
      </div>
      <div class="flex flex-col items-center">
        <span class="countdown font-mono text-5xl"><span id="minutes" style="--value:0">00</span></span>
        min
      </div>
      <div class="flex flex-col items-center">
        <span class="countdown font-mono text-5xl"><span id="seconds" style="--value:0">00</span></span>
        sec
      </div>
    </div>
  </div>
</div>
