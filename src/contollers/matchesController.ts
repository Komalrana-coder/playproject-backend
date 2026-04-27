import { Request,Response } from "express";
import booking from "../models/matchesModel";
import Booking from "../models/matchesModel";
import User from "../models/userModel";
import Venue from "../models/venueModel";


export const createBooking = async (req: Request, res: Response) => {
  try {

    const {
      game,
      date,
       courtId,
      duration,
      timeSlot,
      gameType,
      players
      
    } = req.body;

  const user = (req as any).user;

if (!user) {
  return res.status(401).json({ message: "Unauthorized - No user" });
}

const userId = user.id;

    const newBooking = await booking.create({
      user: userId,
      game,
      date,
      timeSlot,
      gameType,
      courtId,
      duration,
      players
    });

    res.status(201).json({
      success: true,
      booking:newBooking
    });
  } catch (error: any) {
  console.log("BOOKING ERROR:", error);

  res.status(500).json({
    message: error.message,
  });
}
};



export const getAllMatches = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = Array.isArray(req.query.search)
      ? req.query.search[0]
      : String(req.query.search || "");

    const skip = (page - 1) * limit;

    let query: any = {};

    if (search) {
      query = {
        $or: [
          { "user.name": { $regex: search, $options: "i" } },
          { "user.match": { $regex: search, $options: "i" } },
        ],
      };
    }

    const bookings = await Booking.find(query)
      .populate("user")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

  
    const total = await Booking.countDocuments(query);


    const result = await Promise.all(
      bookings.map(async (booking) => {
        const venue = await Venue.findOne({
          "courts._id": booking.courtId,
        });

        const court = venue?.courts.find(
          (c: any) => c._id.toString() === booking.courtId.toString()
        );

        return {
          ...booking.toObject(),
          venue,
          court,
        };
      })
    );

    res.status(200).json({
      message: "Bookings fetched successfully",
      data: result,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error: any) {
    console.error("ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};


//my booking
export const getMyBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const bookings = await Booking.find({ user: userId })
      .populate("user")
      .sort({ createdAt: -1 });

    const result = await Promise.all(
      bookings.map(async (booking) => {
        const venue = await Venue.findOne({
          "courts._id": booking.courtId,
        });

        const court = venue?.courts.find(
          (c: any) => c._id.toString() === booking.courtId.toString()
        );

        return {
          ...booking.toObject(), 
          venue,
          court,
        };
      })
    );

    res.status(200).json({
      message: "My bookings fetched",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

//check user
export const checkUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email required" });
    }

    const newUser = await User.create({
      name,
      email,
    });

    return res.status(201).json({
      message: "User created",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};