import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import Product from "../Module/product.js";
import { deleteproduct, getproduct } from "../Controller/product.js";
// import cloudinary from "../cloudinary.js"; // <-- Add this
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const routerrr = express.Router();

// Use memory storage for Cloudinary
const upload = multer({ storage: multer.memoryStorage() }).single("image");

routerrr.post("/food/:id", upload, async (req, res) => {
  const id = req.params.id;

  try {
    const { name, price, category, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid hotel ID" });
    }

    let imageUrl = null;

    // Upload to Cloudinary (if image exists)
    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ error: "Image upload failed" });
          }

          imageUrl = result.secure_url; // CLOUDINARY URL

          // Save product AFTER Cloudinary upload
          const newproduct = new Product({
            hotel: id,
            name,
            price,
            category,
            description,
            image: imageUrl, // Save Cloudinary URL
          });

          newproduct.save();

          return res
            .status(201)
            .json({ message: "Product added successfully", newproduct });
        }
      );

      // Send the file buffer to Cloudinary
      uploadStream.end(req.file.buffer);
      return; // prevent further execution
    }

    // If no image uploaded
    const newproduct = new Product({
      hotel: id,
      name,
      price,
      category,
      description,
      image: null,
    });

    await newproduct.save();

    return res.status(201).json({
      message: "Product added successfully",
      newproduct,
    });
  } catch (err) {
    console.error("Error in /food route:", err);
    res.status(500).json({ error: "Server error" });
  }
});

routerrr.delete("/delete/:id", deleteproduct);
routerrr.get("/product", getproduct);

export default routerrr;
