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

const getProductByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { storeCode, page = 0, hitsPerPage = 4 } = req.query;

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

  client.interceptors.request.use(interceptor);

  try {
    const baseUrl =
      storeCode === "applebees"
        ? "https://jdtfm1va02.execute-api.eu-north-1.amazonaws.com/dev/products/search"
        : "https://kf22v0ym9k.execute-api.eu-north-1.amazonaws.com/Dev/products/search";

    // Construct URL with pagination params
    const url = `${baseUrl}?categoryId=${categoryId}&hitsPerPage=${hitsPerPage}&page=${page}`;

    // Make API request
    const response = await client.get(url);
    console.log(response.data, "response");

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
