const express = require("express");
const router = express.Router();

const {
    encryptData,
    decryptData
} = require("../controllers/encryptionController");

router.post("/encrypt", encryptData);
router.post("/decrypt", decryptData);

module.exports = router;
