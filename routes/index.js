var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
var mongo = require('mongoskin');

var db = mongo.db("mongodb://localhost:27017/tnbx_node",{native_parser:true});



/* GET company page. */
router.get('/', function(req, res) {
	db.bind('companies');
	db.companies.find({}).toArray(function(err, items) {
		res.render('company', {
			'title':'Companies',
			'companies':items
		});
	});
});

router.get('/auction-details', function(req, res) {
	db.bind('auctions');
	db.auctions.find({"auction_security_sno":req.query.auction_sno}).toArray(function(err, items) {
		res.render('auction-details', {
			'title':'auction-details',
			'auction-details':items,
		});
	});
	// res.send(JSON.stringify({status: "success", message: "Create Successfully", data: items}));
});

router.get('/security', function(req, res) {
	db.bind('securities');
	db.securities.find().toArray(function(err, items) {
		res.render('security', {
			'title':'Security',
			'securities':items
		});
	console.log(items);
	});
});

//-- create company --//

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

//-- create Security --//

router.post('/createSecurity', function(req, res) {
	var db = req.db;
	// Set our collection
	var security = { 
		company_sno		: 1,
		security_symbol	: req.body.security_symbol,
		security_type	: req.body.security_type,
	}

	db.collection('securities').insert(security, function (error, doc) {
		if(error){
			res.send("Could not insert new security.");
		}else{
			res.send(JSON.stringify({status: "success", message: "Create Successfully", data: security}));
		}
	});
});

//-- crete auction --//

router.post('/createAuction', function(req, res) {
	var db = req.db;
	// Set our collection
	var auctions = {
		auction_security_sno 				: 2,
		number_for_sale 					: req.body.number_for_sale,
		security_type 						: 10,
		road_show_start_date_time 			: req.body.road_show_start_date_time,
		auction_start_date_time 			: req.body.auction_start_date_time,
		auction_end_date_time 				: req.body.auction_end_date_time,
		cease_bid_cancellation_date_time 	 :req.body.cease_bid_cancellation_date_time,
		min_price 							: req.body.min_price,
		max_price 							: req.body.max_price, 
	}

	db.collection('auctions').insert(auctions, function (error, doc) {
		if(error){
			res.send("Could not insert new auctions.");
		}else{
			res.send(JSON.stringify({status: "success", message: "Create Successfully", data: auctions}));
		} 
	});
});

module.exports = router;
