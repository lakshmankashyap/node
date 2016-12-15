var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));


/* GET company page. */
router.get('/', function(req, res) {
    var db = req.db;
    // var collection = db.get('companies');
    console.log(db);
    // collection.find({},{},function(e,docs){
    //     res.render('company', {
    //         "title" :"company"
    //     });
    // });
});

// /* GET home page. */
// router.get('/', function(req, res) {
// 	res.render('company', { title: 'company' });
// });

router.get('/auction-details', function(req, res) {
	res.render('auction-details', { title: 'auction-details' });
});

router.get('/security', function(req, res) {
	res.render('security', { title: 'security' });
});

router.post('/createCompany', function(req, res) {
	var db = req.db;
	// var company_name = req.body.company_name;
	if (req.body.company_name == "") {
		return res.status = "unsucess.";
	}
	// Set our collection
	var company = { 
		company_sno		: 1,
		company_id		: "xyz",
		company_name	: req.body.company_name,
	}

	db.collection('companies').insert(company, function (error, doc) {
		if(error){
			res.send("Could not insert new company.");
		}else{
			res.send(JSON.stringify({status: "success", message: "Create Successfully", data: company}));
		}
	});
});

module.exports = router;
