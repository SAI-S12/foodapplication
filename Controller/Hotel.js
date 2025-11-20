import restaurent from "../Module/resturents.js";
import { unlink } from "fs";

export const gethotels = async (req, res) => {
  try {
    const hotels = await restaurent.find();
    if (!hotels) {
      return res.status(401).json({ message: "hotels not there fucker " });
    }
    res.status(200).json({ message: "hotels fetched ", hotels });
  } catch (error) {
    return res.status(500).json({ message: "internal server fucker" });
  }
};

export const deletehotel = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if ID exists
    if (!id) {
      return res.status(400).json({ message: "Hotel ID is required" });
    }

    // Find hotel by ID
    const hotel = await restaurent.findById(id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Delete image safely (if image exists)
    if (hotel.image) {
      unlink(`uploads/${hotel.image}`, (err) => {
        if (err) {
          console.log("Image delete error:", err);
        } else {
          console.log("Hotel image deleted");
        }
      });
    }

    // Delete hotel record
    await restaurent.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Hotel deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
