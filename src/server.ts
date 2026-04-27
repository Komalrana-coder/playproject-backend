import express from "express";
import *as dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";
import path from "path";
import { adminRoutes, authRoutes, employeeRoutes, userRoutes, venueRoutes, matchesRoutes } from "./routes";


dotenv.config();
connectDB();

const app = express();
const port= 8000;
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  // credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


app.get("/", (req, res) => {
  res.json({
    message: "Server is running"
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user",userRoutes);
app.use("/api/employee",employeeRoutes);
app.use("/api/venue",venueRoutes);
app.use("/api/matches",matchesRoutes);






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
