/**
 * BABY PASS enrollment counter
 *
 * Reads a published Feed tab and returns nothing but aggregates. Same model as
 * the Diaper Dollars counter: the counting happens inside the workbook, only a
 * few integers are published, and no credential exists anywhere in this path.
 *
 * The Feed tab is one header row and one row per benefit:
 *   benefit,enrolled,cap,label,updated
 *   diapers,212,500,children enrolled,2026-11-02T10:20:28-05:00
 *   car_seats,431,1200,families enrolled,2026-11-02T10:20:28-05:00
 *
 * Diapers are counted in children, car seats in families. The two limits are
 * different units on purpose; the label column says which is which.
 *
 * The feed is the Feed tab of "IN FY27 BABY PASS - Enrollment", published on its
 * own as CSV (connected Nov 6, 2026). Formulas in that tab sum children for
 * diapers and count families for car seats, skipping rows whose staff email
 * starts with test@. Optional override, if the sheet is ever republished at a
 * new URL: BP_FEED_URL in Netlify's environment variables.
 *
 * Returns: {"benefits":{"diapers":{"enrolled":212,"cap":500,"label":"..."},
 *           "car_seats":{...}},"asOf":"..."}
 */

const FEED_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vROAgl68D93dNkPrZbkR9nmb3g-WtalYIW6kQXb_SaZ3r-O1Go9AHHTbW0OuP5_8WtSB3K7ZAKvwiOd/pub?gid=834250283&single=true&output=csv';

let cache = { value: null, at: 0 };
const CACHE_MS = 5 * 60 * 1000; // matches Google's own cache on a published CSV

const CAPS = { diapers: 500, car_seats: 1200 };
const LABELS = { diapers: 'children enrolled', car_seats: 'families enrolled' };

/** Minimal CSV row splitter — handles quoted fields containing commas. */
function splitRow(line) {
  const out = [];
  let cur = '', inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cur += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

export default async () => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=300'
  };

  const url = process.env.BP_FEED_URL || FEED_URL;
  if (!url) {
    return new Response(JSON.stringify({ error: 'Feed not configured' }), { status: 503, headers });
  }

  if (cache.value && Date.now() - cache.at < CACHE_MS) {
    return new Response(JSON.stringify({ ...cache.value, cached: true }), { status: 200, headers });
  }

  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`Feed returned ${res.status}`);

    // An unpublished or moved sheet still answers 200, with an HTML page.
    const ctype = res.headers.get('content-type') || '';
    if (!ctype.includes('csv')) {
      throw new Error('Feed is not CSV — the sheet is unpublished or the gid changed');
    }

    const lines = (await res.text()).split(/\r?\n/).filter((l) => l.trim() !== '');
    if (lines.length < 2) throw new Error('Feed has no data rows');

    const head = splitRow(lines[0]).map((h) => h.toLowerCase());
    const col = (row, name) => {
      const i = head.indexOf(name);
      return i === -1 ? '' : (row[i] || '');
    };
    const num = (v) => {
      const n = parseInt(v, 10);
      return isNaN(n) ? null : n;
    };

    const benefits = {};
    let asOf = '';
    for (const row of lines.slice(1).map(splitRow)) {
      const key = col(row, 'benefit').toLowerCase();
      if (!(key in CAPS)) continue;
      const enrolled = num(col(row, 'enrolled'));
      if (enrolled === null) continue;
      benefits[key] = {
        enrolled,
        cap: num(col(row, 'cap')) ?? CAPS[key],
        // The sheet owns the wording, so it can change without a deploy.
        label: col(row, 'label') || LABELS[key]
      };
      asOf = asOf || col(row, 'updated');
    }
    if (!benefits.diapers && !benefits.car_seats) throw new Error('Feed has no benefit rows');

    const payload = { benefits, asOf: asOf || new Date().toISOString() };
    cache = { value: payload, at: Date.now() };
    return new Response(JSON.stringify({ ...payload, cached: false }), { status: 200, headers });
  } catch (err) {
    // Serve the last good numbers rather than a broken page.
    if (cache.value) {
      return new Response(JSON.stringify({ ...cache.value, stale: true }), { status: 200, headers });
    }
    return new Response(JSON.stringify({ error: String(err.message || err) }), { status: 502, headers });
  }
};

export const config = { path: '/api/count' };
