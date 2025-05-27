const sheetServiceService = require("../sheetServiceDataService");
const ServiceRepository = require("../../repositories/ServiceRepository");
const ServiceModel = require("../../models/ServiceModel");

const repository = new ServiceRepository(ServiceModel);

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

  await repository.deleteAll();

  const saved = await repository.bulkCreate(mapped);
  return saved;
}

module.exports = importProductsFromSheet;
