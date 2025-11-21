import User from "../Module/Vendor.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const key = process.env.secrete_key;

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "all fields are required " });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already exist madarchod" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newuser = new User({
      username,
      email,
      password: hashpassword,
    });
    await newuser.save();
    return res.status(200).json({
      success: true,
      message: "register succesfully madarchod",
      newuser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server " });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "all fields required madarchod " });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user not found madarchod " });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return res
        .status(400)
        .json({ message: "passsword incorrect madarchod " });
    }
    const token = jwt.sign({ id: user._id }, key, { expiresIn: "7d" });
    return res.status(200).json({
      success: true,
      message: "login succesfull madarchod ",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const upadte = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findById(id);
    if (!data) {
      return res.status(400).json({ mess: "user not found " });
    }
    const updatedate = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res
      .status(200)
      .json({ mess: "data update succesfully", updatedate });
  } catch (error) {
    return res.status(401).json({ mess: "error" });
  }
};

export const deleteuser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findById(id);
    if (!data) {
      return res.status(400).json({ mess: "user not found " });
    }
    const updatedate = await User.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, mess: "data delete  succesfully" });
  } catch (error) {
    return res.status(401).json({ mess: "error" });
  }
};
