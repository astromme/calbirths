#!/usr/bin/env python3
"""
Process California birth data to extract San Francisco births by month.
Combines historical (1960-2023) and provisional (2024-2025) data.
Outputs JSON file suitable for web visualization.
"""

import csv
import json
from pathlib import Path
from collections import defaultdict

def process_sf_births_from_csv(input_csv):
    """
    Extract San Francisco births from a CSV file.

    Filters for:
    - County = 'San Francisco'
    - Geography_Type = 'Occurrence'
    - Strata = 'Total Population'
    - Strata_Name = 'Total Population'

    Returns list of birth records.
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

    return births_data

def process_all_sf_births(historical_csv, provisional_csv, output_json):
    """
    Combine historical and provisional birth data into a single JSON file.
    """
    # Process both data sources
    print("Processing historical data (1960-2023)...")
    historical_data = process_sf_births_from_csv(historical_csv)
    print(f"  Found {len(historical_data)} records")

    print("Processing provisional data (2024-2025)...")
    provisional_data = process_sf_births_from_csv(provisional_csv)
    print(f"  Found {len(provisional_data)} records")

    # Combine and sort
    all_births_data = historical_data + provisional_data
    all_births_data.sort(key=lambda x: (x['year'], x['month']))

    # Write to JSON
    output_path = Path(output_json)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(all_births_data, f, indent=2)

    print(f"\nTotal records: {len(all_births_data)}")
    print(f"Date range: {all_births_data[0]['year']}-{all_births_data[0]['month']:02d} to {all_births_data[-1]['year']}-{all_births_data[-1]['month']:02d}")
    print(f"Output written to: {output_json}")

    return all_births_data

if __name__ == '__main__':
    # Paths relative to project root
    project_root = Path(__file__).parent.parent
    historical_csv = project_root / 'births-data' / '1960-2023-final-births-by-month-by-county.csv'
    provisional_csv = project_root / 'births-data' / '2024-2025-provisional-births-by-month-by-county.csv'
    output_json = project_root / 'public' / 'data' / 'sf-births.json'

    process_all_sf_births(historical_csv, provisional_csv, output_json)
