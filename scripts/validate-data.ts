import { products, validateCatalog, industries, productsForIndustry } from "../src/data/catalog";
const errors = validateCatalog();
console.log(`${products.length} products`);
for (const i of industries) console.log(`  ${i.id}: ${productsForIndustry(i.id).length} products`);
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("catalog OK");
