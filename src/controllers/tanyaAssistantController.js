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

const tanyaShoppingAssistantStream = async (req, res, next) => {
  try {
    const { userId, pdp, whom, registered } = req.query;
    const { prompt, storeCode, flowId, flowAliasId } = req.body;

    // Validate required fields
    if (!userId || !pdp || !whom || !registered || !prompt || !storeCode || !flowId || !flowAliasId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const URL = "https://dev.aurascc.net/web-bff/invoke/stream";

    // Make a request to the external API
    const response = await axios.post(
      URL,
      {
        flowId, // Use from request body, not process.env
        flowAliasId,
        input: {
          userPrompt: prompt,
          whom: whom,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: req.header("Authorization"),
        },
        params: { userId, pdp, whom, registered }, // Ensure params are correctly placed
        responseType: "stream",
        timeout: 20000,
      }
    );

    // Set headers for the client response
    res.setHeader("Content-Type", "application/json");

    // Stream response data to the client
    response.data.pipe(res);

    // Handle stream end
    response.data.on("end", () => {
      console.log("Stream ended successfully");
      res.end();
    });

    // Handle stream errors
    response.data.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Streaming error" });
      }
      res.end();
    });

    // Handle client disconnection
    req.on("close", () => {
      console.log("Client disconnected");
      if (response.request) {
        response.request.abort(); // Properly abort the request
      }
    });
  } catch (error) {
    console.error("Error:", error.message || error);

    if (error.response) {
      console.error("Response error:", error.response.status, error.response.data);
      return res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error("No response received:", error.request);
      return res.status(500).json({ error: "No response received from the external API" });
    } else {
      console.error("Request setup error:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};



module.exports = { tanyaShoppingAssistant,getSearchProduct ,tanyaShoppingAssistantStream};
