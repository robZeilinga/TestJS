var express = require('express');
var router = express.Router();

var floorData = require('../public/javascripts/5_5.json');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('map', {title: 'Maps', data: floorData});
});

module.exports = router;


