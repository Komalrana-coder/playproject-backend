import express from "express";
import { addEmployee, adminLogin, createAdmin, getEmployee, getSingleEmployee,
     getSingleUser, getUsers, updateEmployee }
from "../contollers/adminController";

const router = express.Router();


router.post("/login", adminLogin);
router.post("/create-admin", createAdmin);
router.post("/addEmployee", addEmployee);
router.get("/getEmployee",getEmployee);
router.get("/getSingleEmployee/:id",getSingleEmployee);
router.put("/updateEmployee/:id",updateEmployee);
router.get("/getUsers",getUsers);
router.get("/getSingleUser/:id",getSingleUser);

export default router;
  
