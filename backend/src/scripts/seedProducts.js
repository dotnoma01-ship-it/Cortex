require("dotenv").config();
const connectDB = require("../config/db");
const Product = require("../models/Product");
const source = require("../../../frontend/src/data/products.json");

async function seed() {
  await connectDB();
  let created = 0;
  for (const item of source) {
    const document = {
      externalId: String(item.id), handle: item.handle, title: item.title, type: item.type, tags: item.tags, images: item.images,
      options: item.options, variants: item.variants.map((v) => ({ externalId: String(v.id), title: v.title, option1: v.option1, option2: v.option2, price: v.price, compare: v.compare, available: v.available, image: v.image })),
      description: item.desc, stock: item.stock, rating: item.rating, reviews: item.reviews, dims: item.dims, weight: item.weight, seat: item.seat, origin: item.origin, sku: item.sku,
    };
    const result = await Product.updateOne({ handle: item.handle }, { $setOnInsert: document }, { upsert: true });
    if (result.upsertedCount) created += 1;
  }
  console.log(`Product seed complete: ${created} created, ${source.length - created} already present.`);
  await require("mongoose").disconnect();
}
seed().catch(async (error) => { console.error("Product seed failed:", error.message); await require("mongoose").disconnect(); process.exit(1); });
