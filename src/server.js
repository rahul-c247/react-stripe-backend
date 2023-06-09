const express = require('express');
const cors = require('cors');
const app = express();
const { resolve } = require('path');
// Replace if using a different env file or config
const env = require('dotenv').config({ path: './.env' });

app.use(express.static(process.env.STATIC_DIR));
app.use(
	express.json({
		// We need the raw body to verify webhook signatures.
		// Let's compute it only when hitting the Stripe webhook endpoint.
		verify: function (req, res, buf) {
			if (req.originalUrl.startsWith('/webhook')) {
				req.rawBody = buf.toString();
			}
		},
	})
);
app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);
/* 
app.get('/', (req, res) => {
	const path = resolve(process.env.STATIC_DIR + '/index.html');
	res.sendFile(path);
}); */

console.log('test');
app.get('/config', (req, res) => {
	console.log('test');
	res.send({
		publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
	});
});

app.post('/create-payment-intent', async (req, res) => {
	params = {
		currency: 'USD',
		amount: 500,
		automatic_payment_methods: {
			enabled: true,
		},
	};
	try {
		const paymentIntent = await stripe.paymentIntents.create(params);

		// Send publishable key and PaymentIntent details to client
		res.send({
			clientSecret: paymentIntent.client_secret,
		});
	} catch (e) {
		return res.status(400).send({
			error: {
				message: e.message,
			},
		});
	}
});

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// https://dashboard.stripe.com/test/webhooks

app.listen(8001, () =>
	console.log(`Node server listening at http://localhost:8001`)
);
