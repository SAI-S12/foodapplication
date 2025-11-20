import express from "express";
import { register, login, upadte, deleteuser } from "../Controller/Vendor.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update/:id", upadte);
router.delete("/delete/:id", deleteuser);

export default router;
