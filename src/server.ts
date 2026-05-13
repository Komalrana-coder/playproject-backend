import express from "express";
import *as dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";
import path from "path";
import paymentRoutes from "./routes/payment";
import { adminRoutes, authRoutes, employeeRoutes, userRoutes, venueRoutes, matchesRoutes } from "./routes";
import { Session } from "inspector";
import { handleWebhook } from "./routes/weebhook";


dotenv.config();
connectDB();

const app = express();
const port= 8000;
app.use(cors({
  origin: "https://projectplay-fronend.vercel.app/",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

}));

app.post(
  "/webhook",
  express.raw({ type: "application/json" }), 
  handleWebhook
);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({
    message: "Server is running"
  });
});
app.use("/api", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user",userRoutes);
app.use("/api/employee",employeeRoutes);
app.use("/api/venue",venueRoutes);
app.use("/api/matches",matchesRoutes);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
