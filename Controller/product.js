import Product from "../Module/product.js";
import { unlink } from "fs";

export const getproduct = async (req, res) => {
  try {
    const product = await Product.find();
    if (!product) {
      return res.status(400).json({ message: "product no fucker " });
    }
    return res.status(200).json({ message: "data came erripuka", product });
  } catch (error) {
    res.status(500).json({ message: "internal error  erriipukakakk" });
  }
};

export const deleteproduct = async (req, res) => {
  try {
    const id = req.params.id;
    const food = await Product.findOne({ _id });
    unlink(`uploads/${food.image}`, (err) => {
      if (err) throw err;
      console.log("file was deleted");
    });
    if (!food) {
      return res.status(400).json({ message: "product delete succesfully" });
    }
    await Product.findByIdAndDelete({ _id });
    return res.status(200).json({ message: "datat delete succesfu;lluy" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error " });
  }
};
