#!/usr/bin/env node

/**
 * Generate sitemap.xml from counties data
 *
 * This script reads the counties.json file and generates a sitemap.xml
 * with entries for the homepage and all county pages.
 *
 * Usage: node scripts/generate-sitemap.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SITE_URL = 'https://astromme.github.io/calbirths';
const COUNTIES_FILE = join(__dirname, '../public/data/counties.json');
const OUTPUT_FILE = join(__dirname, '../public/sitemap.xml');

/**
 * Convert county name to URL slug
 * Example: "San Francisco" -> "san-francisco"
 */
function countyNameToSlug(countyName) {
  return countyName.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate sitemap XML content
 */
function generateSitemap(counties) {
  const lastmod = getCurrentDate();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Homepage
  xml += '  <!-- Homepage -->\n';
  xml += '  <url>\n';
  xml += `    <loc>${SITE_URL}/</loc>\n`;
  xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += '    <changefreq>monthly</changefreq>\n';
  xml += '    <priority>1.0</priority>\n';
  xml += '  </url>\n\n';

  // County pages
  xml += '  <!-- County Pages -->\n';
  counties.forEach(countyName => {
    const slug = countyNameToSlug(countyName);
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}/county/${slug}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  return xml;
}

/**
 * Main function
 */
function main() {
  try {
    console.log('Generating sitemap...');

    // Read counties data
    console.log(`Reading counties from: ${COUNTIES_FILE}`);
    const countiesData = JSON.parse(readFileSync(COUNTIES_FILE, 'utf-8'));

    if (!Array.isArray(countiesData) || countiesData.length === 0) {
      throw new Error('Counties data is empty or invalid');
    }

    console.log(`Found ${countiesData.length} counties`);

    // Generate sitemap XML
    const sitemapXml = generateSitemap(countiesData);

    // Write to file
    writeFileSync(OUTPUT_FILE, sitemapXml, 'utf-8');
    console.log(`✓ Sitemap generated successfully: ${OUTPUT_FILE}`);
    console.log(`  Total URLs: ${countiesData.length + 1} (1 homepage + ${countiesData.length} counties)`);

  } catch (error) {
    console.error('Error generating sitemap:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateSitemap, countyNameToSlug };
