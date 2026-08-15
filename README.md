# PropCare — Smart Property Maintenance Management

Interactive HTML/CSS/JS prototype for **Obs Realty Group (OBS REALTY)**: a property maintenance management system for a residential portfolio across the Western Cape.

## Purpose

PropCare connects residents, property managers and technicians in one auditable maintenance workflow:

- Residents report issues in under a minute — with category, urgency and photos.
- Managers review, prioritise and assign the right technician.
- Technicians accept jobs, update progress and close work out with notes and photos.
- Every request keeps a full status history and conversation trail.

## Demo accounts

Open the prototype, pick a demo account on the login screen, and sign in (any password works — demo only).

| Role | Person | Can do |
|------|--------|--------|
| Tenant | Sarah Williams | Report issues, track requests, confirm completion |
| Property Manager | Michael Jacobs | Review/prioritise, assign technicians, monitor portfolio |
| Technician | Johan van der Merwe | Accept jobs, update status, mark complete |
| Administrator | System Admin | Users, roles, categories, reports, settings |

## Screens

- Login, tenant overview, "My requests", request detail with timeline + conversation
- Report-an-issue wizard (category → urgency → details → photo → submit)
- Manager portfolio, assignment modal, technicians, reports
- Technician jobs / schedule / completed
- Admin users, roles & permissions, categories, settings
- Notifications (activity centre), profile, and a "Design reference" gallery with the original mockups

## Structure

```
prototype/
  index.html          # Shell (login + workspace)
  css/styles.css      # Brand, layout, responsive (mobile bottom nav)
  js/app.js           # Router, login, role screens, report wizard, actions
  data/propcare.js    # Dummy data: categories, properties, users, requests
  assets/mockups/     # Original UI mockups (embedded in the gallery)
```

## Run locally

```bash
cd prototype
python -m http.server 8124
# open http://localhost:8124
```

Or open `prototype/index.html` directly in a browser.

## CI / Deploy

`.github/workflows/build.yml` validates the HTML and JavaScript on every push/PR and deploys the prototype to GitHub Pages on `main`.

## Notes

- Prototype only — no external services, all data is in-browser demo data.
- Brand colours: navy `#172336`, teal `#a7cfce`, page background `#f2f4f8`.
