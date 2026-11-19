const seasonSelect = document.getElementById('season');
const refreshButton = document.getElementById('refresh-standings');
const apiStatus = document.getElementById('api-status');
const standingsBody = document.getElementById('standings-body');
const savedSeason = readStore('f1-season', '2025');
seasonSelect.value = ['2024', '2025'].includes(savedSeason) ? savedSeason : '2025';

// Stop waiting when an API is unavailable. Always clear the timeout.
async function getRaceData(url) {
  const controller = new AbortController();
  const timeout = setTimeout(function () { controller.abort(); }, 12000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error('Request failed: ' + response.status);
    return await response.json();
  } finally { clearTimeout(timeout); }
}

async function loadJolpica(season) {
  const data = await getRaceData('https://api.jolpi.ca/ergast/f1/' + season + '/driverstandings/');
  const list = data.MRData.StandingsTable.StandingsLists[0];
  if (!list || list.season !== season || !list.DriverStandings.length) throw new Error('No data');
  return {
    season: season, round: list.round, source: 'Jolpica F1',
    rows: list.DriverStandings.map(function (entry) {
      return [entry.position, entry.Driver.givenName + ' ' + entry.Driver.familyName,
        entry.Constructors.map(team => team.name).join(', '), entry.points, entry.wins];
    })
  };
}

// OpenF1 uses driver numbers. The local archive only supplies their names and teams.
// Championship positions and points are fetched from the public API on each request.
async function loadOpenF1(season) {
  const rosters = await getRaceData('data/driver-rosters.json');
  const archive = rosters[season];
  const standings = await getRaceData('https://api.openf1.org/v1/championship_drivers?session_key=' + archive.session);
  if (!Array.isArray(standings) || standings.length !== Object.keys(archive.drivers).length) throw new Error('Incomplete data');
  const rows = standings.map(function (entry) {
    const driver = archive.drivers[entry.driver_number];
    if (!driver || entry.session_key !== archive.session || !Number.isFinite(entry.position_current) ||
        !Number.isFinite(entry.points_current)) throw new Error('Invalid data');
    // This endpoint does not provide wins. A dash means unavailable, not zero.
    return [entry.position_current, driver.name, driver.teams.join(', '), entry.points_current, '-'];
  });
  rows.sort(function (a, b) { return a[0] - b[0]; });
  return { season: season, round: archive.round, source: 'OpenF1', rows: rows };
}

function showStandings(data, saved) {
  standingsBody.replaceChildren();
  data.rows.forEach(function (values) {
    const row = document.createElement('tr');
    values.forEach(function (value) {
      const cell = document.createElement('td'); cell.textContent = value; row.appendChild(cell);
    });
    standingsBody.appendChild(row);
  });
  document.getElementById('standings-table').hidden = false;
  apiStatus.textContent = data.season + ' season | After round ' + data.round + ' | ' +
    (saved ? 'APIs unavailable. Showing saved ' + data.source + ' data from ' + new Date(data.savedAt).toLocaleString() + '.' :
      'Data loaded from ' + data.source + '.');
  if (data.source === 'OpenF1') apiStatus.textContent += ' Wins are not provided by this source.';
}

async function loadStandings() {
  if (refreshButton.disabled) return;
  const season = seasonSelect.value;
  standingsBody.replaceChildren();
  document.getElementById('standings-table').hidden = true;
  document.getElementById('api-loading').hidden = false;
  apiStatus.textContent = 'Loading the ' + season + ' championship standings...';
  refreshButton.disabled = true; seasonSelect.disabled = true;
  try {
    let data;
    try { data = await loadJolpica(season); }
    catch {
      apiStatus.textContent = 'Trying the backup standings source...';
      data = await loadOpenF1(season);
    }
    data.savedAt = new Date().toISOString();
    showStandings(data, false);
    saveStore('f1-standings-' + season, data);
    saveStore('f1-season', season);
  } catch {
    const saved = readStore('f1-standings-' + season, null);
    if (saved && saved.season === season && Array.isArray(saved.rows) && saved.rows.length &&
        saved.rows.every(row => Array.isArray(row) && row.length === 5) &&
        ['Jolpica F1', 'OpenF1'].includes(saved.source) && Number.isFinite(Date.parse(saved.savedAt))) {
      showStandings(saved, true);
    } else {
      apiStatus.textContent = 'Both standings sources are unavailable and there is no saved result for ' + season + '. Check your connection and press Refresh to try again.';
    }
  } finally {
    document.getElementById('api-loading').hidden = true;
    refreshButton.disabled = false; seasonSelect.disabled = false;
  }
}
refreshButton.addEventListener('click', loadStandings);
seasonSelect.addEventListener('change', loadStandings);
loadStandings();
