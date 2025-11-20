<!-- <script>
    import { onMount } from "svelte";
    import {
        Chart,
        BarController,
        BarElement,
        CategoryScale,
        LinearScale,
        Tooltip,
        Legend
    } from "chart.js";

    Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

    let chartElement;
    let chart;

    let contestants = [
        { contestant: "Alex M.",      dish: "Smoked Brisket Sliders",     team: "SecOps", score: 9.8 },
        { contestant: "Jordan L.",    dish: "Roasted Veggie Lasagna",     team: "GRC",    score: 9.5 },
        { contestant: "Sam P.",       dish: "Buffalo Cauliflower Bites",  team: "SecOps", score: 9.3 },
        { contestant: "Taylor R.",    dish: "Garlic Herb Focaccia",       team: "GRC",    score: 9.2 },
        { contestant: "Casey W.",     dish: "Mango Salsa Tacos",          team: "SecOps", score: 9.1 },
        { contestant: "Morgan K.",    dish: "Mac & Cheese Trio",          team: "GRC",    score: 8.9 },
        { contestant: "Riley S.",     dish: "Korean BBQ Meatballs",       team: "SecOps", score: 8.8 },
        { contestant: "Cameron D.",   dish: "Lemon Herb Chicken Skewers", team: "GRC",    score: 8.7 },
        { contestant: "Jamie H.",     dish: "Spinach Artichoke Dip",      team: "SecOps", score: 8.6 },
        { contestant: "Drew F.",      dish: "Caprese Skewers",            team: "GRC",    score: 8.5 },
        { contestant: "Quinn B.",     dish: "Jalapeño Cornbread",         team: "SecOps", score: 8.4 },
        { contestant: "Pat C.",       dish: "Stuffed Mushrooms",          team: "GRC",    score: 8.3 },
        { contestant: "Sydney T.",    dish: "Tiramisu Cups",              team: "SecOps", score: 8.2 },
        { contestant: "Lee N.",       dish: "Berry Crumble Bars",         team: "GRC",    score: 8.1 },
        { contestant: "Avery V.",     dish: "Garlic Parmesan Wings",      team: "SecOps", score: 8.0 },
        { contestant: "Robin J.",     dish: "Pesto Pasta Salad",          team: "GRC",    score: 7.9 },
        { contestant: "Taylor C.",    dish: "Chocolate Mousse Pots",      team: "SecOps", score: 7.8 },
        { contestant: "Chris G.",     dish: "Deviled Eggs Trio",          team: "GRC",    score: 7.7 },
        { contestant: "Skyler Z.",    dish: "Sriracha Honey Meatballs",   team: "SecOps", score: 7.6 },
        { contestant: "Jordan Q.",    dish: "Roasted Garlic Hummus",      team: "GRC",    score: 7.5 }
    ];

    let teamScores = [];
    let sortedContestants = [];

    const barColors = {
        GRC: "oklch(59.6% 0.145 163.225 / 0.8)",
        SecOps: "oklch(58.8% 0.158 241.966 / 0.8)"
    };

    const barBorderColors = {
        GRC: "var(--color-emerald-600)",
        SecOps: "var(--color-sky-600)"
    };

    function teamSummaryClass(team) {
        if (team === "GRC") {
            return "bg-emerald-50 border-emerald-300 text-emerald-900";
        }
        if (team === "SecOps") {
            return "bg-sky-50 border-sky-300 text-sky-900";
        }
        return "bg-base-100 border-base-300 text-base-content";
    }

    function recomputeTeamScores() {
        const totals = {};
        const counts = {};
        for (const c of contestants) {
            if (!c.team) continue;
            const team = c.team;
            const score = Number(c.score ?? 0);
            if (!Number.isFinite(score)) continue;
            totals[team] = (totals[team] ?? 0) + score;
            counts[team] = (counts[team] ?? 0) + 1;
        }
        teamScores = Object.keys(totals).map((team) => ({
            team,
            score: counts[team] ? totals[team] / counts[team] : 0
        }));
    }

    $: sortedContestants = [...contestants].sort((a, b) => {
        const sa = Number(a.score ?? 0);
        const sb = Number(b.score ?? 0);
        if (!Number.isFinite(sa) && !Number.isFinite(sb)) return 0;
        if (!Number.isFinite(sa)) return 1;
        if (!Number.isFinite(sb)) return -1;
        return sb - sa;
    });

    export function setContestants(values) {
        contestants = values ?? [];
        recomputeTeamScores();
        if (chart) updateChart();
    }

    function createChart() {
        const labels = teamScores.map((t) => t.team);
        const data = teamScores.map((t) => t.score);
        const backgroundColors = teamScores.map(
            (t) => barColors[t.team] ?? "color-mix(in oklab, var(--color-slate-400) 80%, transparent)"
        );
        const borderColors = teamScores.map(
            (t) => barBorderColors[t.team] ?? "var(--color-slate-500)"
        );

        chart = new Chart(chartElement, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Average Score",
                        data,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: { bottom: 16 }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 10
                    }
                }
            }
        });
    }

    function updateChart() {
        const labels = teamScores.map((t) => t.team);
        const data = teamScores.map((t) => t.score);
        const backgroundColors = teamScores.map(
            (t) => barColors[t.team] ?? "color-mix(in oklab, var(--color-slate-400) 80%, transparent)"
        );
        const borderColors = teamScores.map(
            (t) => barBorderColors[t.team] ?? "var(--color-slate-500)"
        );

        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].backgroundColor = backgroundColors;
        chart.data.datasets[0].borderColor = borderColors;
        chart.update();
    }

    onMount(() => {
        recomputeTeamScores();
        createChart();
    });
</script>

<div class="h-screen bg-base-100">
    <div class="h-full flex flex-col p-5 gap-5 overflow-hidden">
        <header class="w-full flex flex-col items-center gap-2 shrink-0">
            <h1 class="text-4xl font-bold text-center">Cook-Off Scoreboard</h1>
        </header>

        <main class="grow overflow-hidden">
            <div class="h-full w-full grid grid-cols-2 gap-5">
                <div class="card bg-base-200 shadow-md h-full flex flex-col overflow-hidden rounded-3xl">
                    <div class="card-body flex flex-col gap-4 flex-1 min-h-0">
                        <h2 class="card-title justify-center text-center">Team Average Scores</h2>
                        <div class="flex-1 min-h-0">
                            <canvas bind:this={chartElement} class="w-full h-full"></canvas>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            {#each teamScores as t}
                                <div class={"rounded-xl border px-4 py-3 flex items-center justify-between " + teamSummaryClass(t.team)}>
                                    <div class="flex flex-col">
                                        <span class="text-xs uppercase tracking-wide opacity-60">Team</span>
                                        <span class="font-semibold text-lg">{t.team}</span>
                                    </div>
                                    <div class="text-right">
                                        <span class="text-xs uppercase tracking-wide opacity-60">Average</span>
                                        <div class="text-2xl font-extrabold tabular-nums">
                                            {Number(t.score).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>

                <div class="card bg-base-200 shadow-md h-full flex flex-col overflow-hidden rounded-3xl">
                    <div class="card-body flex flex-col gap-3 flex-1 min-h-0">
                        <h2 class="card-title justify-center text-center">Contestant Scores</h2>
                        <div class="flex-1 min-h-0 overflow-y-auto">
                            <table class="table table-zebra table-sm w-full">
                                <thead class="text-xs">
                                    <tr>
                                        <th>Rank</th>
                                        <th>Contestant</th>
                                        <th>Dish</th>
                                        <th>Team</th>
                                        <th class="text-right">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#if !sortedContestants || sortedContestants.length === 0}
                                        <tr>
                                            <td colspan="5" class="text-center text-sm text-base-content/70">
                                                Results will appear here once judging begins.
                                            </td>
                                        </tr>
                                    {:else}
                                        {#each sortedContestants as c, i}
                                            <tr
                                                class:bg-yellow-200={i === 0}
                                                class:bg-slate-300={i === 1}
                                                class:bg-amber-300={i === 2}
                                            >
                                                <td class="w-12">{i + 1}</td>
                                                <td class="whitespace-nowrap">{c.contestant}</td>
                                                <td class="whitespace-nowrap">{c.dish}</td>
                                                <td class="whitespace-nowrap">
                                                    <span class="badge badge-outline badge-sm">{c.team}</span>
                                                </td>
                                                <td class="text-right">{c.score}</td>
                                            </tr>
                                        {/each}
                                    {/if}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div> -->
