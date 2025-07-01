const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const fs = require("fs");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { price, name } = req.body;

    // Create PaymentIntent (mock success)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), // Convert to cents
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { name },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Payment processing failed" });
  }
});


app.post("/api/orders", (req, res) => {
  res.send("Order received");
});


// API route to serve restaurants.json data
app.get("/api/restaurants", (req, res) => {
  fs.readFile("restaurants.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load data" });
    }
    res.json(JSON.parse(data));
  });
});





app.listen(5000, () => console.log("Server running on port 5000"));
