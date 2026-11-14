const seasonSelect = document.getElementById('season');
const refreshButton = document.getElementById('refresh-standings');
const apiStatus = document.getElementById('api-status');
const standingsBody = document.getElementById('standings-body');
const savedSeason = readStore('f1-season', '2025');
seasonSelect.value = ['2024', '2025'].includes(savedSeason) ? savedSeason : '2025';
async function loadStandings() {
  const season = seasonSelect.value;
  standingsBody.replaceChildren();
  document.getElementById('standings-table').hidden = true;
  document.getElementById('api-loading').hidden = false;
  apiStatus.textContent = 'Loading the ' + season + ' championship standings...';
  refreshButton.disabled = true; seasonSelect.disabled = true;
  const controller = new AbortController();
  const timeout = setTimeout(function () { controller.abort(); }, 12000);
  try {
    // Fetch real public F1 data. These are explicitly labelled archived seasons.
    const response = await fetch('https://api.jolpi.ca/ergast/f1/' + season + '/driverstandings/', { signal: controller.signal });
    if (!response.ok) throw new Error('Request failed');
    const data = await response.json();
    const list = data.MRData.StandingsTable.StandingsLists[0];
    if (!list || !list.DriverStandings.length) throw new Error('No data');
    list.DriverStandings.forEach(function (entry) {
      const row = document.createElement('tr');
      const values = [entry.position, entry.Driver.givenName + ' ' + entry.Driver.familyName,
        entry.Constructors.map(team => team.name).join(', '), entry.points, entry.wins];
      values.forEach(function (value) {
        const cell = document.createElement('td'); cell.textContent = value; row.appendChild(cell);
      });
      standingsBody.appendChild(row);
    });
    document.getElementById('standings-table').hidden = false;
    apiStatus.textContent = season + ' season | After round ' + list.round + ' | Data loaded from Jolpica F1.';
    saveStore('f1-season', season);
  } catch {
    apiStatus.textContent = 'Standings could not be loaded. Check your connection and press Refresh to try again.';
  } finally {
    clearTimeout(timeout);
    document.getElementById('api-loading').hidden = true;
    refreshButton.disabled = false; seasonSelect.disabled = false;
  }
}
refreshButton.addEventListener('click', loadStandings);
seasonSelect.addEventListener('change', loadStandings);
loadStandings();
