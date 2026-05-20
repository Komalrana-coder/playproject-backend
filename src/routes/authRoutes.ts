import express from "express";
import {  changePassword, forgetPassword, resetPassword, verifyOtp } from "../contollers/authController";

const router = express.Router();

router.post("/forgetPassword", forgetPassword);
 router.post("/resetPassword",resetPassword)
  router.post("/verifyOtp",verifyOtp)
 router.post("/changePassword",changePassword)



export default router;