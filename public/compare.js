let barChart = null;
let radarChart = null;

anime.animate('.compare-button', {
    scale: [0.5, 1],
    ease: anime.spring({
        bounce: 0.61,
        duration: 596
    })
});

async function getPlayer(first, last) {
    const check_db = await fetch(`/api/db-check?firstname=${first}&lastname=${last}`);
    const player_exist = await check_db.json();

    if (player_exist) {
        return player_exist;
    }

    const fetch_player = await fetch(`/api/fetch-player?firstname=${first}&lastname=${last}`);
    const player_data = await fetch_player.json();

    const push_to_db = await fetch('/api/db-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player_data)
    });
    return await push_to_db.json();
}

async function comparePlayers() {
    const f1 = document.getElementById('fn1').value;
    const l1 = document.getElementById('ln1').value;
    const f2 = document.getElementById('fn2').value;
    const l2 = document.getElementById('ln2').value;

    const player1 = await getPlayer(f1, l1);
    const player2 = await getPlayer(f2, l2);

    renderTable(player1, player2);
    renderBarChart(player1, player2);
    renderRadarChart(player1, player2);

    document.getElementById('main-display').style.display = 'grid';
}

function renderTable(p1, p2) {
    document.getElementById('p1-name').textContent = `${p1.player_first_name} ${p1.player_last_name}`;
    document.getElementById('p2-name').textContent = `${p2.player_first_name} ${p2.player_last_name}`;

    document.getElementById('p1-photo').src = p1.player_photo;
    document.getElementById('p1-mpg').textContent = p1.minutes_per_game;
    document.getElementById('p1-ppg').textContent = p1.points_per_game;
    document.getElementById('p1-apg').textContent = p1.assists_per_game;
    document.getElementById('p1-rpg').textContent = p1.rebounds_per_game;
    document.getElementById('p1-spg').textContent = p1.steals_per_game;
    document.getElementById('p1-bpg').textContent = p1.blocks_per_game;
    document.getElementById('p1-tpg').textContent = p1.turnovers_per_game;
    document.getElementById('p1-fpg').textContent = p1.fgp_per_game;
    document.getElementById('p1-thpg').textContent = p1.three_percentage_per_game;
    document.getElementById('p1-ftpg').textContent = p1.ftp_per_game;

    document.getElementById('p2-photo').src = p2.player_photo;
    document.getElementById('p2-mpg').textContent = p2.minutes_per_game;
    document.getElementById('p2-ppg').textContent = p2.points_per_game;
    document.getElementById('p2-apg').textContent = p2.assists_per_game;
    document.getElementById('p2-rpg').textContent = p2.rebounds_per_game;
    document.getElementById('p2-spg').textContent = p2.steals_per_game;
    document.getElementById('p2-bpg').textContent = p2.blocks_per_game;
    document.getElementById('p2-tpg').textContent = p2.turnovers_per_game;
    document.getElementById('p2-fpg').textContent = p2.fgp_per_game;
    document.getElementById('p2-thpg').textContent = p2.three_percentage_per_game;
    document.getElementById('p2-ftpg').textContent = p2.ftp_per_game;
}

function renderBarChart(p1, p2) {
    const ctx = document.getElementById('barChart').getContext('2d');

    if (barChart) { 
        barChart.destroy(); 
    }

    barChart = new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: ['Minutes', 'Points', 'Assists', 'Rebounds', 'Steals', 'Blocks', 'Turnovers','FG%', '3PT%', 'FT%'],
            datasets: [
                {
                    label: `${p1.player_first_name} ${p1.player_last_name}`,
                    data: [p1.minutes_per_game, p1.points_per_game, p1.assists_per_game, p1.rebounds_per_game, p1.steals_per_game, p1.blocks_per_game, p1.turnovers_per_game, p1.fgp_per_game, p1.three_percentage_per_game, p1.ftp_per_game],
                    backgroundColor: 'rgba(249, 115, 22, 0.7)', 
                    borderColor: '#f97316',
                    borderWidth: 1
                },
                {
                    label: `${p2.player_first_name} ${p2.player_last_name}`,
                    data: [p2.minutes_per_game, p2.points_per_game, p2.assists_per_game, p2.rebounds_per_game, p2.steals_per_game, p2.blocks_per_game, p2.turnovers_per_game, p2.fgp_per_game, p2.three_percentage_per_game, p2.ftp_per_game],
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                }
            ]
        },
    });
}

function renderRadarChart(p1, p2) {
    const ctx = document.getElementById('radarChart').getContext('2d');

    if (radarChart) { 
        radarChart.destroy(); 
    }

    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Points', 'Assists', 'Rebounds', 'Steals', 'Blocks', 'Turnovers'],
            datasets: [
                {
                    label: p1.player_last_name,
                    data: [p1.points_per_game, p1.assists_per_game, p1.rebounds_per_game, p1.steals_per_game, p1.blocks_per_game, p1.turnovers_per_game],
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    borderColor: '#38bdf8',
                    pointBackgroundColor: '#38bdf8'
                },
                {
                    label: p2.player_last_name,
                    data: [p2.points_per_game, p2.assists_per_game, p2.rebounds_per_game, p2.steals_per_game, p2.blocks_per_game, p2.turnovers_per_game],
                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                    borderColor: '#fbbf24',
                    pointBackgroundColor: '#fbbf24'
                }
            ]
        },
        options: {
            plugins: { 
                legend: { 
                    labels: { 
                        color: 'white' } 
                    } 
                },
            scales: {
                r: {
                    angleLines: { color: '#334155' },
                    grid: { color: '#334155' },
                    pointLabels: { color: 'white' },
                    ticks: { color: '#94a3b8', backdropColor: 'transparent' },
                    beginAtZero: true
                }
            }
        }
    });
}