import { Request, Response } from "express";
import Admin from "../models/adminModel";
import bcrypt from "bcrypt";
import Employee from "../models/employee";
import User from "../models/userModel";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary";



// Static admin email
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Create admin (only once)
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      email: ADMIN_EMAIL,
      password: hashedPassword
    });

    await admin.save();
    return res.json({
      success: true,
      message: "Admin created"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
// Admin Login
export const adminLogin = async (req: Request, res: Response) => {
 const { email, password } = req.body;

  console.log("Request Email:", email);
  console.log("Admin Email:",email);
 console.log("ENV ADMIN EMAIL:", process.env.ADMIN_EMAIL);
  // Check empty fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }
  


  // Find admin in database
  let user = await Admin.findOne({ email });
  let role = "admin";
 console.log("user",user)
  if (!user) {
     user = await Employee.findOne({ email });
      role = "employee";
  }
   if (!user) {
     user = await User.findOne({ email });
      role = "user";
  }

   console.log("user---employee",user)

  if(user ===null){
return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }
  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid password"
    });
  }

//create token
  
 const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: role
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );




  // Success
  return res.status(200).json({
    success: true,
    role: role,
    token,
    message: " login successfully"
  });
};


// add employee
export const addEmployee = async (req: Request, res: Response) => {
    try {
        const {name,email, password,phoneNumber,status}=req.body;

        if ( !name||!email || !password || !phoneNumber) {
            return res.status(400).json({
                status: false,
                message: "all fields are required"
            });
        }
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(500).json({
                success: false,
                message: "email already exists"
            })
        }
           
        let imageUrl = "";

    if (req.file) {
      console.log("Uploading to cloudinary...");

 const result = await cloudinary.uploader.upload(req.file.path);

      console.log( result);

       imageUrl = result.secure_url;
      
    }
    const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = new Employee({
            name,
            email,
            password:hashedPassword,
            phoneNumber,
            status,
            image:imageUrl,
           
        });
        await newEmployee.save();
        console.log(req.file);

        return res.status(201).json({
            success: true,
            message: "employee registered successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}
//View employee
export const getEmployee = async(req:Request,res:Response)=>{
  try{
   const page = Number(req.query.page) ||1;
   const limit = Number(req.query.limit)||10;
   const search= Array.isArray(req.query.search)
   ?req.query.search[0]
   :String(req.query.search||"");

   const skip= (page-1)*limit;

  let query: any={};
   if(search){
    query=
   {
    $or:[
      {name:{$regex:search,$options:"i"}},
       {email:{$regex:search,$options:"i"}},
    ],
   };
  }
   const total = await Employee.countDocuments(query);
   const employees= await Employee.find(query)
   .skip(skip)
   .limit(limit)
   .sort({createdAt: -1});

   res.status(200).json({
    success:true,
    employees,
    totalPages:Math.ceil(total/limit),
    currentPage:page,

   });
  }
  catch(error){
    res.status(500).json({
      success:false,
      message:"error fetching employees",
    });
  }
};


//Single Employee


export const getSingleEmployee =async(req:Request,res:Response)=>{
  try {
    const { id } = req.params;
    //  if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: "Invalid ID" });
    // }

    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);

  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};




// UPDATE EMPLOYEE
  export const updateEmployee = async (req: Request <{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

     if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const updateData: any = { ...req.body };

   if (req.file) {

  const result = await cloudinary.uploader.upload(req.file.path);

  updateData.image = result.secure_url;
}


    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      updateData,
      { new: true } 
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
      message: "Employee updated successfully",
      data: updatedEmployee,
    });

  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};



//view Users
export const getUsers = async(req:Request,res:Response)=>{
  try{
   const page = Number(req.query.page) ||1;
   const limit = Number(req.query.limit)||10;
   const search= Array.isArray(req.query.search)
   ?req.query.search[0]
   :String(req.query.search||"");

   const skip= (page-1)*limit;

  let query: any={};
   if(search){
    query=
   {
    $or:[
      {name:{$regex:search,$options:"i"}},
       {email:{$regex:search,$options:"i"}},
    ],
   };
  }
   const total = await User.countDocuments(query);
   const users= await User.find(query)
   .skip(skip)
   .limit(limit)
   .sort({createdAt: -1});

   res.status(200).json({
    success:true,
    users,
    totalPages:Math.ceil(total/limit),
    currentPage:page,
   });
  }
  catch(error){
    res.status(500).json({
      success:false,
      message:"error fetching user",
    });
  }
};


//single user
export const getSingleUser =async(req:Request,res:Response)=>{
  try {
    const { id } = req.params;
    

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json(user);

  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};



