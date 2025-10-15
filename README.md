# California Births Visualization

An interactive website visualizing birth data across all 58 California counties from California's vital statistics, featuring historical trends from 1960-2024 and provisional data through 2025.

**Live Site:** https://astromme.github.io/calbirths/

## Features

- **All 58 California Counties**: Individual pages for each county with dedicated visualizations
- **Aggregate View**: Homepage showing total births across all counties
- **Interactive Charts**: Monthly and annual birth trend visualizations using Chart.js
- **Historical Data**: Birth statistics from 1960-2024
- **Provisional Data**: Latest data for 2024-2025
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Fast Navigation**: Client-side routing with React Router for instant page transitions
- **Automated Deployment**: Updates automatically via GitHub Actions

## Project Structure

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions deployment workflow
├── src/
│   ├── main.jsx                 # Entry point
│   ├── App.jsx                  # Main router
│   ├── pages/
│   │   ├── HomePage.jsx         # Aggregate view for all counties
│   │   └── CountyPage.jsx       # Individual county view (reusable)
│   ├── components/
│   │   ├── CountyNav.jsx        # County navigation bar
│   │   ├── MonthlyChart.jsx     # Monthly births chart component
│   │   └── AnnualChart.jsx      # Annual births chart component
│   ├── utils/
│   │   └── dataLoader.js        # Data loading utilities
│   └── styles/
│       └── App.css              # Global styles
├── public/
│   ├── data/
│   │   ├── *-births.json        # Individual county data files (58 files)
│   │   ├── california-total-births.json  # Aggregate data
│   │   └── counties.json        # List of all counties
│   └── 404.html                 # SPA routing fallback
├── scripts/
│   └── process_births.py        # Data processing script
├── births-data/                 # Raw CSV data from CA Dept of Public Health
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies
```

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **Charting**: Chart.js + react-chartjs-2
- **Package Manager**: pnpm
- **Data Processing**: Python 3
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions whenever changes are pushed to the `main` branch.

**Setup (one-time):**
1. Go to repository Settings → Pages
2. Under "Build and deployment", set Source to "GitHub Actions"

The workflow will:
1. Process the CSV data files using `process_births.py` to generate JSON for all 58 counties
2. Install dependencies with pnpm
3. Build the React application with Vite
4. Deploy the `dist/` folder to GitHub Pages

## Running Locally

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Process the data (if needed):
   ```bash
   python3 scripts/process_births.py
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser to the URL shown (typically http://localhost:5173)

## Building for Production

To create a production build:

```bash
pnpm build
```

To preview the production build locally:

```bash
pnpm preview
```

## Updating Data

When new data becomes available:

1. Replace or update the CSV files in `births-data/`
2. Commit and push to the `main` branch
3. GitHub Actions will automatically:
   - Regenerate all county JSON files
   - Rebuild the React application
   - Redeploy the site

For local testing, run the processing script manually:
```bash
python3 scripts/process_births.py
```

## Data Source

California Department of Public Health, Center for Health Statistics and Informatics, Vital Statistics Branch.

- **Historical Data**: Final birth counts (1960-2023)
- **Provisional Data**: Preliminary counts based on California Comprehensive Birth File (Dynamic), 2024-2025

Data available at: https://data.chhs.ca.gov/dataset/live-birth-profiles-by-county

## Architecture

This project uses a modern React architecture to minimize code duplication:

- **Single CountyPage Component**: One reusable component handles all 58 counties dynamically
- **Dynamic Routing**: URL pattern `/county/:countySlug` loads the appropriate county data
- **Shared Chart Components**: MonthlyChart and AnnualChart are reused across all pages
- **Client-side Navigation**: React Router provides instant page transitions without full reloads

## Future Enhancements

- County comparison view (side-by-side charts)
- Add demographic breakdowns (race/ethnicity, age groups, birth place type)
- Year-over-year comparison statistics
- Export charts as images
- Search functionality for counties
- Mobile-optimized navigation drawer
