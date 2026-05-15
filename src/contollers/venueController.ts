import { Request,Response } from "express";
import Venue from "../models/venueModel";
import mongoose from "mongoose";
import { error } from "console";
import cloudinary from "../config/cloudinary";


export const addVenue = async (req: Request, res: Response) => {
    try{
        const{name,address,city,state,status,courts,facilities,employee,timings,games,description}= req.body;
        console.log("req.body",req.body)
        if(!name||!address||!city)
            {
            return res.status(500).json({
                success:false,
                message:"all feilds are required"
            })
        }

   let imageUrl = "";

      // upload to cloudinary
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);

        imageUrl = result.secure_url;
      }


const newVenue = await Venue.create({
  name,
  address,
  city,
  state,
  description,
  status,
  facilities: JSON.parse(req.body.facilities || "[]"),
  timings: JSON.parse(req.body.timings || "[]"),
  employee: JSON.parse(req.body.employee || "[]"),
  courts: JSON.parse(req.body.courts || "[]"),
  games: JSON.parse(req.body.games || "[]"),
  image:imageUrl
});
       
        console.log("newVenue",newVenue)
        return res.status(201).json({
            success: true,
            message: "venue added",
              data: newVenue,
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}

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
   const total = await Venue.countDocuments(query);
   const employees= await Venue.find(query)
   .skip(skip)
   .limit(limit)
   .sort({createdAt: -1});

   res.status(200).json({
    success:true,
    Venue,
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






export const getVenue = async(req:Request,res:Response)=>
{
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
       {city:{$regex:search,$options:"i"}},
    ],
   };
  }

  const total = await Venue.countDocuments(query);
   const venue= await Venue.find(query)
   .skip(skip)
   .limit(limit)
   .sort({createdAt: -1});
          
   res.status(200).json({
    success:true,
    venue,
    totalPages:Math.ceil(total/limit),
    currentPage:page,

   });
  }


 
     catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error"
        });
    }
}    

//single venue

export const getSingleVenue =async(req:Request,res:Response)=>{
  try {
    const { id } = req.params;
    
    const venue = await Venue.findById(id).populate("employee");

    if (!venue) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json({
        success:true,
        data:venue,
    });

  } catch (error:any) {
    console.error("error",error)
    res.status(500).json({ message: error.message });
  }
};


export const updateVenue = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const updateData: any = {
      name: body.name,
      description: body.description,
      address: body.address,
      city: body.city,
      state: body.state,
      status: body.status,

      facilities: body.facilities ? JSON.parse(body.facilities) : [],
      timings: body.timings ? JSON.parse(body.timings) : {},
      employee: body.employee ? JSON.parse(body.employee) : [],
      courts: body.courts ? JSON.parse(body.courts) : [],
      games: body.games ? JSON.parse(body.games) : [],
    };

    //  HANDLE IMAGE SAFELY
   

    if (req.file) {
    
      const result = await cloudinary.uploader.upload(req.file.path);
    
      updateData.image = result.secure_url;
    }

    const updatedVenue = await Venue.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ success: true, data: updatedVenue });

  } catch (err: any) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};





//remove employee

export const removeVenueEmp = async (req:Request, res:Response) => {

  const {id} = req.params;
  
if (!id) {
  return res.status(400).json({
    success: false,
    message: "id not found",
    data: null,
  });
}

 
try {
  const updatedVenue = await Venue.findByIdAndUpdate(
  id,
  {
   $pull: { employees: req.body.employees}
  },
  { new: true }
);
   return res.status(200).json({
      success: true,
      message: "Employee removed successfully",
      data: updatedVenue,
    });

} catch (error) {
  throw error
}
}


 




    
    
    
    
    
    
 