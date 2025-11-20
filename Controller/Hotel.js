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

    if (!id) {
      return res.status(400).json({ message: "user not found " });
    }
    const list = await restaurent.findById(_id);
    unlink(`uploads/${list.image}`, (err) => {
      if (err) throw err;
      console.log("file was deleted");
    });
    await restaurent.findByIdAndDelete(_id);
    return res.status(200).json({ json: "hotel delete succesfullly" });
  } catch (error) {
    res.status(500).json({ message: "internal error " });
  }
};
