import mongoose, { Types } from "mongoose";

interface BookingType {
  user: Types.ObjectId;
  game: string;
  date: string;
  courtId: Types.ObjectId;
  duration: number;
  timeSlot: string[];
  gameType: string;
  players:string[];
  paymentId:string,
  status:string,
   
}

const bookingSchema = new mongoose.Schema<BookingType>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    game: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    courtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue.courts",
      required: true,
    },
    duration: {
      type: Number,

    },
    status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
    paymentId:{
      type:String,

    },

    timeSlot: [
      {
        type: String,
        required: true,
      },
    ],

    gameType: {
      type: String,
      required: true,
    },
   players: [
  {
    name: { type: String, required: true },
  
  }
]
  },

  { timestamps: true },
);

const Booking = mongoose.model<BookingType>("Booking", bookingSchema);

export default Booking;