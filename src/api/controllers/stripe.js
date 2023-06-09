const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

/* exports.config = async (req, res) => {
    console.log('test');
	res.send({
		publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
	});
} */

exports.createIntent = async (req, res) => {
	const {price ,currency,description,productid,customerEmail} = req.body
	console.log('price',price);
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			currency: currency,
			amount: price,
			automatic_payment_methods: {
				enabled: false,
			},
			description:description,
			metadata:{
				uid:productid
			}
		});

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
}