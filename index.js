const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cors());
app.use(
  fileUpload()
  //{useTempFiles: true,}
);
app.use(morgan("combined"));

app.post("/", (req, res) => {
  console.log(req.files);
  const file = req.files.file;
  const filename = file.name;
  console.log(filename);
  file.mv("./upload/" + filename, (err) => {
    if (err) res.send(err);
    else res.send("success");
  });
});

app.listen(3000, () => {
  console.log("ANM on port 3000");
});
