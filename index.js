const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:27017";

const client = new MongoClient(url);
const dbName = 'student';

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : true}));

//Create Operation

async function create(roll,name,marks)
{
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('record');

    var count = await collection.findOne({roll_no : roll});
    if(count == null)
    {
        const insertres = await collection.insertOne({roll_no : roll, name : name, marks : marks});
        if(insertres['acknowledged'] == true)
            console.log("Data inserted successfully")
        else
            console.log("Some error occurred");
    }
    else
    {
        console.log("Data already exists");
    }
}

app.post('/create',function(req,res){
    var roll = req.body.roll;
    var name = req.body.name;
    var marks = req.body.marks;

    create(roll,name,marks)
        .catch(console.error)


    res.end();
})

app.post('/read',async (req,res)=>{
    var roll = req.body.roll;

    // read(roll)
    //     .then(function(result){
    //         console.log(result);
    //     })
    //     .catch(console.error);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('record');

    var data = await collection.find({roll_no : roll}).toArray();
    res.send(data[0]);
    res.end();
})

async function update(roll,obj)
{
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('record');

    const res = await collection.updateOne({roll_no : roll},{$set : obj});
    if(res['acknowledged'] == true)
    {
        console.log("Data updated successfully");
    }
    else
    {
        console.log("Some error occurred");
    }
}

app.post('/update',function(req,res){
    var roll = req.body.roll;
	var name = req.body.name;
	var marks = req.body.marks;

	var obj = {};
	
	if(typeof name != 'undefined')
		obj['name'] = name;
	if(typeof marks != 'undefined')
		obj['marks'] = marks;
    
    update(roll,obj)
        .catch(console.error);
    
    res.end();
    
})

async function del(roll)
{
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('record');

    const res = await collection.deleteOne({roll_no : roll});
    if(res['acknowledged'] == true)
        console.log("Data deleted successfully");
    else
        console.log("Some error occurred or data does not exist");
}

app.post('/delete',function(req,res){
    var roll = req.body.roll;

    del(roll)
        .catch(console.error)
    
    res.end();

})
app.listen(3000, function(err,res){
	if(err) throw err;
	else
	console.log(
		"Server running at port 3000."
	);
});