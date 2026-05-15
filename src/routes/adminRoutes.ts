import express from "express";
import { addEmployee, adminLogin, createAdmin, getEmployee, getSingleEmployee,
     getSingleUser, getUsers, updateEmployee }
from "../contollers/adminController";
import upload from "../middlewares/multer.middleware";



const router = express.Router();


router.post("/login", adminLogin);
router.post("/create-admin", createAdmin);
router.post("/addEmployee", upload.single("image"), addEmployee);
router.get("/getEmployee",getEmployee);
router.get("/getSingleEmployee/:id",getSingleEmployee);
router.put("/updateEmployee/:id",upload.single("image"),updateEmployee);
router.get("/getUsers",getUsers);
router.get("/getSingleUser/:id",getSingleUser);

export default router;
  
