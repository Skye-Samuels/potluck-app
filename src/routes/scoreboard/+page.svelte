<script>
    import { onMount, onDestroy } from "svelte";
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

    // Receive data from server
    export let data;

    let rawVotes = [];
    let trackTotals = { GRC: 0, SecOps: 0 };
    let judgeCharts = {}; // Store individual judge charts
    let judgeElements = {}; // Store canvas elements
    let judgeData = {}; // Store data per judge
    let dishes = [];
    let top3 = [];
    let config = { all_scores_submitted: false, event_started: false };
    let lastUpdate = null;
    let pollingInterval;
    let isLoading = false;
    let connectionStatus = 'connected'; // 'connected', 'error', 'polling'

    const barColors = {
        GRC: "oklch(59.6% 0.145 163.225 / 0.8)",
        SecOps: "oklch(58.8% 0.158 241.966 / 0.8)"
    };

    const barBorderColors = {
        GRC: "var(--color-emerald-600)",
        SecOps: "var(--color-sky-600)"
    };

    function recompute() {
        const judgeMap = {};
        const dishMap = {};

        // First pass: collect all votes
        for (const v of rawVotes) {
            const t = v.track;
            const s = Number(v.score);
            if (!["GRC", "SecOps"].includes(t) || !Number.isFinite(s)) continue;

            // Track judge data
            const j = v.judge || "Judge";
            if (!judgeMap[j]) judgeMap[j] = {};
            if (!judgeMap[j][t]) judgeMap[j][t] = { sum: 0, count: 0 };
            judgeMap[j][t].sum += s;
            judgeMap[j][t].count++;

            // Track dish data
            const id = v.dishId || v.dishName;
            if (!dishMap[id]) {
                dishMap[id] = {
                    id,
                    dishName: v.dishName,
                    track: t,
                    imageUrl: v.imageUrl || "",
                    sum: 0,
                    count: 0
                };
            }
            dishMap[id].sum += s;
            dishMap[id].count++;
        }

        // Calculate track totals as SUM OF DISH AVERAGES (fair method)
        // This ensures each dish contributes equally regardless of vote count
        const totals = { GRC: 0, SecOps: 0 };
        for (const dish of Object.values(dishMap)) {
            const avgScore = dish.count > 0 ? dish.sum / dish.count : 0;
            totals[dish.track] += avgScore;
        }

        trackTotals = totals;

        // Convert judgeMap to judgeData format for individual charts
        judgeData = {};
        for (const [judgeName, tracks] of Object.entries(judgeMap)) {
            judgeData[judgeName] = {
                GRC: tracks.GRC ? tracks.GRC.sum / tracks.GRC.count : 0,
                SecOps: tracks.SecOps ? tracks.SecOps.sum / tracks.SecOps.count : 0
            };
        }

        dishes = Object.values(dishMap).map((d) => ({
            ...d,
            avgScore: d.count ? d.sum / d.count : 0
        }));

        top3 = dishes
            .slice()
            .sort((a, b) => b.avgScore - a.avgScore)
            .slice(0, 3);
    }

    function setVotes(votes) {
        rawVotes = Array.isArray(votes) ? votes : [];
        recompute();
        updateAllJudgeCharts();
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

    function createJudgeChart(judgeName, canvasElement) {
        const data = judgeData[judgeName] || { GRC: 0, SecOps: 0 };
        
        const chart = new Chart(canvasElement, {
            type: "bar",
            data: {
                labels: ['GRC', 'SecOps'],
                datasets: [
                    {
                        label: 'Average Score',
                        data: [data.GRC, data.SecOps],
                        backgroundColor: [barColors.GRC, barColors.SecOps],
                        borderColor: [barBorderColors.GRC, barBorderColors.SecOps],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                },
                transitions: {
                    active: {
                        animation: {
                            duration: 400
                        }
                    }
                },
                plugins: { 
                    legend: { 
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: { 
                    y: { 
                        beginAtZero: true, 
                        min: 0, 
                        max: 10,
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
        
        judgeCharts[judgeName] = chart;
    }

    function updateAllJudgeCharts() {
        // Destroy old charts that no longer have data
        for (const judgeName of Object.keys(judgeCharts)) {
            if (!judgeData[judgeName]) {
                judgeCharts[judgeName].destroy();
                delete judgeCharts[judgeName];
            }
        }

        // Update existing charts
        for (const [judgeName, chart] of Object.entries(judgeCharts)) {
            const data = judgeData[judgeName] || { GRC: 0, SecOps: 0 };
            chart.data.datasets[0].data = [data.GRC, data.SecOps];
            chart.update('active');
        }

        // Create new charts for new judges (will happen on next render cycle)
    }

    /**
     * Poll for new data from the API
     */
    async function pollData() {
        if (isLoading) return;
        
        try {
            isLoading = true;
            connectionStatus = 'polling';
            
            const response = await fetch('/api/votes');
            const newData = await response.json();
            
            if (response.ok) {
                if (JSON.stringify(newData.votes) !== JSON.stringify(rawVotes)) {
                    setVotes(newData.votes);
                }
                
                config = newData.config;
                lastUpdate = new Date(newData.timestamp);
                connectionStatus = 'connected';
            } else {
                console.error('Failed to fetch data:', newData.error);
                connectionStatus = 'error';
            }
        } catch (error) {
            console.error('Polling error:', error);
            connectionStatus = 'error';
        } finally {
            isLoading = false;
        }
    }

    async function handleRefresh() {
        await pollData();
    }

    onMount(() => {
        setVotes(data.votes || []);
        config = data.config || { all_scores_submitted: false, event_started: false };
        lastUpdate = new Date(data.timestamp);
        
        // Create initial charts
        for (const [judgeName, element] of Object.entries(judgeElements)) {
            if (element) {
                createJudgeChart(judgeName, element);
            }
        }
        
        pollingInterval = setInterval(pollData, 15000);
        setTimeout(pollData, 2000);
    });

    onDestroy(() => {
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }
        
        // Destroy all charts
        for (const chart of Object.values(judgeCharts)) {
            chart.destroy();
        }
    });

    function formatTime(date) {
        if (!date) return '';
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // Reactive statement to create charts when new judges appear
    $: {
        if (Object.keys(judgeData).length > 0) {
            // Wait for next tick to ensure DOM is updated
            setTimeout(() => {
                for (const [judgeName, element] of Object.entries(judgeElements)) {
                    if (element && !judgeCharts[judgeName]) {
                        createJudgeChart(judgeName, element);
                    }
                }
            }, 0);
        }
    }

    // Calculate additional stats for display
    $: totalVotes = rawVotes.length;
    $: totalDishes = dishes.length;
</script>

<div class="min-h-screen bg-base-100 overflow-y-auto p-4">
    <!-- Status Bar -->
    <div class="w-full max-w-6xl mx-auto mb-2">
        <div class="flex justify-between items-center text-xs opacity-60">
            <div class="flex items-center gap-3">
                <span class="flex items-center gap-1">
                    {#if connectionStatus === 'connected'}
                        <span class="w-2 h-2 rounded-full bg-green-500"></span>
                        Connected
                    {:else if connectionStatus === 'error'}
                        <span class="w-2 h-2 rounded-full bg-red-500"></span>
                        Connection Error
                    {:else}
                        <span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                        Updating...
                    {/if}
                </span>
                <span class="hidden sm:inline">
                    Last update: {formatTime(lastUpdate)}
                </span>
                <span class="hidden md:inline opacity-50">
                    {totalVotes} votes • {totalDishes} dishes
                </span>
            </div>
            <button 
                on:click={handleRefresh}
                disabled={isLoading}
                class="btn btn-xs btn-ghost"
            >
                <span class:animate-spin={isLoading}>↻</span>
                Refresh
            </button>
        </div>
    </div>

    <div class="w-full max-w-6xl mx-auto flex flex-col gap-4 pb-8">
        <!-- Track Competition Progress -->
        <div class="rounded-3xl bg-base-200 shadow-lg p-6">
            <div class="text-center text-xl font-semibold mb-2">{leadText}</div>
            <div class="w-full h-6 flex rounded-full overflow-hidden border border-base-300">
                <div 
                    class="bg-emerald-500 transition-all duration-700 ease-out" 
                    style={`width: ${grcPercent}%`}
                ></div>
                <div 
                    class="bg-sky-500 transition-all duration-700 ease-out" 
                    style={`width: ${secPercent}%`}
                ></div>
            </div>
            <div class="flex justify-between text-sm mt-1 opacity-70">
                <span>GRC: {trackTotals.GRC.toFixed(1)}</span>
                <span>SecOps: {trackTotals.SecOps.toFixed(1)}</span>
            </div>
            <div class="text-center text-xs mt-2 opacity-50">
                Based on average scores per dish (fair for dietary restrictions)
            </div>
        </div>

        <!-- Individual Judge Charts -->
        <div class="rounded-3xl bg-base-200 shadow-lg p-6">
            <h2 class="text-center text-2xl font-semibold mb-6">Judge Track Averages</h2>
            
            {#if Object.keys(judgeData).length === 0}
                <div class="text-center text-sm opacity-60 py-8">
                    Waiting for judge votes...
                </div>
            {:else}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {#each Object.keys(judgeData).sort() as judgeName (judgeName)}
                        <div class="bg-base-100 rounded-2xl p-4 shadow">
                            <h3 class="text-center font-semibold mb-3">{judgeName}</h3>
                            <div style="height: 200px;">
                                <canvas bind:this={judgeElements[judgeName]}></canvas>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Top 3 Dishes -->
        <div class="rounded-3xl bg-base-200 shadow-lg overflow-hidden px-6 py-4">
            <h3 class="text-center text-xs font-semibold tracking-[0.25em] uppercase mb-3">
                Top Contenders
            </h3>

            {#if !top3 || top3.length === 0}
                <div class="text-center text-xs opacity-60 py-4">
                    Top dishes will appear here as votes come in.
                </div>
            {:else}
                <div class="flex flex-col gap-3">
                    {#each top3 as d, i (d.id)}
                        <div
                            class={`rounded-2xl p-4 flex items-center gap-4 border border-base-300 transition-all duration-500 ${
                                i === 0
                                    ? "bg-amber-200/70"
                                    : i === 1
                                        ? "bg-slate-100/90"
                                        : "bg-orange-200/70"
                            }`}
                        >
                            <div
                                class={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold text-base-100 ${
                                    i === 0
                                        ? "bg-amber-500"
                                        : i === 1
                                            ? "bg-slate-400"
                                            : "bg-orange-500"
                                }`}
                            >
                                {i + 1}
                            </div>
                            <div class="flex-1">
                                <div class="font-semibold">{d.dishName}</div>
                                <div class="text-xs opacity-60">{d.count} vote{d.count !== 1 ? 's' : ''}</div>
                            </div>
                            <div class="text-right">
                                <div class="text-[11px] uppercase tracking-wide opacity-70">Score</div>
                                <div class="text-xl font-semibold leading-tight">{d.avgScore.toFixed(2)}</div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>