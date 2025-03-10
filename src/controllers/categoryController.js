const axios = require("axios");
const {aws4Interceptor} = require("aws4-axios");

const getAllCategories = async (req, res, next) => {
  try {
    const {storeCode} = req.query
    const url = `https://dev.aurascc.net/web-bff/categories?storeCode=${storeCode}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: req.header("Authorization"),
      },
    });

    res.json(response?.data);
  } catch (error) {
    console.error("Error:", error.message || error);
    next(error);
  }
};

// const getAllCategoriesById = async (req, res, next) => {
//   try {
//     const { categoryId } = req.params;
//     if (!categoryId) {
//       return res.status(400).json({ error: "Category ID is required" });
//     }
//     const url = `https://dev.aurascc.net/web-bff/categories/${categoryId}`;
//     // if (storeCode === "claires") {
//     //   url += `?storeCode=${storeCode}`;
//     // }
//     // console.log(url, "url");
//     const response = await axios.get(url, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: req.header("Authorization"),
//       },
//     });
//     // console.log(response?.data, "controllerResponseGETCATEGORYBYID");
//     res.json(response?.data);
//   } catch (error) {
//     console.error("Error:", error.message || error);
//     next(error); // Pass error to Expr
//   }
// };

const getProductByCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  // Create an Axios instance
  const client = axios.create({ timeout: 20000 });

  // AWS Signed Interceptor
  const interceptor = aws4Interceptor({
    region: "eu-north-1",
    service: "execute-api",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  client.interceptors.request.use(interceptor); // Attach interceptor

  try {
    const url = `https://kf22v0ym9k.execute-api.eu-north-1.amazonaws.com/Dev/products/search?categoryId=${categoryId}`;

    // Make request using client
    const response = await client.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

module.exports = {
  getAllCategories,
  // getAllCategoriesById,
  getProductByCategory,
};
