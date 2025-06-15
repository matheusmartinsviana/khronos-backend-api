const sheetServiceService = require("../sheetServiceDataService");
const ServiceRepository = require("../../repositories/ServiceSheetRepository");
const ServiceModel = require("../../models/ServiceModel");

async function importProductsFromSheet() {
  const { values } = await sheetServiceService.getRows();
  if (!values || values.length === 0) return;

  const headers = values[0];
  const rows = values.slice(1);

  const mapped = rows
    .map((row) => {
      const obj = {};
      headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });

      if (!obj["DESCRIÇÃO"] || !obj["VALOR"]) return null;

      const priceStr = String(obj["VALOR"]).replace(/[^\d,.-]/g, '').replace(',', '.');

      return {
        name: obj["DESCRIÇÃO"],
        code: obj["CÓDIGO"] || null,
        price: parseFloat(priceStr) || 0,
        description: obj["DESCRIÇÃO"],
        zoning: obj["USO EM COMERCIAL E OU MANUTENÇÃO"] || null,
        product_type: "SERVIÇOS",
        observation: obj["OBSERVAÇÃO"] || null,
        segment: obj["SEGMENTO"] || "NÃO DEFINIDO",
      };
    })
    .filter(Boolean);

  const added = [];

  for (const item of mapped) {
    // Verifica se já existe por código ou nome
    const existing = await ServiceModel.findOne({
      where: {
        name: item.name
      }
    });

    if (!existing) {
      const created = await ServiceModel.create(item);
      added.push(created);
    }
  }

  return added;
}

module.exports = importProductsFromSheet;
