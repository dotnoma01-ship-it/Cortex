const publicProduct = (product) => {
  const p = product.toObject ? product.toObject() : product;
  return { ...p, id: p.externalId, desc: p.description, variants: p.variants.map((v) => ({ ...v, id: v.externalId })) };
};
module.exports = { publicProduct };
