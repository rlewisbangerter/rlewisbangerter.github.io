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

## Sources

Each sourced input is also labeled next to its cell on the workbook's Inputs sheet. Industry and vendor figures are directional benchmarks, not audited numbers.

**Phase 1 research & V1 model**
- [Last-Mile Delivery Statistics 2026](https://smartroutes.io/blogs/last-mile-delivery-statistics-the-complete-data-resource/), SmartRoutes: last mile ≈ 53% of total shipping cost; urban vs. rural cost per package
- [Breakdown of Last-Mile Delivery Costs](https://www.dropoff.com/blog/last-mile-delivery-costs-breakdown-and-how-to-reduce-them/), Dropoff: labor, fuel and equipment shares
- [Why Your Final Mile Is Bleeding Money](https://fleetenable.com/?p=14093), FleetEnable: $17.78 per failed delivery
- [Last-mile is the expensive mile](https://atlasagility.duckdns.org/insights/ind-courier-3pl), ATLAS: 5–10% first-attempt failure rate (model uses 8%)
- [Making sense of the ever so expensive last mile](https://www.logisticsinsider.in/making-sense-of-the-ever-so-expensive-last-mile/), Logistics Insider: manual routes ~20–25% more miles (V1's 20% assumption)
- [How Much to Charge for Delivery Per Mile](https://www.upperinc.com/blog/delivery/how-much-to-charge-per-mile-for-delivery-business/), Upper: $0.56/mile vehicle cost, $30/hour loaded driver cost
- [UPS Accelerates Use of Routing Optimization Software](https://app.3blmedia.com/news/ups-accelerates-use-routing-optimization-software-reduce-100-million-miles-driven), UPS via 3BL: ~120-stop route; ORION saves ~100M miles/year
- [UPS ORION: Optimizing Delivery Routes](https://www.informs.org/Impact/O.R.-Analytics-Success-Stories/Optimizing-Delivery-Routes), INFORMS
- [Regionalize and Scale: Amazon's Fulfillment Network Design](https://pubsonline.informs.org/doi/abs/10.1287/inte.2025.0295), INFORMS Journal on Applied Analytics
- [Evaluating the Locker Alliance pilot](https://iora.nus.edu.sg/?p=2357), NUS IORA: 11 parcels/hour to lockers vs. 5/hour to homes
- [Influence of self-pickup incentives on last-mile deliveries](https://trid.trb.org/View/2681454), Research in Transportation Economics (TRID)
- [Do it right the first time: Vehicle routing with home delivery attempt predictors](https://academicnewsletter.sufe.edu.cn/info/404098), Lim et al. (SUFE summary): failure-aware sequencing cuts failed attempts ~10%

**V2–V3 model inputs & method**
- Seghezzi, A., Siragusa, C. & Mangiaracina, R. (2022). [Parcel lockers vs. home delivery: a model to compare last-mile delivery cost in urban and rural areas](https://doi.org/10.1108/IJPDLM-03-2020-0072). *International Journal of Physical Distribution & Logistics Management*, 52(3), 213–237. Locker cost, compartments, site cost, fill rates.
- Hovi, I. B. et al. (2023). [Parcel lockers as delivery solution: Usage patterns, experiences and effects of network expansions](https://toi.no/publications/parcel-lockers-as-delivery-solution-usage-patterns-experiences-and-effects-of-network-expansions-article38266-29.html). TØI Report 1959/2023. Travel to lockers; combined errands.
- Internal Revenue Service (2026). [Announcement 2026-11, Optional Standard Mileage Rates](https://www.irs.gov/irb/2026-29_irb), IRB 2026-29: 76¢/mile from July 1, 2026.
- ParcelHive (2025), vendor product information: lockers claimed to last 10+ years.
- Beardwood, J., Halton, J. H. & Hammersley, J. M. (1959). [The shortest path through many points](https://doi.org/10.1017/S0305004100034095). *Proceedings of the Cambridge Philosophical Society*, 55(4), 299–327. Route-length formula (k = 0.7124).
