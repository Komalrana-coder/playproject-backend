import mongoose from "mongoose";
interface Admin {
  email: string;
  password: string;
  otp:Number | null;
  otpExpiry: Date | null;
}

const adminSchema = new mongoose.Schema<Admin>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  otp:{
    type:Number,
  },
  otpExpiry:{
    type:Date
  }
});
const Admin = mongoose.model<Admin>("Admin", adminSchema);

export default Admin;