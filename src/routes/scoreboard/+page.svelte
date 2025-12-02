<script>
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

    const sampleVotes = [
        { judge: "Judge 1", track: "GRC",    dishId: "dish1", dishName: "Spicy Sunrise",      imageUrl: "", score: 9.4 },
        { judge: "Judge 1", track: "SecOps", dishId: "dish2", dishName: "Midnight Crunch",    imageUrl: "", score: 8.8 },
        { judge: "Judge 1", track: "GRC",    dishId: "dish3", dishName: "Emerald Ember",      imageUrl: "", score: 8.9 },
        { judge: "Judge 2", track: "GRC",    dishId: "dish1", dishName: "Spicy Sunrise",      imageUrl: "", score: 9.1 },
        { judge: "Judge 2", track: "SecOps", dishId: "dish2", dishName: "Midnight Crunch",    imageUrl: "", score: 9.0 },
        { judge: "Judge 2", track: "SecOps", dishId: "dish4", dishName: "Skyline Bites",      imageUrl: "", score: 9.3 },
        { judge: "Judge 3", track: "GRC",    dishId: "dish5", dishName: "Garden Cipher",      imageUrl: "", score: 8.7 },
        { judge: "Judge 3", track: "SecOps", dishId: "dish2", dishName: "Midnight Crunch",    imageUrl: "", score: 9.2 },
        { judge: "Judge 3", track: "GRC",    dishId: "dish1", dishName: "Spicy Sunrise",      imageUrl: "", score: 9.0 },
        { judge: "Judge 4", track: "SecOps", dishId: "dish4", dishName: "Skyline Bites",      imageUrl: "", score: 9.1 },
        { judge: "Judge 4", track: "GRC",    dishId: "dish3", dishName: "Emerald Ember",      imageUrl: "", score: 8.5 },
        { judge: "Judge 4", track: "SecOps", dishId: "dish6", dishName: "Firewall Flatbread", imageUrl: "", score: 8.9 }
    ];

    let rawVotes = [];
    let trackTotals = { GRC: 0, SecOps: 0 };
    let judgeLabels = [];
    let judgeDataset = { GRC: [], SecOps: [] };
    let dishes = [];
    let top3 = [];

    let judgeChartElement;
    let judgeChart;

    const barColors = {
        GRC: "oklch(59.6% 0.145 163.225 / 0.8)",
        SecOps: "oklch(58.8% 0.158 241.966 / 0.8)"
    };

    const barBorderColors = {
        GRC: "var(--color-emerald-600)",
        SecOps: "var(--color-sky-600)"
    };

    function recompute() {
        const totals = { GRC: 0, SecOps: 0 };
        const judgeMap = {};
        const dishMap = {};

        for (const v of rawVotes) {
            const t = v.track;
            const s = Number(v.score);
            if (!["GRC", "SecOps"].includes(t) || !Number.isFinite(s)) continue;
            totals[t] += s;

            const j = v.judge || "Judge";
            if (!judgeMap[j]) judgeMap[j] = {};
            if (!judgeMap[j][t]) judgeMap[j][t] = { sum: 0, count: 0 };
            judgeMap[j][t].sum += s;
            judgeMap[j][t].count++;

            const id = v.dishId || v.dishName;
            if (!dishMap[id]) {
                dishMap[id] = {
                    id,
                    dishName: v.dishName,
                    imageUrl: v.imageUrl || "",
                    sum: 0,
                    count: 0
                };
            }
            dishMap[id].sum += s;
            dishMap[id].count++;
        }

        trackTotals = totals;

        const labels = Object.keys(judgeMap).sort();
        const grc = [];
        const sec = [];
        for (const j of labels) {
            const gm = judgeMap[j] || {};
            const g = gm.GRC ? gm.GRC.sum / gm.GRC.count : 0;
            const s = gm.SecOps ? gm.SecOps.sum / gm.SecOps.count : 0;
            grc.push(g);
            sec.push(s);
        }

        judgeLabels = labels;
        judgeDataset = { GRC: grc, SecOps: sec };

        dishes = Object.values(dishMap).map((d) => ({
            ...d,
            avgScore: d.count ? d.sum / d.count : 0
        }));

        top3 = dishes
            .slice()
            .sort((a, b) => b.avgScore - a.avgScore)
            .slice(0, 3);
    }

    export function setVotes(values) {
        rawVotes = Array.isArray(values) ? values : [];
        recompute();
        if (judgeChart) updateJudgeChart();
    }

    $: total = trackTotals.GRC + trackTotals.SecOps;
    $: grcPercent = total ? (trackTotals.GRC / total) * 100 : 50;
    $: secPercent = total ? 100 - grcPercent : 50;

    $: leadText = (() => {
        if (!total) return "Waiting for votes...";
        if (Math.abs(trackTotals.GRC - trackTotals.SecOps) < 0.01) return "It's a tie!";
        const leader = trackTotals.GRC > trackTotals.SecOps ? "GRC" : "SecOps";
        const diff = Math.abs(trackTotals.GRC - trackTotals.SecOps).toFixed(1);
        return `${leader} is leading by ${diff} points`;
    })();

    function createJudgeChart() {
        judgeChart = new Chart(judgeChartElement, {
            type: "bar",
            data: {
                labels: judgeLabels,
                datasets: [
                    {
                        label: "GRC",
                        data: judgeDataset.GRC,
                        backgroundColor: barColors.GRC,
                        borderColor: barBorderColors.GRC,
                        borderWidth: 1
                    },
                    {
                        label: "SecOps",
                        data: judgeDataset.SecOps,
                        backgroundColor: barColors.SecOps,
                        borderColor: barBorderColors.SecOps,
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true, min: 0, max: 10 } }
            }
        });
    }

    function updateJudgeChart() {
        judgeChart.data.labels = judgeLabels;
        judgeChart.data.datasets[0].data = judgeDataset.GRC;
        judgeChart.data.datasets[1].data = judgeDataset.SecOps;
        judgeChart.update();
    }

    onMount(() => {
        rawVotes = sampleVotes;
        recompute();
        createJudgeChart();
    });
</script>

<div class="min-h-screen flex flex-col bg-base-100 overflow-hidden p-6 pb-10">
    <div class="w-full max-w-6xl mx-auto flex flex-col gap-6 flex-1">
        <div class="rounded-3xl bg-base-200 shadow-lg p-6">
            <div class="text-center text-xl font-semibold mb-2">{leadText}</div>
            <div class="w-full h-6 flex rounded-full overflow-hidden border border-base-300">
                <div class="bg-emerald-500 transition-all" style={`width: ${grcPercent}%`}></div>
                <div class="bg-sky-500 transition-all" style={`width: ${secPercent}%`}></div>
            </div>
            <div class="flex justify-between text-sm mt-1 opacity-70">
                <span>GRC</span>
                <span>SecOps</span>
            </div>
        </div>

        <div class="flex-1 flex flex-col gap-4">
            <div class="rounded-3xl bg-base-200 shadow-lg flex flex-col overflow-hidden p-6">
                <h2 class="text-center text-2xl font-semibold mb-4">Judge Track Averages</h2>
                <div class="w-full min-h-[24rem] flex-1">
                    <canvas bind:this={judgeChartElement} class="w-full h-full"></canvas>
                </div>
            </div>  

            <div class="rounded-3xl bg-base-200 shadow-lg overflow-hidden px-6 py-4 flex-1">
                <h3 class="text-center text-xs font-semibold tracking-[0.25em] uppercase mb-3">
                    Top Contenders
                </h3>

                {#if !top3 || top3.length === 0}
                    <div class="text-center text-xs opacity-60 py-4">
                        Top dishes will appear here as votes come in.
                    </div>
                {:else}
                    <div class="flex-1 overflow-x-auto">
                        <table class="table table-sm w-full">
                            <thead class="text-xs">
                                <tr>
                                    <th class="w-12">Rank</th>
                                    <th>Dish</th>
                                    <th class="text-right">Avg Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each top3 as d, i}
                                    <tr class={ i === 0 ? "bg-yellow-300/60" : i === 1 ? "bg-gray-300/60" : i === 2 ? "bg-amber-600/40" : "" } >
                                        <td>{i + 1}</td>
                                        <td>{d.dishName}</td>
                                        <td class="text-right">{d.avgScore.toFixed(2)}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
