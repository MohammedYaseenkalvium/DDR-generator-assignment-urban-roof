/**
 * Pre-extracted text from the sample documents provided with the assignment.
 * This allows testing the app without re-uploading the PDFs every time.
 */

export const SAMPLE_INSPECTION_TEXT = `
URBANROOF — INSPECTION FORM
Status: Complete
Score: 85.71% | Flagged items: 1 | Actions: 0

PROPERTY DETAILS
Property Type: Flat
Floors: 11
Previous Structural audit done: No
Previous Repair work done: No
Inspection Date and Time: 27.09.2022 14:28 IST
Inspected By: Krushna & Mahesh

FLAGGED CHECKLISTS
- WC
- External Wall

SITE DETAILS
Impacted Areas/Rooms: Hall, Bedroom, Kitchen, Master Bedroom

IMPACTED AREA 1
Negative side Description: Hall — Skirting level Dampness
Positive side Description: Common Bathroom tile hollowness

IMPACTED AREA 2
Negative side Description: Bedroom — Skirting level Dampness
Positive side Description: Common Bathroom tile hollowness

IMPACTED AREA 3
Negative side Description: Master Bedroom — Skirting level Dampness
Positive side Description: MB Bathroom tile hollowness

IMPACTED AREA 4
Negative side Description: Kitchen — Skirting level Dampness
Positive side Description: Master bedroom bathroom

IMPACTED AREA 5
Negative side Description: Master bedroom wall dampness
Positive side Description: External wall crack and Duct Issue

IMPACTED AREA 6
Negative side Description: Parking Area seepage
Positive side Description: Common Bathroom tile hollowness and plumbing issue

IMPACTED AREA 7
Negative side Description: Common Bathroom Ceiling Dampness
Positive side Description: Flat no 203 tile joint open and outlet Leakage

SUMMARY TABLE
Point 1: Observed dampness at the skirting level of Hall of Flat No. 103
Point 2: Observed dampness at the skirting level of the Common Bedroom of Flat No. 103
Point 3: Observed dampness at the skirting level of Master Bedroom of Flat No. 103
Point 4: Observed dampness at the skirting level of Kitchen of Flat No. 103
Point 5: Observed dampness & efflorescence on the wall surface of Master Bedroom of Flat No. 103
Point 6: Observed leakage at the Parking ceiling below Flat No. 103
Point 7: Observed mild dampness at the ceiling of Common Bathroom of Flat No. 103

CHECKLIST FINDINGS — WC
Leakage during: All time
Leakage due to concealed plumbing: Yes
Leakage due to damage in Nahani trap/Brickbat coba under tile flooring: Yes
Gaps/Blackish dirt Observed in tile joints: Yes
Gaps around Nahani Trap Joints: Yes
Tiles Broken/Loosed anywhere: No
Loose Plumbing joints/rust around joints and edges (Flush Tank/shower/angle cock/bibcock, washbasin, etc): Yes
Type of tile: Moderate

CHECKLIST FINDINGS — EXTERNAL WALL
Condition of leakage at interior side: Leakage during All time
Leakage due to concealed plumbing: Yes
Internal WC/Bath/Balcony leakage observed: Yes
Existing type of paint and manufacturer: Not sure
Structural Condition of RCC Members: 100%
Condition of cracks observed on RCC Column and Beam: Moderate
Condition of rust marks observed in RCC Beam and Column: N/A
Condition of corrosion/spalling of concrete/exposed reinforcement: N/A
Expansion joints condition: N/A
Are there any major or minor cracks observed over external surface: Moderate
Are the sealants applied on the window frame joints intact: N/A
Condition of wall mounted AC Frames, holes, drain pipes over the wall: Moderate
Are the external plumbing pipes cracked and leaked: N/A
Are the openings around the pipes in external wall properly grouted: N/A
Condition of any vegetation growth, dish antennas fixed on parapet wall: N/A
Chalking and flaking in paint film: N/A
Algae fungus and Moss observed on external wall: Moderate
Bird droppings on external wall and Chajja: N/A
Condition of corrosion on metal rods and MS window grills: N/A
Patchwork plaster required: N/A
Entire replaster required: N/A
Condition of separation cracks at beam-column junction: N/A
Condition of leakage from overhead water tank: N/A
Loose plaster/hollow sond on external surfaces: N/A
`;

export const SAMPLE_THERMAL_TEXT = `
THERMAL IMAGING REPORT
Device: GTC 400 C Professional
Serial Number: 02700034772
Date: 27/09/22
Emissivity: 0.94
Reflected Temperature: 23°C

THERMAL SCAN READINGS (30 images total)

Image 1  (RB02380X): Hotspot 28.8°C | Coldspot 23.4°C | Center ~25.1°C — Wall corner with visible blue cold zone indicating moisture infiltration at skirting
Image 2  (RB02386X): Hotspot 27.4°C | Coldspot 22.4°C | Center ~25.1°C — Wall surface moisture detected
Image 3  (RB02395X): Hotspot 27.0°C | Coldspot 22.0°C | Center ~24.2°C — Ceiling/wall junction with distinct horizontal thermal gradient (red top, blue bottom band)
Image 4  (RB02402X): Hotspot 25.7°C | Coldspot 20.7°C | Center ~23.4°C — General wall surface scan
Image 5  (RB02403X): Hotspot 25.5°C | Coldspot 20.5°C | Center ~23.3°C — Wall skirting level cold zone; visible moisture marks in photo
Image 6  (RB02404X): Hotspot 25.8°C | Coldspot 20.8°C | Center ~23.8°C — Wall near floor; blue cold anomaly at base
Image 7  (RB02405X): Hotspot 26.2°C | Coldspot 21.2°C | Center ~23.9°C — Internal wall surface
Image 8  (RB02406X): Hotspot 26.5°C | Coldspot 21.5°C | Center ~24.0°C  — Wall/floor corner junction
Image 9  (RB02392X): Hotspot 25.8°C | Coldspot 20.8°C | Center ~23.3°C — Concentrated cold patch (blue/cyan) indicating active water presence; visible paint peeling in photo
Image 10 (RB02393X): Hotspot 25.9°C | Coldspot 20.9°C | Center ~23.9°C — Wall near electrical sockets with cold zone at base
Image 11 (RB02394X): Hotspot 26.0°C | Coldspot 21.0°C | Center ~23.8°C — Wall/skirting junction
Image 12 (RB02396X): Hotspot 26.1°C | Coldspot 21.1°C | Center ~24.2°C — Distinct horizontal cold band at floor-wall meeting
Image 13 (RB02397X): Hotspot 26.3°C | Coldspot 21.3°C | Center ~24.4°C — Internal wall
Image 14 (RB02398X): Hotspot 25.6°C | Coldspot 20.6°C | Center ~24.0°C  — Ceiling moisture; visible stains in photo
Image 15 (RB02399X): Hotspot 26.5°C | Coldspot 21.5°C | Center ~24.9°C — Wall/floor angle, cold zone along skirting
Image 16 (RB02400X): Hotspot 25.2°C | Coldspot 20.2°C | Center ~23.2°C — Wall with electrical fittings
Image 17 (RB02401X): Hotspot 25.6°C | Coldspot 20.6°C | Center ~23.2°C — Wall surface with moisture patch
Image 18 (RB02381X): Hotspot 27.0°C | Coldspot 22.0°C | Center ~24.9°C — Wall/ceiling junction with horizontal cold band
Image 19 (RB02382X): Hotspot 26.7°C | Coldspot 21.7°C | Center ~24.5°C — Corner with large cold zone; ceiling damage in photo
Image 20 (RB02383X): Hotspot 26.5°C | Coldspot 21.5°C | Center ~24.6°C — Wall moisture patches; salt deposits in photo
Image 21 (RB02384X): Hotspot 27.3°C | Coldspot 22.3°C | Center ~25.0°C  — Wall surface
Image 22 (RB02385X): Hotspot 27.3°C | Coldspot 22.3°C | Center ~25.0°C  — Wall surface (continuation)
Image 23 (RB02387X): Hotspot 25.2°C | Coldspot 20.2°C | Center ~23.6°C — Horizontal cold band scan
Image 24 (RB02388X): Hotspot 25.1°C | Coldspot 20.1°C | Center ~23.0°C  — Lowest hotspot recorded; persistent moisture band; visible brown stains in photo
Image 25 (RB02389X): Hotspot 25.9°C | Coldspot 20.9°C | Center ~23.6°C — Wall skirting with cold zone; black marks in photo
Image 26 (RB02390X): Hotspot 26.9°C | Coldspot 21.9°C | Center ~24.4°C — Clean wall; minimal thermal anomaly
Image 27 (RB02391X): Hotspot 25.6°C | Coldspot 20.6°C | Center ~23.3°C — Large irregular cold patch at floor-wall junction
Image 28 (RB02377X): Hotspot 26.9°C | Coldspot 21.9°C | Center ~24.1°C — General wall scan
Image 29 (RB02378X): Hotspot 26.4°C | Coldspot 21.4°C | Center ~24.2°C — Wall with moisture patch
Image 30 (RB02379X): Hotspot 27.8°C | Coldspot 22.8°C | Center ~24.4°C — Highest thermal differential; most active moisture zone near floor/wall junction; significant cold patch visible

STATISTICAL SUMMARY
Maximum Hotspot: 28.8°C (Image 1 — RB02380X)
Minimum Coldspot: 20.1°C (Image 24 — RB02388X)
Highest Temperature Differential: 5.4°C (Image 1)
Average Hotspot across all 30 images: ~26.2°C
Average Coldspot across all 30 images: ~21.2°C
Average ΔT (differential): ~5.0°C

THERMAL INTERPRETATION NOTES
- Consistent cold anomalies (blue/cyan zones) appear at skirting level across majority of scans — strong indicator of ground/slab moisture ingress
- Images 1, 30, 3 show the most pronounced thermal anomalies (>5°C differential)
- Horizontal cold bands at floor-wall junctions visible in Images 3, 12, 18, 23 — consistent with water travelling laterally through the slab
- Large irregular cold patches (Images 9, 27) suggest pooling or concentrated moisture behind wall plaster
- Images near electrical fittings (10, 16) show cold anomalies close to live wiring — potential safety concern
- No thermal data associated with external wall scans (external façade not captured)
`;
