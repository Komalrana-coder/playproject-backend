import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/userModel";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";
const jwt = require("jsonwebtoken");



export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, city, phoneNumber } = req.body;

    if (!name || !email || !password || !city || !phoneNumber) {
      return res.status(400).json({
        status: false,
        message: "all fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

  
     let imageUrl = "";

      // upload to cloudinary
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);

        console.log(result);

        imageUrl = result.secure_url;
      }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      city,
      image:imageUrl
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};


export const userLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "invalid email or password" });
        }
        if (!user.password) {
            return res.status(400).json({
                message: "Password not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "invalid email or password" });
        }
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        const userData = user.toObject();
        delete userData.password;

        return res.status(200).json({
            message: "Login successful",
            user: userData,
            token
        });

    } catch (error: any) {
        console.log("Register Error:", error);


        return res.status(500).json({
            success: false,
            message: error.message
        });

    }


};

//single User
export const profile = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("AUTH HEADER:", req.headers.authorization);

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const user = await User.findById(decoded.id).select("-password");

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};


export const updateUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const updateData: any = { ...req.body };


    if (req.file) {
    
      const result = await cloudinary.uploader.upload(req.file.path);
    
      updateData.image = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      updateData,
      { new: true }
    );

    res.json({
      message: "Profile updated",
      data: updatedUser,
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
