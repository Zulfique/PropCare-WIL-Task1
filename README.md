# PropCare — Smart Property Maintenance Management

Interactive HTML/CSS/JS prototype for **Obs Realty Group (OBS REALTY)**: a property maintenance management system for a residential portfolio across the Western Cape.

## Purpose

PropCare connects residents, property managers and technicians in one auditable maintenance workflow:

- Residents report issues in under a minute — with category, urgency and photos.
- Managers review, prioritise and assign the right technician.
- Technicians accept jobs, update progress and close work out with notes and photos.
- Every request keeps a full status history and conversation trail.

## Demo accounts

Open the prototype at `login.html`, pick a demo account, and sign in (any password works — demo only).

| Role | Person | Email | Password |
|------|--------|-------|----------|
| Tenant | Sarah Williams | sarahwilliams@example.com | password123 |
| Property Manager | Michael Jacobs | michaeljacobs@example.com | password123 |
| Technician | Johan van der Merwe | johan@example.com | password123 |
| Administrator | System Admin | admin@example.com | password123 |

## Screens

- **Login** — Split-screen design with brand benefits on left, login form on right
- **Dashboard/Overview** — Tenant overview with stats, recent requests, workload pulse
- **My requests** — Searchable requests list with status filters
- **Profile** — User profile settings
- **Notifications** — Activity center with all notifications
- **Property management** — Property and portfolio views
- Additional screens for detailed workflows (request detail, report-an-issue wizard, etc.)

## Structure

```
prototype/
  ├── login.html              # Entry point: login screen with demo account selector
  ├── index.html              # Dashboard/overview for logged-in users
  ├── requests.html           # My requests page with search & filters
  ├── profile.html            # User profile page
  ├── notifications.html      # Notifications/activity center
  ├── property.html           # Property management page
  ├── 
  ├── css/
  │   └── styles.css          # All styling: colors, layout, components, responsive design
  │
  ├── js/
  │   ├── app.js              # Main application logic, shell mounting, navigation
  │   └── icons.js            # Icon utilities and definitions
  │
  ├── data/
  │   ├── user.js             # User data (profiles, roles, permissions)
  │   ├── requests.js         # Maintenance requests dummy data
  │   ├── notifications.js    # Notifications/activity data
  │   ├── overview.js         # Dashboard statistics and metrics
  │   └── properties.js       # Property and portfolio data
  │
  └── assets/
      └── favicon.svg         # App favicon
```

## Design System

**Colors:**
- Navy: `#101d31` (primary dark background)
- Teal: `#2fc4ac` (accent color)
- Background: `#f4f6f8` (page background)
- Text: `#16202c` (primary text)

**Typography:**
- Font family: Inter, system fonts
- Responsive sizing across all breakpoints

**Components:**
- Login screen with split layout
- Cards with consistent shadows
- Data tables with filtering
- Badges for status and priority
- Responsive navigation sidebar
- Top bar with user menu

## Run locally

```bash
cd prototype
python -m http.server 8124
# open http://localhost:8124/login.html
```

Or open `prototype/login.html` directly in any modern browser.

## Getting Started

1. Open `login.html` to see the login screen
2. Select a demo account from the dropdown (e.g., "Sarah Williams — Tenant")
3. Use any password (demo only, no validation)
4. Click "Sign in to PropCare" to access the dashboard

## Features

- **Responsive Design** — Works on desktop, tablet, and mobile
- **Demo Data** — All data is in-browser, changes reset on page refresh
- **No External APIs** — Fully self-contained prototype
- **Accessible** — Semantic HTML, keyboard navigation, color contrast
- **Modern CSS** — CSS custom properties, Grid, Flexbox, Gradients
- **Vanilla JavaScript** — No frameworks, lightweight and fast

## Development

### File Organization

- `login.html` - Entry point with authentication UI
- Individual page files (`index.html`, `requests.html`, etc.) handle navigation
- `js/app.js` coordinates routing and page mounting
- `data/*.js` contains all dummy data
- `css/styles.css` defines the complete design system

### Styling Approach

All styles are in `css/styles.css` using:
- CSS custom properties (variables) for colors and spacing
- Mobile-first responsive design
- Grid and Flexbox for layouts
- Semantic class names for maintainability

### Adding New Pages

1. Create a new HTML file (e.g., `newpage.html`)
2. Use the same app-shell structure as other pages
3. Mount using `PC.mountShell("pagename")`
4. Add relevant page-specific data in `data/` folder
5. Link navigation in the sidebar (managed by `app.js`)

## CI / Deploy

`.github/workflows/build.yml` validates the HTML and JavaScript on every push/PR and deploys the prototype to GitHub Pages on `main`.

## Deployment URL

View the live prototype at: https://zulfique.github.io/PropCare-WIL-Task1/login.html

## Notes

- **Prototype only** — no external services, all data is in-browser demo data
- **Demo credentials** — email and password are pre-filled but not validated
- **Brand colors**:
  - Navy: `#101d31`
  - Teal: `#2fc4ac`
  - Soft Navy: `#16233a`
  - Background: `#f4f6f8`
- **Font** — Inter (system fonts fallback)
- **Browser support** — Modern browsers (Chrome, Firefox, Safari, Edge)

## License

Internal prototype for Obs Realty Group.

