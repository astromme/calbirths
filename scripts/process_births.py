#!/usr/bin/env python3
"""
Process California birth data to extract births by month for each county.
Combines historical (1960-2023) and provisional (2024-2025) data.
Outputs JSON files suitable for web visualization.
"""

import csv
import json
from pathlib import Path
from collections import defaultdict

def process_county_births_from_csv(input_csv, county_name):
    """
    Extract births for a specific county from a CSV file.

    Filters for:
    - County = county_name
    - Geography_Type = 'Occurrence'
    - Strata = 'Total Population'
    - Strata_Name = 'Total Population'

    Returns list of birth records.
    """
    births_data = []

    with open(input_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            # Filter for specified county total population births
            if (row['County'] == county_name and
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

def process_all_counties(historical_csv, provisional_csv, output_dir):
    """
    Process birth data for all California counties.

    Creates individual JSON files for each county and an aggregate file.
    """
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Get list of all counties from the provisional CSV
    counties = set()
    with open(provisional_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['Geography_Type'] == 'Occurrence':
                counties.add(row['County'])

    counties = sorted(list(counties))
    print(f"Found {len(counties)} counties")

    # Process each county
    all_data = {}
    for county in counties:
        print(f"\nProcessing {county}...")

        # Process historical data
        print("  Processing historical data (1960-2023)...")
        historical_data = process_county_births_from_csv(historical_csv, county)
        print(f"    Found {len(historical_data)} records")

        # Process provisional data
        print("  Processing provisional data (2024-2025)...")
        provisional_data = process_county_births_from_csv(provisional_csv, county)
        print(f"    Found {len(provisional_data)} records")

        # Combine and sort
        county_data = historical_data + provisional_data
        county_data.sort(key=lambda x: (x['year'], x['month']))

        # Store for aggregate
        all_data[county] = county_data

        # Write individual county file
        county_filename = county.lower().replace(' ', '-') + '-births.json'
        county_path = output_path / county_filename
        with open(county_path, 'w', encoding='utf-8') as f:
            json.dump(county_data, f, indent=2)

        if county_data:
            print(f"  Date range: {county_data[0]['year']}-{county_data[0]['month']:02d} to {county_data[-1]['year']}-{county_data[-1]['month']:02d}")
        print(f"  Output written to: {county_path}")

    # Create aggregate data (sum of all counties by year/month)
    print("\n\nCreating aggregate data...")
    aggregate_data = defaultdict(lambda: defaultdict(int))

    for county, data in all_data.items():
        for record in data:
            key = (record['year'], record['month'])
            aggregate_data[key]['count'] += record['count']
            aggregate_data[key]['year'] = record['year']
            aggregate_data[key]['month'] = record['month']

    # Convert to list and sort
    aggregate_list = [
        {'year': data['year'], 'month': data['month'], 'count': data['count']}
        for key, data in aggregate_data.items()
    ]
    aggregate_list.sort(key=lambda x: (x['year'], x['month']))

    # Write aggregate file
    aggregate_path = output_path / 'california-total-births.json'
    with open(aggregate_path, 'w', encoding='utf-8') as f:
        json.dump(aggregate_list, f, indent=2)

    print(f"Aggregate data written to: {aggregate_path}")
    print(f"Total records: {len(aggregate_list)}")

    # Create county list file for the frontend
    county_list_path = output_path / 'counties.json'
    with open(county_list_path, 'w', encoding='utf-8') as f:
        json.dump(counties, f, indent=2)
    print(f"County list written to: {county_list_path}")

    return all_data

if __name__ == '__main__':
    # Paths relative to project root
    project_root = Path(__file__).parent.parent
    historical_csv = project_root / 'births-data' / '1960-2023-final-births-by-month-by-county.csv'
    provisional_csv = project_root / 'births-data' / '2024-2025-provisional-births-by-month-by-county.csv'
    output_dir = project_root / 'public' / 'data'

    process_all_counties(historical_csv, provisional_csv, output_dir)
