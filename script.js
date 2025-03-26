// Fetch the highlights JSON file
fetch('highlights.json')
    .then(response => response.json())
    .then(data => {
        console.log('Raw fetched data:', data);
        const selectElement = document.getElementById('highlightSelect');
        const videoElement = document.getElementById('highlightVideo');
        const videoSourceElement = document.getElementById('videoSource');

        // Populate the dropdown with match options
        data.matches.forEach(match => {
            const option = document.createElement('option');
            option.value = match.highlight_url;
            option.textContent = `${match.home_team} vs ${match.away_team} (${match.match_date})`;
            selectElement.appendChild(option);
        });

        // Event listener for when a match is selected
        selectElement.addEventListener('change', function () {
            const selectedVideoUrl = selectElement.value;

            // If the selected option is not empty, update the video source and play
            if (selectedVideoUrl) {
                videoSourceElement.src = selectedVideoUrl;
                videoElement.load(); // Load the new video
                videoElement.play().catch(error => {
                    console.error('Error playing the video:', error);
                });
            }
        });
    })
    .catch(error => {
        console.error('Error fetching the highlights data:', error);
    });


// fixtures section
fetch("fixtures.json")
    .then(response => response.json())
    .then(data => {
        console.log("Raw fetched data:", data); // Debugging log

        if (!data.matches || !Array.isArray(data.matches) || data.matches.length === 0) {
            throw new Error("No valid fixture data found.");
        }

        const fixtures = data.matches; // Extract fixtures
        let currentIndex = 0; // Track the current fixture

        function updateFixture() {
            if (currentIndex >= fixtures.length) return;

            const fixture = fixtures[currentIndex];
            const fixtureContainer = document.querySelector(".fixtures-list");
            fixtureContainer.innerHTML = ""; // Clear previous fixture

            const fixtureItem = document.createElement("div");
            fixtureItem.classList.add("fixture-item");
            fixtureItem.innerHTML = `
                <h3>Next Match</h3>
                <p><strong>${fixture.home_team}</strong> vs <strong>${fixture.away_team}</strong></p>
                <p>League: ${fixture.league}</p>
                <p>Date: ${new Date(fixture.match_date).toDateString()}</p>
                <p>Stadium: ${fixture.stadium}</p>
                <p><strong>Countdown: <span id="countdown"></span></strong></p>
                <p id="score" style="display:none;"><strong>Score: ${fixture.score}</strong></p> <!-- Hide score initially -->
            `;
            fixtureContainer.appendChild(fixtureItem);

            startCountdown(new Date(fixture.match_date));
        }

        function startCountdown(matchDate) {
            function updateTimer() {
                const now = new Date().getTime();
                const timeRemaining = matchDate.getTime() - now;

                if (timeRemaining <= 0) {
                    document.getElementById("countdown").innerText = "Match is Live!";
                    document.getElementById("score").style.display = "block";  // Show score after countdown ends
                    setTimeout(() => {
                        currentIndex++; // Move to next fixture
                        if (currentIndex < fixtures.length) {
                            updateFixture();
                        }
                    }, 5000); // Wait 5 seconds before switching
                    return;
                }

                const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

                document.getElementById("countdown").innerText =
                    `${days}d ${hours}h ${minutes}m ${seconds}s`;

                setTimeout(updateTimer, 1000); // Update countdown every second
            }

            updateTimer();
        }

        updateFixture(); // Start with the first fixture
    })
    .catch(error => console.error("Error loading fixtures:", error));

// stats
// stats 
document.addEventListener("DOMContentLoaded", () => {
    fetchPlayerStats();
});

function fetchPlayerStats() {
    fetch("stats.json")
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data.players)) throw new Error("Unexpected data format");
            displayStats(data.players, true); // Initially hide all stats
        })
        .catch(error => console.error("Error loading player stats:", error));
}

function displayStats(players, hideAll = false) {
    const statsContainer = document.querySelector(".stats-list");
    statsContainer.innerHTML = ""; // Clear previous content

    players.forEach(player => {
        const statElement = document.createElement("div");
        statElement.classList.add("player-stat");
        statElement.style.display = hideAll ? "none" : "block"; // Hide initially if specified
        statElement.innerHTML = `
            <h3>${player.player}</h3>
            <p>Position: ${player.position}</p>
            <p>Appearances: ${player.appearances}</p>
            <p>Goals: ${player.goals}</p>
            <p>Assists: ${player.assists}</p>
        `;
        statsContainer.appendChild(statElement);
    });
}

// Implement search functionality
document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const searchInput = document.getElementById("search-player").value.toLowerCase();

    fetch("stats.json")
        .then(response => response.json())
        .then(data => {
            const players = Array.isArray(data.players) ? data.players : [];
            if (!Array.isArray(players)) throw new Error("Unexpected data format");

            const filteredPlayers = players.filter(player => 
                player.player.toLowerCase().includes(searchInput)
            );

            displayStats(filteredPlayers, false); // Show only the searched player
        })
        .catch(error => console.error("Error filtering player stats:", error));
});
// STANDINGS
// Sample standings data for all 20 teams
const standings = [
    { "position": 1, "team": "Arsenal", "played": 30, "wins": 22, "draws": 5, "losses": 3, "points": 71 },
    { "position": 2, "team": "Manchester City", "played": 30, "wins": 21, "draws": 6, "losses": 3, "points": 69 },
    { "position": 3, "team": "Liverpool", "played": 30, "wins": 20, "draws": 7, "losses": 3, "points": 67 },
    { "position": 4, "team": "Aston Villa", "played": 30, "wins": 18, "draws": 6, "losses": 6, "points": 60 },
    { "position": 5, "team": "Tottenham Hotspur", "played": 30, "wins": 17, "draws": 6, "losses": 7, "points": 57 },
    { "position": 6, "team": "Manchester United", "played": 30, "wins": 16, "draws": 5, "losses": 9, "points": 53 },
    { "position": 7, "team": "Newcastle United", "played": 30, "wins": 15, "draws": 6, "losses": 9, "points": 51 },
    { "position": 8, "team": "West Ham United", "played": 30, "wins": 14, "draws": 7, "losses": 9, "points": 49 },
    { "position": 9, "team": "Brighton", "played": 30, "wins": 12, "draws": 9, "losses": 9, "points": 45 },
    { "position": 10, "team": "Chelsea", "played": 30, "wins": 11, "draws": 9, "losses": 10, "points": 42 },
    { "position": 11, "team": "Brentford", "played": 30, "wins": 10, "draws": 8, "losses": 12, "points": 38 },
    { "position": 12, "team": "Crystal Palace", "played": 30, "wins": 9, "draws": 9, "losses": 12, "points": 36 },
    { "position": 13, "team": "Fulham", "played": 30, "wins": 9, "draws": 8, "losses": 13, "points": 35 },
    { "position": 14, "team": "Nottingham Forest", "played": 30, "wins": 8, "draws": 9, "losses": 13, "points": 33 },
    { "position": 15, "team": "Bournemouth", "played": 30, "wins": 8, "draws": 8, "losses": 14, "points": 32 },
    { "position": 16, "team": "Wolves", "played": 30, "wins": 7, "draws": 9, "losses": 14, "points": 30 },
    { "position": 17, "team": "Everton", "played": 30, "wins": 7, "draws": 8, "losses": 15, "points": 29 },
    { "position": 18, "team": "Luton Town", "played": 30, "wins": 6, "draws": 7, "losses": 17, "points": 25 },
    { "position": 19, "team": "Burnley", "played": 30, "wins": 5, "draws": 6, "losses": 19, "points": 21 },
    { "position": 20, "team": "Sheffield United", "played": 30, "wins": 4, "draws": 5, "losses": 21, "points": 17 }
];

// Function to display standings in the HTML table
function displayStandings(standings) {
    const standingsContainer = document.getElementById("league-standings");
    standingsContainer.innerHTML = ''; // Clear previous table content

    // Create a heading for the standings table
    const heading = document.createElement("h2");
    heading.innerText = "League Standings";
    standingsContainer.appendChild(heading);  // Add the heading above the table

    // Create the table header
    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>Position</th>
                <th>Team</th>
                <th>Played</th>
                <th>Won</th>
                <th>Drawn</th>
                <th>Lost</th>
                <th>Points</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    const tbody = table.querySelector("tbody");

    standings.forEach(team => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${team.position}</td>
            <td>${team.team}</td>
            <td>${team.played}</td>
            <td>${team.wins}</td>
            <td>${team.draws}</td>
            <td>${team.losses}</td>
            <td>${team.points}</td>
        `;
        tbody.appendChild(row);
    });

    standingsContainer.appendChild(table);
}

// Call the display function initially to show standings
displayStandings(standings);

// Sample fixture data (this part can be expanded based on actual fixture data)
const fixtures = [
    { "id": 25, "home_team": "Liverpool", "away_team": "Arsenal", "score": "2-1" },
    { "id": 26, "home_team": "Manchester United", "away_team": "Chelsea", "score": "1-1" },
    // More fixtures...
];

// Function to update standings after a fixture
function updateStandingsAfterFixture(fixture) {
    const homeTeam = standings.find(team => team.team === fixture.home_team);
    const awayTeam = standings.find(team => team.team === fixture.away_team);

    if (!homeTeam || !awayTeam) {
        console.error("Team not found in standings");
        return;
    }

    // Assume fixture.score is a string like "2-1" (homeGoals-awayGoals)
    const score = fixture.score.split("-");
    const homeGoals = parseInt(score[0], 10);
    const awayGoals = parseInt(score[1], 10);

    // Update match stats based on the result
    if (homeGoals > awayGoals) {
        // Home team wins
        homeTeam.wins++;
        homeTeam.points += 3;
        awayTeam.losses++;
    } else if (homeGoals < awayGoals) {
        // Away team wins
        awayTeam.wins++;
        awayTeam.points += 3;
        homeTeam.losses++;
    } else {
        // Draw
        homeTeam.draws++;
        awayTeam.draws++;
        homeTeam.points++;
        awayTeam.points++;
    }

    // Update played matches
    homeTeam.played++;
    awayTeam.played++;

    // Sort standings by points and update the table
    standings.sort((a, b) => b.points - a.points);
    displayStandings(standings); // Re-render the standings table
}

// Example: Update standings after a fixture
fixtures.forEach(fixture => updateStandingsAfterFixture(fixture));
