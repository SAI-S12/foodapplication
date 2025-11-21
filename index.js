import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import router from "./Router/rout.js";
import routerr from "./Router/hotelroute.js";
import routerrr from "./Router/product.js";
import bodyParser from "body-parser";
import routerr2 from "./Router/loger.js";

dotenv.config();
const app = express();
const port = 3000;

mongoose
  .connect(
    "mongodb+srv://sssainath1234:sai1234@cluster0.raf4ecf.mongodb.net/?appName=Cluster0"
    // process.env.mongodb
  )
  .then(() => {
    console.log("connected madarchod");
    console.log("====================================");
  })
  .catch(() => {
    console.log("====================================");
    console.log("not connected madarchod");
  });
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true }));

///
app.use("/api", router);
app.use("/api1", routerr);
app.use("/api2", routerrr);
app.use("/loger", routerr2);
app.use("/images", express.static("uploads"));

app.listen(port, () => {
  console.log("====================================");
  console.log(`server running on port :${port}`);
  console.log("====================================");
});
