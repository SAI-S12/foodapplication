import mongoose from "mongoose";

const logerscema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // expires in 5 mins
});

const loger = mongoose.model("loger", logerscema);
export default loger;
