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

  // ✅ PaymentIntent flow (your current one)
  case "payment_intent.succeeded": {
    const paymentIntent = event.data.object as any;
    console.log("paymentIntent",paymentIntent)
    console.log("Metadata:", paymentIntent.metadata); // debug

    await handlePaymentSuccess(paymentIntent);
    break;
  }

  // ✅ Checkout flow (NEW - add this)
  case "checkout.session.completed": {
    const session = event.data.object as any;

    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      console.error("❌ No bookingId in checkout session metadata");
      return;
    }

    // prevent duplicate updates
    const existing = await Booking.findOne({
      paymentId: session.payment_intent,
    });

    if (existing) {
      console.log("Booking already processed (checkout)");
      return;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentId: session.payment_intent,
        paymentStatus: "paid",
        status: "confirmed",
      },
      { new: true }
    );

    console.log("✅ Booking confirmed via checkout:", updatedBooking);

    break;
  }

  case "payment_intent.payment_failed": {
    console.log("❌ Payment Failed");
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

    // ✅ prevent duplicate updates
    const existing = await Booking.findOne({
      paymentId: paymentIntent.id,
    });

    if (existing) {
      console.log("Booking already processed");
      return;
    }

    // ✅ update existing booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentId: paymentIntent.id,
        paymentStatus: "paid",
        status: "confirmed",
      },
      { new: true }
    );

    console.log("Booking confirmed:", updatedBooking);

  } catch (error) {
    console.error("DB Error:", error);
  }
};