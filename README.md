# F1 Racing — Final Project

An independent, responsive Formula 1 fan guide for new and returning fans.

- Team: **F1 drivers**, group **SE-2512**
- Members: **Dinmukhamed Tamdybek**, **Asylzhan Abdukadirov**
- Live site: https://gdlllm.github.io/Assignment3WEB/
- Repository: https://github.com/Gdlllm/Assignment3WEB

## Open the project locally

Use the published site, or serve this folder over HTTP:

```sh
python -m http.server 8000
```

Open http://localhost:8000. Use the same address and port when testing saved accounts and themes. Opening individual HTML files directly is not recommended because browser storage behaviour can differ between file URLs.

## Pages

Home, Teams, Gallery, Race centre, Fan zone, Contact, About, Account, Profile, Max Verstappen, Kimi Antonelli and Michael Schumacher: **12 connected pages**. Profile redirects to Account when logged out.

## Requirements and implementation

| Requirement | Implementation |
| --- | --- |
| Responsive layout | Bootstrap grid, CSS Grid, wrapping navigation; tested at 360, 768 and 1440 px |
| Hosting | Static GitHub Pages site; local copies of Bootstrap and jQuery |
| Light/dark modes | Header button on every page, saved as `f1-theme` in localStorage |
| Authentication simulation | Sign up, duplicate-email check, login, profile and logout |
| JavaScript validation | Every form has `novalidate`; inline errors for required fields, email, phone and password rules where applicable |
| Search | Live driver filtering, suggestions, highlighted matches and saved search |
| UI effects | Button transitions, driver-card hover, race lights, counters and toast |
| External API | Jolpica F1 driver standings with season selection, loading state, timeout and retry |
| Theme relevance | Driver profiles, teams, race weekends, standings and fan activities |
| Code organization | Shared CSS and small JavaScript files grouped by responsibility |

## Code guide

- `js/theme.js`: applies the theme before the page is drawn.
- `js/main.js`: storage helpers, shared navigation, theme switch and FAQ.
- `js/script.js`: jQuery search, suggestions, counters, copying and lazy images.
- `js/validation.js`: JavaScript field checks and inline errors.
- `js/account.js`: signup, login and password hashing.
- `js/profile.js`: profile display, logged-out redirect and logout.
- `js/contact.js`: two-step contact draft, spinner and notification.
- `js/races.js`: external API request, table rendering and error recovery.
- `js/gallery.js`, `js/fan-zone.js`: earlier interactive F1 features.
- `css/style.css`, `css/paddock.css`: layout, themes and interactive styles.

## Storage and limitations

Accounts are a teaching simulation, not real secure authentication. Data belongs to one browser and origin. Passwords are stored as SHA-256 hashes rather than plaintext, but all account records remain accessible to the browser user. Use invented details and an unused demo password. No password is displayed on the profile.

Contact saves a draft locally and does not send mail. Theme, search and selected archived season are also saved locally. Private browsing or blocked storage may prevent saving; the site displays a message in that case.

Standings are fetched from `https://api.jolpi.ca/ergast/f1/{season}/driverstandings/`. The seasons are explicitly labelled as archives. Internet access and API availability are required for fresh data. See the [official API documentation](https://github.com/jolpica/jolpica-f1/blob/main/docs/README.md). An error is shown instead of invented results if the request fails.

## Suggested presentation sequence

1. Explain the audience and show Home, Teams and driver pages.
2. Demonstrate mobile navigation and a theme change across pages.
3. Filter drivers, select a suggestion, reload to show saved search.
4. Submit invalid signup data, then create a demo account and log in.
5. Show Profile, reload, log out and demonstrate the logged-out redirect.
6. Open Race centre, change the season and explain `fetch`, loading and errors.
7. Demonstrate the contact draft and one Fan zone interaction.

## Verification

Checked JavaScript syntax, local files and anchors, responsive layouts, theme persistence, invalid fields, signup/login/profile/logout, contact validation and spinner, API success and simulated failure followed by retry. The presentation itself must be delivered and explained by the team.
