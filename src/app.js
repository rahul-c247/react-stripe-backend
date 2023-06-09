const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const router = require("./api/routes/index")
dotenv.config();

const app = express();
var cors = require('cors')
app.use(express.json())

//app.use(cors()) // Use this after the variable declaration
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token', 'authorization'],
};
app.use(cors(corsOption));
app.use("/v1", router);

// create server code
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
}); 

app.post('/webhook', async (req, res) => {
	let data, eventType;

	// Check if webhook signing is configured.
	if (process.env.STRIPE_WEBHOOK_SECRET) {
		// Retrieve the event by verifying the signature using the raw body and secret.
		let event;
		let signature = req.headers['stripe-signature'];
		console.log('stripe.webhooks',stripe.webhooks);
		try {
			event = stripe.webhooks.constructEvent(
				req.rawBody,
				signature,
				process.env.STRIPE_WEBHOOK_SECRET
			);
			console.log('event',event);
		} catch (err) {
			console.log(`⚠️  Webhook signature verification failed.`);
			return res.sendStatus(400);
		}
		data = event.data;
		eventType = event.type;
	} else {
		// Webhook signing is recommended, but if the secret is not configured in `config.js`,
		// we can retrieve the event data directly from the request body.
		data = req.body.data;
		eventType = req.body.type;
	}

	if (eventType === 'payment_intent.succeeded') {
		// Funds have been captured
		// Fulfill any orders, e-mail receipts, etc
		// To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
		console.log('💰 Payment captured!');
	} else if (eventType === 'payment_intent.payment_failed') {
		console.log('❌ Payment failed.');
	}
	res.sendStatus(200);
});

/* const YOUR_DOMAIN = 'http://localhost:8001';

app.post('/create-checkout-session', async (req, res) => {
	const session = await process.env.STRIPE_SECRET_KEY.checkout.sessions.create({
	  line_items: [
		{
		  // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
		  price: 200,
		  quantity: 1,
		},
	  ],
	  mode: 'payment',
	  success_url: `${YOUR_DOMAIN}?success=true`,
	  cancel_url: `${YOUR_DOMAIN}?canceled=true`,
	});
  
	res.redirect(303, session.url);
  }); */

// Here start database connectivity
mongoose
  .connect(process.env.MONGODB_URI/*  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } */)
  .then(() => {
    console.log("Database connected successfully...");
  })
  .catch((e) => {
    console.log("Database connection error", e);
  });
