import express from "express"
import { checkUser, createBooking, getAllMatches, getMyBooking} from "../contollers/matchesController";
import { authMiddleware } from "../middlewares/auth";


const router = express.Router();

router.post("/createBooking", authMiddleware,createBooking);
router.get("/getAllMatches", authMiddleware,getAllMatches);
router.get("/getMyBooking", authMiddleware,getMyBooking);
router.post("/checkUser",checkUser)
export default router;

