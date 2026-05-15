import express from "express"

import { addVenue, getSingleVenue, getVenue,  removeVenueEmp, updateVenue } from "../contollers/venueController";
import upload from "../middlewares/multer.middleware";




const router= express.Router();



router.post("/addVenue", upload.single("image"),addVenue)
router.get("/getVenue",getVenue)
router.get("/getSingleVenue/:id",getSingleVenue)
router.put("/updateVenue/:id",upload.single("image"),updateVenue)
router.put("/removeVenueEmp/:id",removeVenueEmp)
export default router;