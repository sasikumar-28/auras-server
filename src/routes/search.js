const express = require("express");
const { search } = require("../controllers/searchController.js");
const router = express.Router();

router.get("/search", (req, res, next) => {
    search(req, res, next).catch(next);
  });


module.exports = router;
