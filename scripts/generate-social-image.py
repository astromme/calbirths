#!/usr/bin/env python3
"""
Generate a social sharing image (Open Graph / Twitter Card) for the California Births site.
Creates a 1200x630px image with a data visualization.

Requires: matplotlib, numpy
Install with: pip install matplotlib numpy
"""

import json
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path
from collections import defaultdict

# Configuration
OUTPUT_WIDTH = 1200  # px
OUTPUT_HEIGHT = 630  # px
DPI = 100

def load_aggregate_data(json_path):
    """Load and process aggregate birth data."""
    with open(json_path, 'r') as f:
        data = json.load(f)

    # Group by year and track months per year
    yearly_data = defaultdict(int)
    months_per_year = defaultdict(int)

    for record in data:
        yearly_data[record['year']] += record['count']
        months_per_year[record['year']] += 1

    # Filter out partial years (years with fewer than 12 months of data)
    complete_years = {year for year, months in months_per_year.items() if months == 12}

    years = sorted([year for year in yearly_data.keys() if year in complete_years])
    counts = [yearly_data[year] for year in years]

    return years, counts

def create_social_image(data_json_path, output_path):
    """Create a social sharing image with birth data visualization."""

    # Load data
    years, counts = load_aggregate_data(data_json_path)

    # Create figure with specific size for social media
    fig = plt.figure(figsize=(OUTPUT_WIDTH/DPI, OUTPUT_HEIGHT/DPI), dpi=DPI)

    # Set background color
    fig.patch.set_facecolor('#0f172a')  # Dark blue background

    # Create main axes - give more vertical space to the chart
    ax = fig.add_axes([0.08, 0.15, 0.84, 0.70])  # [left, bottom, width, height]

    # Plot the data
    ax.plot(years, counts, linewidth=3, color='#60a5fa', alpha=0.9)
    ax.fill_between(years, counts, alpha=0.3, color='#60a5fa')

    # Style the plot
    ax.set_facecolor('#1e293b')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)  # Hide left spine (no Y-axis)
    ax.spines['bottom'].set_color('#475569')

    # Grid
    ax.grid(True, alpha=0.2, color='#475569', linestyle='-', linewidth=0.5)
    ax.set_axisbelow(True)

    # Labels - only X-axis
    ax.tick_params(colors='#cbd5e1', labelsize=10)
    ax.set_xlabel('Year', fontsize=12, color='#cbd5e1', fontweight='bold')

    # Hide Y-axis labels and ticks
    ax.yaxis.set_visible(False)

    # Add title at the top with safe margin from edge
    title_y = 0.88

    fig.text(0.5, title_y, 'California Births Data',
             ha='center', fontsize=32, color='#f1f5f9', fontweight='bold')

    # Add URL in the middle of the chart with much larger font
    fig.text(0.5, 0.5, 'astromme.github.io/calbirths',
             ha='center', va='center', fontsize=36, color='#f1f5f9',
             fontweight='bold', alpha=0.85)

    # Save the image
    plt.savefig(output_path, facecolor='#0f172a', dpi=DPI, bbox_inches=None, pad_inches=0.3)
    plt.close()

    print(f"✓ Social sharing image created: {output_path}")
    print(f"  Dimensions: {OUTPUT_WIDTH}x{OUTPUT_HEIGHT}px")
    print(f"  File size: {output_path.stat().st_size / 1024:.1f} KB")

def main():
    """Main function."""
    project_root = Path(__file__).parent.parent
    data_json = project_root / 'public' / 'data' / 'california-total-births.json'
    output_image = project_root / 'public' / 'og-image.png'

    if not data_json.exists():
        print(f"Error: Data file not found: {data_json}")
        print("Run 'python3 scripts/process_births.py' first to generate the data.")
        return 1

    print("Generating social sharing image...")
    create_social_image(data_json, output_image)

    return 0

if __name__ == '__main__':
    exit(main())
