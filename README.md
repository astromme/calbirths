# California Births Visualization

A simple website visualizing San Francisco birth data by month from California's vital statistics.

**Live Site:** https://astromme.github.io/calbirths/

## Features

- Interactive line chart showing monthly births in San Francisco
- Separate lines for each year (2024, 2025)
- Historical data visualization (1960-2024)
- Responsive design that works on mobile and desktop
- Data from California Department of Public Health provisional birth records
- Automated deployment via GitHub Actions

## Project Structure

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions deployment workflow
├── index.html                   # Main visualization page
├── public/
│   └── data/
│       └── sf-births.json      # Processed birth data
├── scripts/
│   └── process_births.py       # Data processing script
└── births-data/                 # Raw CSV data from CA Dept of Public Health
```

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions whenever changes are pushed to the `main` branch.

**Setup (one-time):**
1. Go to repository Settings → Pages
2. Under "Build and deployment", set Source to "GitHub Actions"

The workflow will:
1. Process the CSV data files using `process_births.py`
2. Generate the JSON data file
3. Deploy all static files to GitHub Pages

## Running Locally

1. Start a local web server:
   ```bash
   python3 -m http.server 8000
   ```

2. Open your browser to: http://localhost:8000

## Updating Data

When new data becomes available:

1. Replace or update the CSV file in `births-data/`
2. Commit and push to the `main` branch
3. GitHub Actions will automatically regenerate the JSON and redeploy the site

For local testing, run the processing script manually:
```bash
python3 scripts/process_births.py
```

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Charting**: Chart.js 4.4.0 (via CDN)
- **Data Processing**: Python 3
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions
- **No build step required** - just open index.html in a browser!

## Data Source

California Department of Public Health, Center for Health Statistics and Informatics, Vital Statistics Branch.

Provisional counts based on California Comprehensive Birth File (Dynamic), 2024-2025.

## Future Enhancements

- Add more counties for comparison
- Add demographic breakdowns (race/ethnicity, age groups, birth place type)
- Year-over-year comparison statistics
- Export chart as image
