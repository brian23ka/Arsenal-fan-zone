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
                <p>Score: ${fixture.score}</p>
                <p><strong>Countdown: <span id="countdown"></span></strong></p>
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
