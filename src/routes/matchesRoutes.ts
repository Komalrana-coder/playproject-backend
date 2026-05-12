import express from "express"
import { checkUser, createBooking, getAllMatches, getMyBooking, updatePlayers} from "../contollers/matchesController";
import { authMiddleware } from "../middlewares/auth";


const router = express.Router();

router.post("/createBooking", authMiddleware,createBooking);
router.get("/getAllMatches", authMiddleware,getAllMatches);
router.get("/getMyBooking", authMiddleware,getMyBooking);
router.post("/checkUser",checkUser)
router.put("/updatePlayers/:bookingId", updatePlayers);
export default router;

