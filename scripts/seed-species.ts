/**
 * Seed species — run after schema push:
 *   npm run seed:species
 *
 * Adds ~60 common edibles. Extend freely — pull from GBIF for latin names.
 */

import { init, id } from "@instantdb/react-native";
import "dotenv/config";
import schema from "../src/db/schema";

const appId = process.env.INSTANT_APP_ID;
if (!appId) {
  console.error("Set INSTANT_APP_ID in .env");
  process.exit(1);
}

const db = init({ appId, schema });

type Seed = {
  commonName: string;
  latinName: string;
  kind: string;
  seasonMonths: number[];
  description?: string;
  isToxic?: boolean;
  lookAlikes?: string[];
};

const SPECIES: Seed[] = [
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
];

async function main() {
  console.log(`Seeding ${SPECIES.length} species…`);
  const txs = SPECIES.map((s) => db.tx.species[id()].update(s));
  await db.transact(txs);
  console.log("Done.");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
