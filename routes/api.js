var express = require('express');
var router = express.Router();

router.post('/createCompany', function(req, res) {
  // var db = req.db;
  // var company_name = req.body.company_name;
  // // Set our collection
  // db.collection('companys').insert({
  //   'companys' : company_name,
  // }, function (error, doc) {
  //   if (error) {
  //     res.send("Could not insert new company.");
  //   } else {
  //     res.location('/');
  //     res.redirect('/');
  //   }
  // });
  console.log('df');
});

module.exports = router;