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

// app.get("/", (req, res) => {
//     console.log("hi");
//     res.json({ message: "Hello World!" });
// });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const token = process.env.API_KEY;
const storage = new NFTStorage({ token });
const upload = multer({ dest: "uploads/" });
app.post("/upload_article", upload.single("file"), async (req, res) => {
    // console.log("NEW POST");
    // console.log(req.body);
    const file = req.file;
    // console.log(file);
    const filebuffer = fs.readFileSync(file.path);
    // console.log(filebuffer);
    const blob = new Blob([filebuffer]);
    // console.log(blob);
    // const fileObject = new File([blob], file.originalname, {
    //     type: "application/pdf",
    // });
    // console.log(fileObject);

    try {
        const cid = await storage.storeBlob(blob);
        res.json({
            link: `https://nftstorage.link/ipfs/${cid}`,
        });
    } catch (err) {
        console.error(err);
        console.log(err.message);
    }
    // const cid = metadata.data.host;
    // res.json({ link: `https://nftstorage.link/ipfs/${cid}` });
});
