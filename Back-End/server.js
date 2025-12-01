// Back-End/server.js
import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

app.get("/", (_req, res) => res.send("Stripe backend OK"));

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, name, email } = req.body;
    if (!amount) return res.status(400).json({ error: "amount required" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "mxn",
      automatic_payment_methods: { enabled: true },
      receipt_email: email || undefined,
      metadata: { name: name || "", email: email || "" },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: (error && error.message) || String(error) });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Stripe backend running on port ${PORT}`));
