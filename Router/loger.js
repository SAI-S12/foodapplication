// import { sendOTP, verifyOTP } from "../Controller/loger.js";
import { sendOTP, verifyOTP } from "../Controller/loger.js";
import express from "express";

const routerr2 = express.Router();

routerr2.post("/send-otp", sendOTP);
routerr2.post("/verify-otp", verifyOTP);

export default routerr2;
