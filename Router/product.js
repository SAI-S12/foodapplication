import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import Product from "../Module/product.js";
import { deleteproduct, getproduct } from "../Controller/product.js";

const routerrr = express.Router();
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

routerrr.post("/food/:id", upload, async (req, res) => {
  const id = req.params.id;
  try {
    const { name, price, category, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid hotel ID" });
    }

    const newproduct = new Product({
      hotel: id,
      name,
      price,
      category,
      description,
      image: req.file.filename,
    });
    await newproduct.save();

    return res
      .status(201)
      .json({ message: "product add succesfully", newproduct });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

routerrr.delete("/delete/:id", deleteproduct);
routerrr.get("/product", getproduct);

export default routerrr;
