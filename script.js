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
