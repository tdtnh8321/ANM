const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const { google } = require("googleapis");
const { uploadFile } = require("./upload.js");
const multer = require("multer");
const upload = multer({ dest: "upload/" });
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cors());
// app.use(
//   fileUpload()
//   //{useTempFiles: true,}
// );
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.json({ msg: "Hello" });
});
app.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("1 ", req.file, req.body);
    // const file = req.files.file;
    // const filename = file.name;
    // console.log("2 ", filename);

    const link = await uploadFile(req.file);
    return res.status(200).json({ msg: link });
  } catch (error) {
    return res.status(500).json("Errorrr: ", error);
  }
});

app.listen(3000, () => {
  console.log("ANM on port 3000");
});
