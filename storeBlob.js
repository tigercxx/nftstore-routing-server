const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { Blob } = require("buffer");
const app = express();
const port = 3000;
const { NFTStorage } = require("nft.storage");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
// token from NFTStorage
// Add your API_KEY in a .env file
const token = process.env.API_KEY;
const storage = new NFTStorage({ token });
const upload = multer({ dest: "uploads/" });
app.post("/upload_article", upload.single("file"), async (req, res) => {
    // expects a formData object in body of request with file appended
    const file = req.file;
    const filebuffer = fs.readFileSync(file.path);
    const blob = new Blob([filebuffer]);
    try {
        // returns a cid of the file stored on NFTStorage
        const cid = await storage.storeBlob(blob);
        res.json({
            link: `https://nftstorage.link/ipfs/${cid}`,
        });
    } catch (err) {
        console.error(err);
        console.log(err.message);
    }
});
