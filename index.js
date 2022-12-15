const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongo = require('mongodb').MongoClient;

url = "mongodb://127.0.0.1:27017";

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : true}));

//Create Operation

app.post('/create', (req,res) => {
	var roll = req.body.roll;
	var name = req.body.name;
	var marks = req.body.marks;

	mongo.connect(url, function(err,db){
		if(err) throw err;
		var obj = {roll_no : roll, name : name, marks : marks};
		var dbo = db.db('student');
		var obj_1 = {roll_no : roll};
		dbo.collection('st1').findOne(obj_1, function(err, result){
			// console.log(result);
			if(result == null)
			{
				if(dbo.collection('st1').insert(obj))
				{
					console.log('Data inserted successfully !!');
				}
				db.close();
			}
			else
			{
				console.log("Data with the roll number already exists.");
			}
		})
	});
	
		
	res.end();
});

//Read Operation

app.post('/read', (req,res) => {
	var roll = req.body.roll;
	
	mongo.connect(url, function(err,db){
		if(err) throw err;
		var obj = {roll_no : roll};
		var dbo = db.db('student');
		dbo.collection('st1').findOne(obj, function(err,result){
			if(err) throw err;
			else
			console.log(result);
		});

});


res.end();

});

//Update Operation

app.post('/update', (req,res) => {
	var roll = req.body.roll;
	var name = req.body.name;
	var marks = req.body.marks;

	var obj = {};
	
	if(typeof name != 'undefined')
		obj['name'] = name;
	if(typeof marks != 'undefined')
		obj['marks'] = marks;
	para_obj = {roll_no : roll};
	var newobj = {$set : obj}

	mongo.connect(url, function(err,db){
		if(err) throw err;
		var dbo = db.db('student');
		if(dbo.collection('st1').update(para_obj, newobj))
		{
			console.log('Data updated successfully !!');
		}
		db.close();
	});
	
	res.end();
	


});

//Delete operation

app.post('/delete', (req,res) => {
	var roll = req.body.roll;

	mongo.connect(url, function(err,db){
		if(err) throw err;
		var obj = {roll_no : roll};
		var dbo = db.db('student');
		if(dbo.collection('st1').remove(obj))
		{
			console.log('Data deleted successfully !!');
		}
		db.close();
	});
	
	res.end();
});

app.listen(3000, function(err,res){
	if(err) throw err;
	else
	console.log(
		"Server running at port 3000."
	);
});
