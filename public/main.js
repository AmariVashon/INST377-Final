async function getOrSyncPlayer(first, last) {
            const check_db = await fetch(`/api/db-check?firstname=${first}&lastname=${last}`);
            const player_exist = await check_db.json();

            if (player_exist) {
                return player_exist;
            }

            const fetch_player = await fetch(`/api/external-fetch?firstname=${first}&lastname=${last}`);
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

            const player1 = await getOrSyncPlayer(f1, l1);
            const player2 = await getOrSyncPlayer(f2, l2);

            renderTable(player1, player2);
        }

function renderTable(p1, p2) {
    document.getElementById('table-container').innerHTML = `
        <table border="1" style="width:100%; margin-top:20px; text-align:center; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #eee;">
                    <th>Stat</th>
                    <th>${p1.player_first_name} ${p1.player_last_name}</th>
                    <th>${p2.player_first_name} ${p2.player_last_name}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Points Per Game</td>
                    <td>${p1.points_per_game}</td>
                    <td>${p2.points_per_game}</td>
                </tr>
                <tr>
                    <td>Assists Per Game</td>
                    <td>${p1.assists_per_game}</td>
                    <td>${p2.assists_per_game}</td>
                </tr>
                <tr>
                    <td>Rebounds Per Game</td>
                    <td>${p1.rebounds_per_game}</td>
                    <td>${p2.rebounds_per_game}</td>
                </tr>
            </tbody>
        </table>
    `;
}