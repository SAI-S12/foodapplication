import express from "express";
import mongoose from "mongoose";
import path from "path";
import restaurent from "../Module/resturents.js";
import { deletehotel, gethotels } from "../Controller/Hotel.js";
import multer from "multer";
const routerr = express.Router();

const dsstorage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(
      null,
      file.fieldname + "_" + Date.now() + "_" + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: dsstorage }).single("image");

routerr.post("/add-hotel", upload, async (req, res) => {
  try {
    const { vendor, name, rating, location, description, region, offer } =
      req.body;
    if (!mongoose.Types.ObjectId.isValid(vendor)) {
      return res.status(400).json({ error: "Invalid vendor ID" });
    }
    const image = req.file ? req.file.filename : null;

    const hotel = new restaurent({
      vendor,
      name,
      rating,
      location,
      region,
      description,
      image,
      offer,
    });
    await hotel.save();

    return res.status(201).json({ message: "hotel add succesfully", hotel });
  } catch (err) {
    console.error("Error in /add-hotel:", err);
    res.status(500).json({ error: err.message });
  }
});

routerr.get("/gethotel", gethotels);
routerr.delete("/delete/:id", deletehotel);

export default routerr;
