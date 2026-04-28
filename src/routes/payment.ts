import { configDotenv } from "dotenv";
import express, { Request, Response } from "express";
import Stripe from "stripe";
configDotenv()
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

router.post("/create-payment", async (req: any, res: Response) => {
  try {
    const { amount, courtId, date, players, bookingId } = req.body;

    const user  = req?.user;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "inr",
      metadata: {
        bookingId: bookingId,
        userId: user._id.toString(),
        courtId: courtId,
        date: date,
        players: JSON.stringify(players),
        

      },
    });







    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create-checkout-session", async (req: Request, res: Response) => {
  try {
        // const { bookingId } = req.body;
  const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "payment",

  line_items: [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: "Venue Booking",
        },
        unit_amount: 500 * 100,
      },
      quantity: 1,
    },
  ],

  metadata: {

    
    // bookingId: req.body.bookingId, // 👈 ADD THIS
  },

     
       
      

  success_url: "http://localhost:3000/api/user/openMatches",
});
    res.json({ url: session.url });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;