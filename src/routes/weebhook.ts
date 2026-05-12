import express, { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Booking from "../models/matchesModel";

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Webhook event:", event.type);

switch (event.type) {

 
  case "payment_intent.succeeded": {
    const paymentIntent = event.data.object as any;
    console.log("paymentIntent",paymentIntent)
    console.log("Metadata:", paymentIntent.metadata);
   


    await handlePaymentSuccess(paymentIntent);
    break;
  }

  //  Checkout flow (NEW - add this)
case "checkout.session.completed": {
  const session = event.data.object as any;

  console.log("SESSION:", session);
  console.log("METADATA:", session.metadata);

  const bookingId = session.metadata?.bookingId;

  if (!bookingId) {
    console.error(" No bookingId in metadata");
    return;
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      paymentId: session.payment_intent,
      status: "completed",  
    },
    { new: true }
  );

  console.log("✅ Booking updated:", updatedBooking);

  break;
}

  case "payment_intent.payment_failed": {
    console.log("Payment Failed");
    break;
  }

  default:
    console.log(`Unhandled event: ${event.type}`);
}

  res.json({ received: true });
};



const handlePaymentSuccess = async (paymentIntent: any) => {
  try {
    const bookingId = paymentIntent.metadata?.bookingId;

    if (!bookingId) {
      console.log("No bookingId found in metadata");
      return;
    }

   
    const existing = await Booking.findOne({
      paymentId: paymentIntent.id,
    });

    if (existing) {
      console.log("Booking already processed");
      return;
    }

    
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentId: paymentIntent.id,
        paymentStatus: "paid",
        status: "completed",
      },
      { new: true }
    );

    console.log("Booking completed:", updatedBooking);

  } catch (error) {
    console.error("DB Error:", error);
  }
};