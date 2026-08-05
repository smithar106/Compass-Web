# Toast Careers — Job Shortlisting Tool

Collects all active Toast roles from `https://careers.toasttab.com/jobs/search?query=`, scores them against a target profile, and produces a ranked shortlist.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt
playwright install chromium

# Run full pipeline (scrape + score)
python3 toast_jobs.py

# Re-score from cached listings (skip re-scraping)
python3 toast_jobs.py --score
```

## Outputs

All outputs land in `output/`:

| File | Description |
|---|---|
| `toast_jobs_all.csv` | Every scored role with full breakdown |
| `toast_top_15.csv` | Top 15 ranked roles |
| `toast_shortlist.md` | Markdown report with recommendations |

Cache files are reused across runs:
- `toast_raw_listings.json` — raw search page listings
- `toast_job_details.json` — fetched job descriptions

## How It Works

1. **Scrape** — Uses Playwright (real browser) to access the Toast careers site, paginates through all search results, and collects title, department, location, and remote status for every role.

2. **Filter** — Applies hard filters to exclude: non-US locations, internships, executive roles, pure software engineering, hunter sales, restaurant operations, legal/tax/accounting, and titles outside the target role families.

3. **Fetch details** — Visits each job detail page for the top ~80 filtered roles to extract full job descriptions.

4. **Score** — Each role is scored 0-100 across seven weighted dimensions:
   - Strategy & Operations fit (20 pts)
   - AI / Technical relevance (20 pts)
   - Customer-facing / Implementation ownership (20 pts)
   - Systems-building responsibility (15 pts)
   - Experience-level fit (10 pts)
   - Cross-functional / Executive exposure (10 pts)
   - Location / Work arrangement (5 pts)

   Penalties are subtracted for SWE-heavy roles, quota ownership, and domain experience requirements.

5. **Classify** — Roles are grouped into Strong Fit (80-100), Worth Applying (68-79), Stretch (55-67), or Skip (<55).

## Configuration

Edit the constants at the top of `toast_jobs.py`:
- `CRAWL_DELAY` — seconds between requests (default 6, per robots.txt)
- `DETAIL_FETCH_LIMIT` — max detail pages to fetch per run
- `EXCLUDE_TITLE_RE` / `EXCLUDE_LOCATION_RE` — exclusion regex patterns
- `SCORING_MAX` — max points per category

## Notes

- Respects `robots.txt` (5-second crawl delay, increased to 6s)
- Uses a real Chromium browser via Playwright to handle AWS WAF
- Caches all data — re-runs with `--score` skip re-scraping
- Timestamp included in markdown report
- One role per unique URL (deduplication)
