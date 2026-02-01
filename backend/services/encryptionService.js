const crypto = require("crypto");

// ===== Generate secure key from key + password =====

function generateFinalKey(key, password) {
    return crypto.createHash("sha256")
        .update(key + password)
        .digest();
}

// ===== AES ENCRYPTION =====

function encryptAES(text, key, password) {

    const finalKey = generateFinalKey(key, password);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv("aes-256-cbc", finalKey, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
}

function decryptAES(cipherText, key, password) {

    const finalKey = generateFinalKey(key, password);

    const [ivHex, encryptedText] = cipherText.split(":");

    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv("aes-256-cbc", finalKey, iv);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

// ===== PRODUCT CIPHER =====

function substitute(text, shift) {

    return text.split("").map(char => {

        if (!/[a-zA-Z]/.test(char)) return char;

        const base = char <= "Z" ? 65 : 97;

        return String.fromCharCode(
            (char.charCodeAt(0) - base + shift) % 26 + base
        );

    }).join("");
}

function transpose(text) {

    const mid = Math.floor(text.length / 2);

    return text.slice(mid) + text.slice(0, mid);
}

function encryptProduct(text, key) {

    const shift = parseInt(key) % 26;

    return transpose(substitute(text, shift));
}

function decryptProduct(cipherText, key) {

    const mid = Math.floor(cipherText.length / 2);

    const reordered =
        cipherText.slice(cipherText.length - mid) +
        cipherText.slice(0, cipherText.length - mid);

    const shift = parseInt(key) % 26;

    return substitute(reordered, 26 - shift);
}

module.exports = {
    encryptAES,
    decryptAES,
    encryptProduct,
    decryptProduct
};
