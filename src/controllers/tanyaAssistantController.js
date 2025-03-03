const axios = require("axios");
const {aws4Interceptor} = require("aws4-axios");

const tanyaShoppingAssistant = async (req, res, next) => {
  try {
    const { userId, pdp, whom,  } = req.query;
    const { prompt, storeCode } = req.body;
    
    if ( !userId || !pdp || !whom ) {
      res.status(400).json({ error: "Something is missing" });
    }

    const URL = `https://dev.aurascc.net/web-bff/assistant?userId=${userId}&pdp=${pdp}&whom=${whom}`;
    console.log(URL,"url")
    const response = await axios.post(
      URL,
      { prompt, storeCode },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: req.header("Authorization"),
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.message || error);
    next(error); // Pass error to Express error handler
  }
};

const getSearchProduct = async (req, res, next) => {
  const { search } = req.query;

  // Create an Axios instance
  const client = axios.create({ timeout: 20000 });

  // AWS Signed Interceptor
  const interceptor = aws4Interceptor({
    region: "eu-north-1",
    service: "execute-api",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Load from .env
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Load from .env
    },
  });

  client.interceptors.request.use(interceptor); // Attach interceptor

  try {
    const url = `https://kf22v0ym9k.execute-api.eu-north-1.amazonaws.com/Dev/products/search?query=${search}`;
    console.log(`Requesting searchproduct url: ${url}`);

    // Make request using client (ensures AWS signing is applied)
    const response = await client.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};



module.exports = { tanyaShoppingAssistant,getSearchProduct };
