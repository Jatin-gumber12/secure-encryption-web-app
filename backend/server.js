const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const encryptionRoutes = require("./routes/encryptionRoutes");

const app = express();

app.use(cors());   // ⭐ THIS FIXES FRONTEND ISSUE
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Encryption API is running 🚀");
});

app.use("/", encryptionRoutes);

app.listen(3000, () => {
    console.log("Backend running at http://localhost:3000");
});
