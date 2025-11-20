import mongoose from "mongoose";

const producyscema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurent",
    required: true,
  }, // hotel reference
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String }, // e.g. "Veg", "Non-Veg"
  description: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const Product = mongoose.model("Product", producyscema);

export default Product;
