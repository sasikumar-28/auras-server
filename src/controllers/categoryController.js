const axios = require("axios");

const getAllCategories = async (req, res, next) => {
 
  try {
    const url = `https://dev.aurascc.net/web-bff/categories`;
    // if (storeCode === "claires") {
    //   url += `?storeCode=${storeCode}`;
    // }
    console.log(url,"category url")
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: req.header("Authorization"),
      },
    });
    console.log(response.data,"getAllCategories")
     res.json(response?.data);
    
  } catch (error) {
    console.error("Error:", error.message || error);
    next(error); // Pass error to Expr
  }
};

const getAllCategoriesById = async (req, res, next) => {
 
  try {

    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    }
    const url = `https://dev.aurascc.net/web-bff/categories/${categoryId}`;
    // if (storeCode === "claires") {
    //   url += `?storeCode=${storeCode}`;
    // }
    // console.log(url, "url");
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: req.header("Authorization"),
      },
    });
    console.log(response?.data,"controllerResponseGETCATEGORYBYID")
     res.json(response?.data);
    
  } catch (error) {
    console.error("Error:", error.message || error);
    next(error); // Pass error to Expr
  }
};



module.exports = { getAllCategories, getAllCategoriesById };
