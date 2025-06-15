const sheetProductService = require("../sheetProductDataService");
const ProductModel = require("../../models/ProductModel");

async function importProductsFromSheet() {
  const { values } = await sheetProductService.getRows();

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

  const added = [];

  for (const item of mapped) {
    const exists = await ProductModel.findOne({
      where: { name: item.name }
    });

    if (!exists) {
      const created = await ProductModel.create(item);
      added.push(created);
    }
  }

  return added;
}


module.exports = importProductsFromSheet;
