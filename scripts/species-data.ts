/**
 * Species catalog — the source of truth for the ~85 edibles the app ships with.
 *
 * Imported by:
 *   - scripts/seed-species.ts    — pushes entities to InstantDB
 *   - scripts/seed-listings.ts   — looks up seasonMonths by latinName to
 *                                  compute ripeness for imported listings
 *
 * Extend this list (never edit outside this file) so both scripts stay
 * aligned. Always cite a source in the commit message and include
 * toxicity / look-alike warnings for anything non-obvious.
 */

export type Seed = {
  commonName: string;
  latinName: string;
  kind: string;
  seasonMonths: number[];
  description?: string;
  isToxic?: boolean;
  lookAlikes?: string[];
};

export const SPECIES: Seed[] = [
  { commonName: "Apple", latinName: "Malus domestica", kind: "apple", seasonMonths: [8, 9, 10, 11], description: "Common fruit tree; countless cultivars. Look for naturalized trees near old homesteads and roadsides." },
  { commonName: "Crabapple", latinName: "Malus sylvestris", kind: "apple", seasonMonths: [9, 10, 11], description: "Small, tart. Great for jelly." },
  { commonName: "Pear", latinName: "Pyrus communis", kind: "pear", seasonMonths: [8, 9, 10] },
  { commonName: "Asian Pear", latinName: "Pyrus pyrifolia", kind: "pear", seasonMonths: [8, 9, 10] },
  { commonName: "Peach", latinName: "Prunus persica", kind: "stone", seasonMonths: [6, 7, 8] },
  { commonName: "Plum", latinName: "Prunus domestica", kind: "stone", seasonMonths: [7, 8, 9] },
  { commonName: "Wild Plum", latinName: "Prunus americana", kind: "stone", seasonMonths: [7, 8] },
  { commonName: "Cherry", latinName: "Prunus avium", kind: "stone", seasonMonths: [5, 6, 7] },
  { commonName: "Apricot", latinName: "Prunus armeniaca", kind: "stone", seasonMonths: [6, 7] },
  { commonName: "Mulberry", latinName: "Morus alba", kind: "berry", seasonMonths: [5, 6, 7] },
  { commonName: "Blackberry", latinName: "Rubus fruticosus", kind: "berry", seasonMonths: [7, 8, 9], description: "Thorny canes along roadsides and field edges." },
  { commonName: "Raspberry", latinName: "Rubus idaeus", kind: "berry", seasonMonths: [6, 7, 8] },
  { commonName: "Black Raspberry", latinName: "Rubus occidentalis", kind: "berry", seasonMonths: [6, 7] },
  { commonName: "Wild Strawberry", latinName: "Fragaria vesca", kind: "berry", seasonMonths: [5, 6] },
  { commonName: "Blueberry", latinName: "Vaccinium corymbosum", kind: "berry", seasonMonths: [7, 8] },
  { commonName: "Huckleberry", latinName: "Vaccinium ovatum", kind: "berry", seasonMonths: [7, 8, 9] },
  { commonName: "Elderberry", latinName: "Sambucus canadensis", kind: "berry", seasonMonths: [8, 9], lookAlikes: ["Must cook — raw berries cause stomach upset."] },
  { commonName: "Serviceberry", latinName: "Amelanchier arborea", kind: "berry", seasonMonths: [6, 7] },
  { commonName: "Salmonberry", latinName: "Rubus spectabilis", kind: "berry", seasonMonths: [5, 6, 7] },
  { commonName: "Thimbleberry", latinName: "Rubus parviflorus", kind: "berry", seasonMonths: [7, 8] },
  { commonName: "Orange", latinName: "Citrus × sinensis", kind: "citrus", seasonMonths: [12, 1, 2, 3] },
  { commonName: "Lemon", latinName: "Citrus × limon", kind: "citrus", seasonMonths: [1, 2, 3, 4, 10, 11, 12] },
  { commonName: "Grapefruit", latinName: "Citrus × paradisi", kind: "citrus", seasonMonths: [12, 1, 2, 3, 4] },
  { commonName: "Mandarin", latinName: "Citrus reticulata", kind: "citrus", seasonMonths: [11, 12, 1, 2] },
  { commonName: "Kumquat", latinName: "Citrus japonica", kind: "citrus", seasonMonths: [12, 1, 2, 3] },
  { commonName: "Fig", latinName: "Ficus carica", kind: "fig", seasonMonths: [7, 8, 9, 10] },
  { commonName: "Persimmon", latinName: "Diospyros kaki", kind: "fig", seasonMonths: [10, 11, 12] },
  { commonName: "Pomegranate", latinName: "Punica granatum", kind: "fig", seasonMonths: [9, 10, 11] },
  { commonName: "Loquat", latinName: "Eriobotrya japonica", kind: "fig", seasonMonths: [3, 4, 5] },
  { commonName: "Grape", latinName: "Vitis vinifera", kind: "grape", seasonMonths: [8, 9, 10] },
  { commonName: "Wild Grape", latinName: "Vitis labrusca", kind: "grape", seasonMonths: [9, 10] },
  { commonName: "Walnut", latinName: "Juglans regia", kind: "nut", seasonMonths: [9, 10] },
  { commonName: "Black Walnut", latinName: "Juglans nigra", kind: "nut", seasonMonths: [9, 10, 11] },
  { commonName: "Pecan", latinName: "Carya illinoinensis", kind: "nut", seasonMonths: [10, 11] },
  { commonName: "Hickory", latinName: "Carya ovata", kind: "nut", seasonMonths: [9, 10] },
  { commonName: "Hazelnut", latinName: "Corylus avellana", kind: "nut", seasonMonths: [8, 9, 10] },
  { commonName: "Chestnut", latinName: "Castanea sativa", kind: "nut", seasonMonths: [9, 10, 11] },
  { commonName: "Almond", latinName: "Prunus dulcis", kind: "nut", seasonMonths: [8, 9] },
  { commonName: "Dandelion", latinName: "Taraxacum officinale", kind: "herb", seasonMonths: [3, 4, 5, 6, 7, 8, 9, 10] },
  { commonName: "Stinging Nettle", latinName: "Urtica dioica", kind: "herb", seasonMonths: [3, 4, 5, 6], description: "Cook or dry to deactivate sting." },
  { commonName: "Wild Garlic", latinName: "Allium ursinum", kind: "herb", seasonMonths: [3, 4, 5] },
  { commonName: "Ramps", latinName: "Allium tricoccum", kind: "herb", seasonMonths: [4, 5] },
  { commonName: "Purslane", latinName: "Portulaca oleracea", kind: "herb", seasonMonths: [6, 7, 8, 9] },
  { commonName: "Lamb's Quarters", latinName: "Chenopodium album", kind: "herb", seasonMonths: [5, 6, 7, 8, 9] },
  { commonName: "Miner's Lettuce", latinName: "Claytonia perfoliata", kind: "herb", seasonMonths: [2, 3, 4, 5] },
  { commonName: "Wood Sorrel", latinName: "Oxalis stricta", kind: "herb", seasonMonths: [4, 5, 6, 7, 8, 9] },
  { commonName: "Chickweed", latinName: "Stellaria media", kind: "herb", seasonMonths: [3, 4, 5, 10, 11] },
  { commonName: "Plantain", latinName: "Plantago major", kind: "herb", seasonMonths: [4, 5, 6, 7, 8, 9] },
  { commonName: "Mint", latinName: "Mentha × piperita", kind: "herb", seasonMonths: [5, 6, 7, 8, 9] },
  { commonName: "Rosemary", latinName: "Salvia rosmarinus", kind: "herb", seasonMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { commonName: "Fennel", latinName: "Foeniculum vulgare", kind: "herb", seasonMonths: [6, 7, 8, 9, 10] },
  { commonName: "Rose Hips", latinName: "Rosa canina", kind: "flower", seasonMonths: [9, 10, 11] },
  { commonName: "Elderflower", latinName: "Sambucus nigra", kind: "flower", seasonMonths: [5, 6] },
  { commonName: "Linden Blossom", latinName: "Tilia × europaea", kind: "flower", seasonMonths: [6, 7] },
  { commonName: "Chanterelle", latinName: "Cantharellus cibarius", kind: "mushroom", seasonMonths: [7, 8, 9, 10, 11], lookAlikes: ["Jack-o'-lantern mushroom (toxic)."] },
  { commonName: "Morel", latinName: "Morchella esculenta", kind: "mushroom", seasonMonths: [4, 5], lookAlikes: ["False morels (toxic) have wavy, not honeycomb, caps."] },
  { commonName: "Porcini", latinName: "Boletus edulis", kind: "mushroom", seasonMonths: [9, 10, 11] },
  { commonName: "Chicken of the Woods", latinName: "Laetiporus sulphureus", kind: "mushroom", seasonMonths: [8, 9, 10] },
  { commonName: "Prickly Pear", latinName: "Opuntia ficus-indica", kind: "veg", seasonMonths: [8, 9, 10] },
  { commonName: "Wild Asparagus", latinName: "Asparagus officinalis", kind: "veg", seasonMonths: [4, 5] },
  { commonName: "Fiddleheads", latinName: "Matteuccia struthiopteris", kind: "veg", seasonMonths: [4, 5], description: "Must cook. Only ostrich fern fiddleheads." },

  // ── Mulberry variants ─────────────────────────────────────────
  { commonName: "White Mulberry", latinName: "Morus alba", kind: "berry", seasonMonths: [5, 6, 7], description: "Sweet but often mild. Heavy bearer — trees drop fruit in piles. Unripe berries and raw leaves mildly hallucinogenic; stick to ripe fruit." },
  { commonName: "Black Mulberry", latinName: "Morus nigra", kind: "berry", seasonMonths: [6, 7, 8], description: "Darker, richer flavor than white mulberry. Stains everything." },

  // ── Stone fruit variants ──────────────────────────────────────
  { commonName: "Cherry Plum", latinName: "Prunus cerasifera", kind: "stone", seasonMonths: [6, 7, 8], description: "Small tart plums, often red or yellow. Common as ornamental street tree — plenty of windfall.", lookAlikes: ["Pit is cyanogenic like all Prunus — don't eat the pit or damaged kernels."] },

  // ── Elderberry variants — cook before eating, raw causes nausea
  { commonName: "Blue Elderberry", latinName: "Sambucus mexicana", kind: "berry", seasonMonths: [8, 9, 10], description: "Sierra + California native. Dusty-blue clusters. Must cook — raw causes nausea. Leaves, stems, and roots are toxic.", lookAlikes: ["Water hemlock looks somewhat similar in flower; always confirm by purple-black berries and pinnate compound leaves."] },
  { commonName: "Red Elderberry", latinName: "Sambucus racemosa", kind: "berry", seasonMonths: [6, 7, 8], description: "Red berries require thorough cooking; some sources recommend avoiding altogether. Seeds are particularly toxic.", isToxic: true, lookAlikes: ["Best avoided unless you know a tested recipe. Stick to Blue/Black elderberry if unsure."] },

  // ── Currants / gooseberries ───────────────────────────────────
  { commonName: "California Gooseberry", latinName: "Ribes californicum", kind: "berry", seasonMonths: [5, 6, 7], description: "Spined fruit of California chaparral. Ripe berries are dark purple; remove the spines by roasting briefly or rolling in sand." },
  { commonName: "Sierra Currant", latinName: "Ribes nevadense", kind: "berry", seasonMonths: [7, 8], description: "Bright pink flowers then dusty black berries. Middle/upper elevation Sierra." },
  { commonName: "Red Flowering Currant", latinName: "Ribes sanguineum", kind: "berry", seasonMonths: [6, 7, 8], description: "Pacific NW and Northern CA native. Edible but dry and seedy — better for jelly than fresh eating." },

  // ── Berries — Pacific / Sierra natives ────────────────────────
  { commonName: "Beach Strawberry", latinName: "Fragaria chiloensis", kind: "berry", seasonMonths: [5, 6, 7], description: "Small wild strawberry of coastal dunes and meadows. Intense flavor; parent species of commercial strawberries." },
  { commonName: "California Blackberry", latinName: "Rubus ursinus", kind: "berry", seasonMonths: [6, 7, 8], description: "Native trailing bramble with smaller thorns than Himalayan. Berries are smaller and more tart than commercial cultivars." },
  { commonName: "Saskatoon Serviceberry", latinName: "Amelanchier alnifolia", kind: "berry", seasonMonths: [6, 7, 8], description: "Blueberry-like flavor with a hint of almond. Ripens purple-black and slightly soft. Widespread from AK to CA." },
  { commonName: "Manzanita", latinName: "Arctostaphylos manzanita", kind: "berry", seasonMonths: [7, 8, 9], description: "Smooth red bark, dusty berries used for cider by Indigenous peoples. Soak and grind — tannins make them chalky raw.", lookAlikes: ["Many Arctostaphylos species; all known species are edible but differ in palatability."] },
  { commonName: "Kinnikinnick", latinName: "Arctostaphylos uva-ursi", kind: "berry", seasonMonths: [8, 9], description: "Low-growing groundcover form of manzanita, circumboreal. Mealy but edible raw; better cooked. Traditional smoked-leaf use.", lookAlikes: ["Salal and other low-growing berries; confirm by reddish bark and paired leaves."] },
  { commonName: "Toyon", latinName: "Heteromeles arbutifolia", kind: "berry", seasonMonths: [11, 12, 1], description: "California's \"Christmas berry.\" Red clusters bright through winter. Raw berries contain cyanogenic compounds — must cook, dry, or freeze; Indigenous people traditionally parch them.", isToxic: true, lookAlikes: ["Holly (non-edible) has similar look but glossier leaves and fewer berries per cluster."] },

  // ── Grapes ────────────────────────────────────────────────────
  { commonName: "California Wild Grape", latinName: "Vitis californica", kind: "grape", seasonMonths: [8, 9, 10], description: "Native climber along streams. Smaller, seedier, more tart than cultivated grapes. Excellent for jelly.", lookAlikes: ["Virginia creeper (TOXIC) has 5-leaflet compound leaves versus grape's simple lobed leaf."] },
  { commonName: "Fox Grape", latinName: "Vitis labrusca", kind: "grape", seasonMonths: [8, 9, 10], description: "Eastern US wild grape; Concord's ancestor. Thick-skinned, musky-sweet. Good fresh or for juice.", lookAlikes: ["Virginia creeper and moonseed (TOXIC) — moonseed berries have a crescent-shaped seed instead of grape's 2-4 pear-shaped seeds."] },

  // ── Oaks (acorns) — ALL require tannin leaching ──────────────
  { commonName: "Black Oak (acorns)", latinName: "Quercus kelloggii", kind: "nut", seasonMonths: [9, 10, 11], description: "Sierra + foothills keystone food. Acorns must be shelled and cold-leached in running water for 2+ days (or hot-leached with multiple water changes) to remove bitter tannins before eating.", lookAlikes: ["All Quercus acorns are edible after leaching, but California buckeye (Aesculus californica) is highly toxic — buckeye has a single large seed without a cup."] },
  { commonName: "Oregon White Oak (acorns)", latinName: "Quercus garryana", kind: "nut", seasonMonths: [9, 10, 11], description: "PNW white oak — acorns are less bitter than black oak but still need leaching. Traditional Kalapuya and other Indigenous food.", lookAlikes: ["California buckeye is highly toxic and lacks an acorn cup."] },
  { commonName: "Valley Oak (acorns)", latinName: "Quercus lobata", kind: "nut", seasonMonths: [9, 10, 11], description: "California's largest oak. Long, slender acorns — less tannic than black oak but still require leaching.", lookAlikes: ["California buckeye is toxic."] },
  { commonName: "Coast Live Oak (acorns)", latinName: "Quercus agrifolia", kind: "nut", seasonMonths: [10, 11, 12], description: "Evergreen coastal California oak. Smaller acorns, relatively high tannins — leach thoroughly.", lookAlikes: ["California buckeye is toxic."] },

  // ── Pine nuts — pitch can contaminate, cones must be dried ───
  { commonName: "Grey Pine (pine nuts)", latinName: "Pinus sabiniana", kind: "nut", seasonMonths: [9, 10, 11], description: "Also called Foothill or Digger Pine. Sierra foothill native. Cones are massive and produce large, oily seeds — a keystone food for Indigenous peoples. Shell after cones dry and open." },
  { commonName: "Sugar Pine (pine nuts)", latinName: "Pinus lambertiana", kind: "nut", seasonMonths: [9, 10, 11], description: "World's largest pine cones (up to 60cm). High-elevation Sierra. Seeds are large and oily but harder to reach." },
  { commonName: "Pinyon Pine (pine nuts)", latinName: "Pinus edulis", kind: "nut", seasonMonths: [9, 10, 11], description: "Great Basin and SW US. Small but rich seeds — traditional food across many Indigenous nations. Best harvested as cones crack open in autumn." },

  // ── Herbs / greens ────────────────────────────────────────────
  { commonName: "Three-cornered Leek", latinName: "Allium triquetrum", kind: "herb", seasonMonths: [2, 3, 4, 5], description: "Mediterranean wild garlic, now widespread in CA and UK. Three-angled stem, nodding white flowers. Strong garlicky flavor.", lookAlikes: ["All parts smell of garlic/onion — if it doesn't smell like an allium, don't eat it. Death camas and similar bulb plants lack the smell and are fatally toxic."] },
  { commonName: "California Bay Laurel", latinName: "Umbellularia californica", kind: "herb", seasonMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], description: "West coast native evergreen. Leaves are stronger than Mediterranean bay — use about 1/4 to 1/3 the quantity in cooking. Nuts (bay nuts) are edible roasted and bean-like in flavor.", lookAlikes: ["Volatile oils can cause headaches in sensitive people; start with a pinch. Don't confuse with toxic mountain laurel (Kalmia)."] },

  // ── Rose hips (California native) ─────────────────────────────
  { commonName: "California Rose Hips", latinName: "Rosa californica", kind: "flower", seasonMonths: [9, 10, 11, 12], description: "Native California wild rose. Hips (fruits) are bright red-orange, rich in vitamin C. Strain out the hairs inside; they're the historic \"itching powder.\"" },
];
