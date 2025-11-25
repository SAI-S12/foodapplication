import express from "express";
import mongoose from "mongoose";
import restaurent from "../Module/resturents.js";
import { deletehotel, gethotels } from "../Controller/Hotel.js";
import multer from "multer";
// <-- import Cloudinary
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const routerr = express.Router();

// Upload file to memory (not disk)
const upload = multer({ storage: multer.memoryStorage() }).single("image");

routerr.post("/add-hotel", upload, async (req, res) => {
  try {
    const { vendor, name, rating, location, description, region, offer } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(vendor)) {
      return res.status(400).json({ error: "Invalid vendor ID" });
    }

    // Upload image to Cloudinary
    let imageUrl = null;
    if (req.file) {
      const cloudinaryRes = await cloudinary.uploader.upload_stream(
        { folder: "hotels" },
        (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: "Upload failed" });
          }
          imageUrl = result.secure_url;

          const hotel = new restaurent({
            vendor,
            name,
            rating,
            location,
            region,
            description,
            image: imageUrl,
            offer,
          });

          hotel.save();
          return res.status(201).json({
            message: "Hotel added successfully",
            hotel,
          });
        }
      );

      cloudinaryRes.end(req.file.buffer);
      return; // Stop further execution
    }

    // If no image
    const hotel = new restaurent({
      vendor,
      name,
      rating,
      location,
      region,
      description,
      image: null,
      offer,
    });

    await hotel.save();

    return res.status(201).json({ message: "hotel added successfully", hotel });
  } catch (err) {
    console.error("Error in /add-hotel:", err);
    res.status(500).json({ error: err.message });
  }
});

routerr.get("/gethotel", gethotels);
routerr.delete("/delete/:id", deletehotel);

export default routerr;
