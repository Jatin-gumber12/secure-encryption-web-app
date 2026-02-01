const cipherService = require("../services/encryptionService");

exports.encryptData = (req,res)=>{
    const { text, key, cipherType } = req.body;
    const cipherText = cipherService.encrypt(text,key,cipherType);
    res.json({ cipherText });
};

exports.decryptData = (req,res)=>{
    const { cipherText, key, cipherType } = req.body;
    const plainText = cipherService.decrypt(cipherText,key,cipherType);
    res.json({ plainText });
};
