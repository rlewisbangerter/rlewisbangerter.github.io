# Last-Mile Route Optimization

**Live page:** https://reubenbangerter.org/last-mile/

An Excel route-cost model and Power BI dashboard measuring how much route optimization, stop density and parcel lockers cut last-mile delivery cost. Passion project by Reuben Bangerter (Rutgers, Business Analytics & IT / Supply Chain Management), Oct 2026 – present.

## Key findings
- Manual routes drive **17% / 26% / 28%** extra miles (urban / suburban / rural), measured across 15 simulated delivery areas. V1 had assumed 20%.
- Optimized 120-stop routes cut cost per package **3.6% / 9.4% / 11.6%**.
- 50% parcel-locker adoption cuts carrier cost per package **22–24%**; counting the customer's drive, the saving is 22% urban, 14% suburban and ~0 rural.
- Stop density matters most: 20 → 120 stops cuts cost per package 38–48%.

## Files
| File | What it is |
|---|---|
| `files/LastMile_Dashboard.pbix` | Power BI dashboard: 3 pages (Route Optimizer, Lockers, Evidence), 29 DAX measures, 4 what-if sliders |
| `files/LastMile_Model_V3_Excel.xlsx` | Excel model V3: Inputs, 15 Route Labs, Lab Summary, Scale-Up, Density, Lockers, V1 Check |
| `files/LastMile_Model_V2_Excel.xlsx` | Earlier version with one lab per area type |

## Folder layout
```
last-mile/
├── index.html        the project page
├── files/            .pbix and .xlsx downloads
└── screenshots/      images shown on the page
```
