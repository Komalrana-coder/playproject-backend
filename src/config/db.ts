import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/playPadelPickle");

    console.log("MongoDB Connected ");
  } catch (error) {
    console.error("MongoDB Connection Failed ");
    process.exit(1);
  }
};

export default connectDB;