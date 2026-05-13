import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    game: String,
    date: {
  type: Date
},
    createdAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("match", matchSchema);