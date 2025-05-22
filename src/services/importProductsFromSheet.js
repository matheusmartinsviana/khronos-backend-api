const sheetService = require("./sheetProductDataService");
const ProductRepository = require("../repositories/ProductRepository");
const ProductModel = require("../models/ProductModel");

const repository = new ProductRepository(ProductModel);

async function importProductsFromSheet() {
  const { values } = await sheetService.getRows();

  if (!values || values.length === 0) return;

  const headers = values[0];
  const rows = values.slice(1);
 
  const mapped = rows
    .map((row) => {
      const obj = {};
      headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });

      if (!obj["PRODUTO"] || !obj["VALOR"]) return null;

      return {
        name: obj["PRODUTO"],
        price: parseFloat(String(obj["VALOR"]).replace('R$', '').replace(',', '.').trim()) || 0,
        zoning: obj["USO EM COMERCIAL E OU MANUTENÇÃO"] || null,
        product_type: obj["GRUPO"] || "NÃO DEFINIDO",
        description: obj["OBS"] || null,
      };
    })
    .filter(Boolean); 

  await repository.deleteAll();

  const saved = await repository.bulkCreate(mapped);
  return saved;
}

module.exports = importProductsFromSheet;
