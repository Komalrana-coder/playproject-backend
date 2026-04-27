import express from "express";
import { registerUser, userLogin,profile} from "../contollers/userController";



const router = express.Router();

router.post("/register", registerUser);
router.post("/userLogin", userLogin);
router.get("/profile",profile);

export default router;

