var express = require('express');
var cors = require('cors');
const fs = require('fs');
var multer = require('multer'); // Middleware for handling multipart/form-data, used for file uploads
require('dotenv').config();

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Set up multer to handle file uploads
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // File name will remain the same as the original name
  },
});
var upload = multer({ storage: storage });

// Route for handling file uploads
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  try {
    res.json({
      "name": req.file.originalname,
      "type": req.file.mimetype,
      "size": req.file.size
    });
  } catch (err) {
    res.send(400);
  }
});

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
