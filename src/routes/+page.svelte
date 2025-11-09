<script>
  import { onMount } from "svelte";

  const targetDate = new Date("2025-12-05T15:00:00");
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      days = hours = minutes = seconds = 0;
      return;
    }

    days = Math.floor(diff / (1000 * 60 * 60 * 24));
    hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    minutes = Math.floor((diff / (1000 * 60)) % 60);
    seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("days").style.setProperty("--value", days);
    document.getElementById("days").textContent = days;
    document.getElementById("hours").style.setProperty("--value", hours);
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").style.setProperty("--value", minutes);
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").style.setProperty("--value", seconds);
    document.getElementById("seconds").textContent = seconds;
  }

  onMount(() => {
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  });
</script>

<div class="flex items-center justify-center min-h-screen bg-base-100">
  <div class="text-center">
    <h1 class="text-5xl font-bold">Potluck Countdown!</h1>
    <p class="py-6">We are excited to bring you the potluck in...</p>
    <div class="grid auto-cols-max grid-flow-col gap-5 text-center justify-center">
      <div class="flex flex-col items-center">
        <span class="countdown font-mono text-5xl"><span id="days" style="--value:0">0</span></span>
        days
      </div>
      <div class="flex flex-col items-center">
        <span class="countdown font-mono text-5xl"><span id="hours" style="--value:0">0</span></span>
        hours
      </div>
      <div class="flex flex-col items-center">
        <span class="countdown font-mono text-5xl"><span id="minutes" style="--value:0">0</span></span>
        min
      </div>
      <div class="flex flex-col items-center">
        <span class="countdown font-mono text-5xl"><span id="seconds" style="--value:0">0</span></span>
        sec
      </div>
    </div>
  </div>
</div>
