import express from "express";
import { employeeLogin } from "../contollers/employeeController";



const router = express.Router();

router.post("/employeeLogin", employeeLogin);


export default router;

