const axios = require("axios");

const tanyaShoppingAssistant = async (req, res, next) => {
  try {
    const { userId, pdp, whom, registered } = req.query;
    const { prompt, storeCode } = req.body;

    // console.log("userQuery", userId, pdp, whom, registered);
    // console.log("prompt", prompt);
    // console.log("storecode", storeCode);

    if ( !userId || !pdp || !whom || !registered) {
      res.status(400).json({ error: "Something is missing" });
    }

    const URL = "https://dev.aurascc.net/web-bff/assistant";
    const response = await axios.post(
      URL,
      { prompt, storeCode }, // Body
      {
        params: {
          userId,
          pdp,
          whom,
          registered,
        },
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

module.exports = { tanyaShoppingAssistant };
