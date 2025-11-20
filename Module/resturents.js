import mongoose from "mongoose";

const resturentscema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  rating: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  region: { type: String },
  image: { type: String },
  offer: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const restaurent = mongoose.model("restaurent", resturentscema);
export default restaurent;
