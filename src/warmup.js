const cron = require("node-cron");
const axios = require("axios");
const { aws4Interceptor } = require("aws4-axios");
require("dotenv").config();

const client = axios.create({ timeout: 20000 });
const interceptor = aws4Interceptor({
	region: "eu-north-1",
	service: "execute-api",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

client.interceptors.request.use(interceptor);

// // Run every 5 minutes
// cron.schedule("*/5 * * * *", async () => {
// 	try {
// 		const warmupUrl = "https://kf22v0ym9k.execute-api.eu-north-1.amazonaws.com/Dev/products/search?query=warmup";
// 		const res = await client.get(warmupUrl);
// 		console.log("Warmup ping successful at", new Date().toISOString());
// 	} catch (err) {
// 		console.warn("Warmup ping failed:", err);
	// }
// });
