const axios = require("axios");
const aws4 = require("aws4");

const search = async (req, res) => {
    
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "❌ Query parameter is required!" });
    }
    const accessKey = process.env.ALGOLIA_API_KEY;
    const secretKey = process.env.ALGOLIA_SECRET_KEY;
    const region = process.env.ALGOLIA_REGION;
    const service = process.env.ALGOLIA_SERVICE_NAME;
    const baseUrl = process.env.ALGOLIA_BASE_URL;
    try {
      const options = {
        host: new URL(baseUrl).host,
        path: `/dev/search?query=${encodeURIComponent(query)}`,
        method: "GET",
        service,
        region,
      };
  
      // Sign the request
      aws4.sign(options, {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      });
  
      // Make request to AWS
      const response = await axios.get(`${baseUrl}?query=${query}`, {
        headers: options.headers,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { search };
