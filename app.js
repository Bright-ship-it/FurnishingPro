// Balanced Football Team Generator with Captains

// HTML Structure
const appHTML = `
  <div class="p-4 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Tuesday Night Football - Teams Generator!</h1>

    <div class="mb-4">
      <h2 class="text-lg font-semibold">Add Players</h2>
      <input id="playerName" type="text" placeholder="Player Name" class="border rounded p-2 mr-2 w-1/2" />
      <select id="playerPosition" class="border rounded p-2">
        <option value="defender">Defender</option>
        <option value="midfielder">Midfielder</option>
        <option value="forward">Forward</option>
      </select>
      <button id="addPlayerBtn" class="bg-blue-500 text-white p-2 rounded ml-2">Add Player</button>
    </div>

    <div class="mb-4">
      <h2 class="text-lg font-semibold">Captains</h2>
      <input id="captain1" type="text" placeholder="Captain - Team Black" class="border rounded p-2 mr-2 w-1/2" />
      <input id="captain2" type="text" placeholder="Captain - Team White" class="border rounded p-2 w-1/2" />
    </div>

    <div class="mb-4">
      <h2 class="text-lg font-semibold">Player List - Paying members ONLY!</h2>
      <ul id="playerList" class="border rounded p-4"></ul>
    </div>

    <div class="mb-4">
      <button id="generateTeamsBtn" class="bg-green-500 text-white p-2 rounded">VAMOS!</button>
    </div>

    <div id="teamsOutput" class="mt-4"></div>
  </div>
`;

document.body.innerHTML = appHTML;

data = {
  players: [],
  captains: { team1: null, team2: null },
  gameWeek: 1,
};

// Event Listeners
document.getElementById("addPlayerBtn").addEventListener("click", () => {
  const name = document.getElementById("playerName").value.trim();
  const position = document.getElementById("playerPosition").value;

  if (!name) {
    alert("Please enter a player name.");
    return;
  }

  // Add player to list
  data.players.push({ name, position });
  updatePlayerList();

  // Clear inputs
  document.getElementById("playerName").value = "";
  document.getElementById("playerPosition").value = "defender";
});

document.getElementById("generateTeamsBtn").addEventListener("click", () => {
  const captain1 = document.getElementById("captain1").value.trim();
  const captain2 = document.getElementById("captain2").value.trim();

  if (!captain1 || !captain2) {
    alert("Please set captains for both teams.");
    return;
  }

  if (captain1 === captain2) {
    alert("Captains cannot be the same person. Please set different captains.");
    return;
  }

  data.captains.team1 = captain1;
  data.captains.team2 = captain2;

  if (data.players.length < 2) {
    alert("Not enough players to generate teams.");
    return;
  }

  const teams = generateBalancedTeams(data.players);
  displayTeams(teams.team1, teams.team2);
});

// Functions
function updatePlayerList() {
  const listEl = document.getElementById("playerList");
  listEl.innerHTML = "";

  data.players.forEach((player, index) => {
    const li = document.createElement("li");
    li.textContent = `${player.name} (${player.position})`;
    li.className = "flex justify-between items-center py-1";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "text-red-500 text-sm";
    removeBtn.addEventListener("click", () => {
      data.players.splice(index, 1);
      updatePlayerList();
    });

    li.appendChild(removeBtn);
    listEl.appendChild(li);
  });
}

function generateBalancedTeams(players) {
  // Shuffle players
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);

  // Divide into two teams
  const half = Math.ceil(shuffledPlayers.length / 2);
  const team1 = shuffledPlayers.slice(0, half);
  const team2 = shuffledPlayers.slice(half);

  // Ensure captains are on different teams
  if (
    team1.some((p) => p.name === data.captains.team2) &&
    team2.some((p) => p.name === data.captains.team1)
  ) {
    return { team1, team2 };
  }

  // Adjust teams if captains are on the same team
  if (team1.some((p) => p.name === data.captains.team2)) {
    const captain2Player = team1.find((p) => p.name === data.captains.team2);
    const swapPlayer = team2[0];
    team2[0] = captain2Player;
    team1.splice(team1.indexOf(captain2Player), 1, swapPlayer);
  }

  if (team2.some((p) => p.name === data.captains.team1)) {
    const captain1Player = team2.find((p) => p.name === data.captains.team1);
    const swapPlayer = team1[0];
    team1[0] = captain1Player;
    team2.splice(team2.indexOf(captain1Player), 1, swapPlayer);
  }

  return { team1, team2 };
}

function displayTeams(team1, team2) {
  const outputEl = document.getElementById("teamsOutput");

  outputEl.innerHTML = `
    <div class="border rounded p-4 mb-4">
      <h2 class="text-lg font-semibold">Team Black</h2>
      <p class="font-bold">Captain: ${data.captains.team1}</p>
      <ul class="list-disc ml-4">
        ${team1.map((p) => `<li>${p.name} (${p.position})</li>`).join("")}
      </ul>
    </div>

    <div class="border rounded p-4">
      <h2 class="text-lg font-semibold">Team White</h2>
      <p class="font-bold">Captain: ${data.captains.team2}</p>
      <ul class="list-disc ml-4">
        ${team2.map((p) => `<li>${p.name} (${p.position})</li>`).join("")}
      </ul>
    </div>
  `;

  rotateCaptains();
}

function rotateCaptains() {
  if (data.gameWeek % 3 === 0) {
    alert("Game Week 3 reached! Rotating captains...");
    const temp = data.captains.team1;
    data.captains.team1 = data.captains.team2;
    data.captains.team2 = temp;
  }
  data.gameWeek++;
}
