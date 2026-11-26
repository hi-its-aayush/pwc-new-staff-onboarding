/**
 * Dedicated Training & Upskilling modules (T)
 * -------------------------------------------
 * Used by the separate Training section (#training, #w1, ..., #training-certificate).
 * Each module object supports:
 *   - id:     Unique hash route (e.g. "w1")
 *   - track:  Track name (e.g. "Wine Training")
 *   - g:      Sidebar/eyebrow group label
 *   - t:      Module title
 *   - intro:  Short lead summary shown under the title
 *   - slides: Optional array of { title, img?, body?, note? } for the interactive slide deck
 *   - quiz:   Optional array of { q, o: [options], a: correctIndex } gating completion
 */
const T=[
{"id": "w1", "track": "Wine Training", "g": "Wine Training", "t": "1 · Wine fundamentals & varietals", "intro": "Core grape varietals, flavour profiles, and how to describe wines confidently to PwC guests.", "slides": [
  {"title": "Welcome to Wine Training", "body": "<p>Slide deck will be uploaded shortly. Use the arrows below (or your keyboard ← / → keys) to step through the starter slides.</p><ul><li>Covers core red, white, and sparkling varietals</li><li>Builds confidence when recommending or pouring for clients</li><li>Includes a quick knowledge check at the end</li></ul>", "note": "Slide deck will be uploaded shortly."},
  {"title": "White Wine Varietals", "body": "<table><tr><th>Varietal</th><th>Profile</th><th>Typical Notes</th></tr><tr><td><b>Sauvignon Blanc</b></td><td>Crisp, high acidity</td><td>Passionfruit, citrus, cut grass</td></tr><tr><td><b>Chardonnay</b></td><td>Light to full-bodied</td><td>Stone fruit, citrus, oak/butter (if oaked)</td></tr><tr><td><b>Pinot Grigio / Gris</b></td><td>Light, refreshing</td><td>Pear, green apple, floral</td></tr></table>", "note": "Serve whites chilled (approx. 7–10°C)."},
  {"title": "Red Wine Varietals", "body": "<table><tr><th>Varietal</th><th>Profile</th><th>Typical Notes</th></tr><tr><td><b>Pinot Noir</b></td><td>Light-bodied, silky</td><td>Cherry, strawberry, earthy</td></tr><tr><td><b>Shiraz / Syrah</b></td><td>Full-bodied, bold</td><td>Blackberry, pepper, spice</td></tr><tr><td><b>Cabernet Sauvignon</b></td><td>Full-bodied, structured</td><td>Blackcurrant, cedar, firm tannins</td></tr></table>", "note": "Serve reds slightly below room temperature (approx. 15–18°C)."},
  {"title": "Sparkling & Rosé", "body": "<ul><li><b>Sparkling / Champagne:</b> Crisp, celebratory — hold the bottle by the base, never point the cork toward guests, and twist the bottle (not the cork) to open quietly.</li><li><b>Rosé:</b> Dry, fresh red-berry notes — versatile for both warm-weather functions and light lunches.</li></ul>", "note": "Always chill sparkling wine thoroughly before opening to prevent gushing."}
], "quiz": [
  {"q": "Which white varietal is typically crisp with passionfruit and citrus notes?", "o": ["Chardonnay", "Sauvignon Blanc", "Shiraz"], "a": 1},
  {"q": "Which red varietal is known for being light-bodied with cherry and strawberry notes?", "o": ["Cabernet Sauvignon", "Shiraz", "Pinot Noir"], "a": 2},
  {"q": "When opening sparkling wine, what should you twist?", "o": ["The cork only", "The bottle while holding the cork firmly", "The wire cage while shaking"], "a": 1}
]},
{"id": "w2", "track": "Wine Training", "g": "Wine Training", "t": "2 · Wine service, glassware & pouring", "intro": "Presenting, opening, pouring, and topping up wine for boardrooms and formal events.", "slides": [
  {"title": "Glassware & Preparation", "body": "<ul><li><b>Inspect every glass</b> against the light for water spots, lipstick, or chips before setting.</li><li><b>Carry by the stem or base</b> — never put fingers inside the rim or on the bowl.</li><li><b>Polish with lint-free cloth</b> using steam if needed.</li></ul>", "note": "Clean glassware is the first impression guests notice."},
  {"title": "Pouring Sequence & Measures", "body": "<ul><li><b>Standard pour:</b> ~150 ml (roughly one-third of a standard wine glass) so the wine has room to breathe.</li><li><b>Sparkling pour:</b> Pour in two stages if needed to let the mousse settle.</li><li><b>Order of service:</b> Serve guests clockwise, ladies/VIPs first as directed, and the host last.</li><li><b>Finish cleanly:</b> Give the bottle a slight twist as you lift to avoid drips, and wipe the lip with a clean serviette.</li></ul>", "note": "Always pour from the guest’s right-hand side where space permits."},
  {"title": "Top-Ups & Clearing", "body": "<ul><li>Keep an eye on glasses throughout the function — offer a top-up when a glass reaches around one-third full.</li><li><b>Always ask</b> before topping up (or switching from white to red).</li><li>Never top up a glass that still has a different wine in it — offer a fresh glass instead.</li></ul>", "note": "See also Module 8.3 (Tray Service and Wine Pouring) in the Reference Library."}
], "quiz": [
  {"q": "How full should a standard wine pour be?", "o": ["Filled to the rim", "Roughly one-third of the glass (~150 ml)", "Just a splash at the bottom"], "a": 1},
  {"q": "How should you carry clean wine glasses?", "o": ["By the rim", "By the stem or base", "Tucked under your arm"], "a": 1}
]},
{"id": "w3", "track": "Wine Training", "g": "Wine Training", "t": "3 · Food & wine pairing at PwC events", "intro": "Simple pairing principles for formal lunches, dinners, and cocktail functions.", "slides": [
  {"title": "Core Pairing Principles", "body": "<ul><li><b>Match weight with weight:</b> Light dishes (salads, white fish) pair with light wines (Pinot Grigio, Sauvignon Blanc, Pinot Noir). Rich dishes (red meat, creamy sauces) pair with fuller wines (Shiraz, Cabernet, oaked Chardonnay).</li><li><b>Acidity cuts richness:</b> Crisp whites and sparkling wines refresh the palate after fried or creamy canapés.</li><li><b>When in doubt:</b> Sparkling wine and dry Rosé are the most versatile event pairings.</li></ul>", "note": "Slide deck will be uploaded shortly."}
], "quiz": [
  {"q": "Which style of wine is best for cutting through rich or fried canapés?", "o": ["Heavy Cabernet Sauvignon", "Crisp sparkling or high-acid white", "Sweet dessert wine"], "a": 1}
]}
];
