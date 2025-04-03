const axios = require("axios");

const externalApiUrl = 'https://dev.aurascc.net/web-bff/customers/login';

const login = async (req) => {
  try {
    const payload= {
        "emailId": req.body.emailId,
        "password": req.body.password
      }
    const response = await axios.post(
        externalApiUrl,
        payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization,
        },
      }
    );
    return response.data; 
  } catch (error) {
      throw error;
  }
};

module.exports = { login };