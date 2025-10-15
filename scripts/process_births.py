#!/usr/bin/env python3
"""
Process California birth data to extract San Francisco births by month.
Outputs JSON file suitable for web visualization.
"""

import csv
import json
from pathlib import Path
from collections import defaultdict

def process_sf_births(input_csv, output_json):
    """
    Extract San Francisco births from provisional data.

    Filters for:
    - County = 'San Francisco'
    - Geography_Type = 'Occurrence'
    - Strata = 'Total Population'
    - Strata_Name = 'Total Population'
    """
    births_data = []

    with open(input_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            # Filter for San Francisco total population births
            if (row['County'] == 'San Francisco' and
                row['Geography_Type'] == 'Occurrence' and
                row['Strata'] == 'Total Population' and
                row['Strata_Name'] == 'Total Population'):

                # Extract the count (may be empty for suppressed data)
                count_str = row['Count'].strip()
                if count_str:
                    births_data.append({
                        'year': int(row['Year']),
                        'month': int(row['Month']),
                        'count': int(count_str)
                    })

    # Sort by year and month
    births_data.sort(key=lambda x: (x['year'], x['month']))

    # Write to JSON
    output_path = Path(output_json)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(births_data, f, indent=2)

    print(f"Processed {len(births_data)} records")
    print(f"Date range: {births_data[0]['year']}-{births_data[0]['month']:02d} to {births_data[-1]['year']}-{births_data[-1]['month']:02d}")
    print(f"Output written to: {output_json}")

    return births_data

if __name__ == '__main__':
    # Paths relative to project root
    project_root = Path(__file__).parent.parent
    input_csv = project_root / 'births-data' / '2024-2025-provisional-births-by-month-by-county.csv'
    output_json = project_root / 'public' / 'data' / 'sf-births.json'

    process_sf_births(input_csv, output_json)
