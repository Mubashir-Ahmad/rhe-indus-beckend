import catchAsyncError from "../middleware/catch.js";
import stripePackage from "stripe";
import dotenv from 'dotenv';

dotenv.config({path:'beckend/config/config.env'})

const stripe = stripePackage(process.env.SRTIPE_SECRET_KEY);

// console.log(process.env.SRTIPE_SECRET_KEY);

const processpayment = catchAsyncError(async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://the-indus-beckend.vercel.app");
  const mypayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'inr',
    metadata: {
      company: 'The_Indus',
    },
  });
  res.status(200).json({ success: true, client_secret: mypayment.client_secret });
});

const sendstripkey = catchAsyncError(async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    // Respond to the preflight request
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.status(200).end(); // End the OPTIONS request here
  } else {
    // Handle the actual request as before
    console.log('sendstripkey function called');
    console.log('Before calling getJWTtoken', process.env.JWT_SECRET);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    console.log('Before calling getJWTtoken', process.env.JWT_SECRET);
    console.log('hello');
    res.status(200).json({ sendstripkey: process.env.STRIPE_API_KEY });
  }
});

export{processpayment , sendstripkey};
