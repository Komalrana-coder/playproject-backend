import mongoose from "mongoose";

interface User {
  email: string;
  password?: string;
  name:string;
  phoneNumber:number;
  city:string;
  otp:Number | null;
  otpExpiry: Date | null;
  image:string;
   }

const userSchema = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    
  }, 
  image: {
  type: String,
  default: "/uploads/default.jpg",
},
  name:{
    type:String,
    required:true
},
  phoneNumber:{
    type:Number,
    required:true},

  city:{
    type:String,
    required:true},
  otp:{
    type:Number,
  },
  otpExpiry:{
    type:Date
  }
});
const User = mongoose.model<User>("User", userSchema);

export default User;