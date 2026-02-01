const {
    encryptAES,
    decryptAES,
    encryptProduct,
    decryptProduct
} = require("../services/encryptionService");

exports.encryptData = (req, res) => {

    const { text, key, password, algorithm } = req.body;

    try {

        let cipherText;

        if (algorithm === "AES") {
            cipherText = encryptAES(text, key, password);
        }
        else if (algorithm === "PRODUCT") {
            cipherText = encryptProduct(text, key);
        }
        else {
            return res.status(400).json({ error: "Invalid algorithm" });
        }

        res.json({ cipherText });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.decryptData = (req, res) => {

    const { cipherText, key, password, algorithm } = req.body;

    try {

        let plainText;

        if (algorithm === "AES") {
            plainText = decryptAES(cipherText, key, password);
        }
        else if (algorithm === "PRODUCT") {
            plainText = decryptProduct(cipherText, key);
        }
        else {
            return res.status(400).json({ error: "Invalid algorithm" });
        }

        res.json({ plainText });

    } catch (err) {
        res.status(500).json({ error: "Wrong key or password" });
    }
};
