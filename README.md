# California Births Visualization

A simple website visualizing San Francisco birth data by month from California's vital statistics.

## Features

- Interactive line chart showing monthly births in San Francisco
- Separate lines for each year (2024, 2025)
- Responsive design that works on mobile and desktop
- Data from California Department of Public Health provisional birth records

## Project Structure

```
/
├── index.html                   # Main visualization page
├── public/
│   └── data/
│       └── sf-births.json      # Processed birth data
├── scripts/
│   └── process_births.py       # Data processing script
└── births-data/                 # Raw CSV data from CA Dept of Public Health
```

## Running Locally

1. Start a local web server:
   ```bash
   python3 -m http.server 8000
   ```

2. Open your browser to: http://localhost:8000

## Updating Data

When new data becomes available:

1. Replace or update the CSV file in `births-data/`
2. Run the processing script:
   ```bash
   python3 scripts/process_births.py
   ```
3. The JSON data will be regenerated automatically

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Charting**: Chart.js 4.4.0 (via CDN)
- **Data Processing**: Python 3
- **No build step required** - just open index.html in a browser!

## Data Source

California Department of Public Health, Center for Health Statistics and Informatics, Vital Statistics Branch.

Provisional counts based on California Comprehensive Birth File (Dynamic), 2024-2025.

## Future Enhancements

- Add more counties for comparison
- Include historical data (1960-2023)
- Add demographic breakdowns (race/ethnicity, age groups, birth place type)
- Year-over-year comparison statistics
- Export chart as image
