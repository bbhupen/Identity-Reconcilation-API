const express = require('express');
const { identifyUser } = require('../services/contactServices');
const router = express.Router()

router.get("/", async (req, res) => {
    res.send(`Please visit /api/v1/identify to access the identity reconcilation check`);
})

router.post("/api/v1/identify", async (req,res) => {
    const requestBody = req.body;
    const response = await identifyUser(requestBody);

    if (!response || Object.keys(response).length === 0) {
        return res.status(404).json({ error: 'Unexpected error occurred'});
      }

    res.status(200).json(response);

})

module.exports = router;