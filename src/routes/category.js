const express = require("express");
const { getAllCategories, getAllCategoriesById } = require("../controllers/categoryController.js");

const router = express.Router();

router.get("/mycategories", (req, res, next) => {
    getAllCategories(req, res, next).catch(next);
});

router.get("/mycategories/:categoryId", (req, res, next) => {
    console.log("categoryRouterById")
    getAllCategoriesById(req, res, next).catch(next);
});
  
module.exports = router;