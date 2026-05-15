import express from "express";
import { registerUser, userLogin,profile, updateUser} from "../contollers/userController";
import upload from "../middlewares/multer.middleware";



const router = express.Router();

router.post("/register" ,upload.single("image"), registerUser);
router.post("/userLogin", userLogin);
router.get("/profile",profile);
router.put("/update-profile", upload.single("image"), updateUser);

export default router;

