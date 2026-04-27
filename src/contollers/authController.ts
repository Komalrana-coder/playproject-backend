import Admin from "../models/adminModel";
import { Request, Response } from "express";
import { sendEmail } from "../utils/sendEmail";
import { generateOtp } from "../utils/genrateOtp";
import bcrypt from "bcrypt";
import Employee from "../models/employee";
import User from "../models/userModel";
import jwt from "jsonwebtoken";

interface ForgetPasswordBody {
  email: string;
  role: string;
  newPassword:string;
}
const getModel = (role: string) => {

  if (role === "admin") return Admin;
   if (role === "employee") return Employee;
  throw new Error ("Invalid role");
};


export const forgetPassword = async (
  req: Request,
   res: Response) => { try{
  const { email } = req.body;
  
let user = await Admin.findOne({ email });
  let role = "admin";
  
  if (!user) {
     user = await Employee.findOne({ email });
      role = "employee";
  }
   
  if (!user) {
     user = await User.findOne({ email });
      role = "user";
  }
  if (!user) {
  return res.status(404).json({
    message: "Email not registered"
  });
}

  const otp= generateOtp();

  user.otp = otp;
  user.otpExpiry = new Date (Date.now() + 5 * 60 * 1000);

  await user.save();
  await sendEmail(email, otp);
 const token:string = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET!,
      { expiresIn: "10m" }
    );

  res.json({
    success:true,
    message: "OTP sent to email",
    token
  });
}
  catch (error){
return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

export const verifyOtp = async(req:Request,res:Response)=>{
  try {
    const{otp}=req.body;
   
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const { id, role } = decoded;

    let Model: any;
    if (role === "admin") Model = Admin;
    else if (role === "employee") Model = Employee;
    else if (role === "user") Model = User;

    const user = await Model.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    // ✅ check otp
    if (user.otp !== Number(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }
  
    return res.status(200).json({
      success: true,
      message: "OTP verified"
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};




export const resetPassword = async(req:Request,res:Response)=>{
  try{
    const{newPassword}= req.body;
    if(!newPassword){
       return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }


    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }
    let decoded:any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }


    const { id, role } = decoded;
    let Model: any;
    if (role === "admin") Model = Admin;
    else if (role === "employee") Model = Employee;
    else if (role === "user") Model = User;
 if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }
      const user = await Model.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    const hashPassword = await bcrypt.hash(newPassword,10);
    user.password= hashPassword;
    user.otp=null;
    user.otpExpiry=null;
     await user.save();
     return res.status(200).json({
      success:true,
      message :"password reset successfully"

     });
  }
  catch(error){
    return res.status(400).json({
      success:false,
      message:"server error"
    });
  }
};
export const changePassword = async(req:Request,res:Response)=>{
  try{
    const{email,password,newPassword}=req.body;
    //  const Model:any= getModel(role);

    if (!email || !password || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    const user=await Admin.findOne({email});
    let role = "admin";
     console.log("user",user)
      if (!user) {
      const user = await Employee.findOne({ email });
          role = "employee";
    if(!user){
      return res.status(404).json({
        success:false,
        message:"user not found"
      });
    }
    const isMatch = await bcrypt.compare(password, password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid old password"
      });
    }
    const hashPassword = await bcrypt.hash(newPassword,10);
    user.password= hashPassword;
    await user.save();


     return res.status(200).json({
      success:true,
      message :"password changed successfully"

     });
  }}
   catch(error){
    return res.status(500).json({
      success:false,
      message:"server error"
    });
  }
}


