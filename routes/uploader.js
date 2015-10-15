var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('upload', { title: 'MOSS'/*: Massive Online SpreadSheets' */});
});

router.post('/', function(req, res, next) {
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log(fieldname + filename);
      res.render('upload', { success: true, message: 'upload successful'});
  });
});

module.exports = router;
