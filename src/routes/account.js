const express = require("express");
const router = express.Router();

const { login } = require("../controllers/accountController");

router.post("/customers/login", async (req, res) => {
    try {
        const result = await login(req); 
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error, error: error });
    }
});

module.exports = router;