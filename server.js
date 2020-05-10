// server.js

let express = require('express');
let app = express();
let bodyparser = require('body-parser');
let mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/", 
{useNewUrlParser : true, useUnifiedTopology : true});

// config. app to use body parser
app.use(bodyparser.urlencoded({ extended : true }));
app.use(bodyparser.json());
app.use(express.json());

// Create the schema we will use for our database
var Schema = mongoose.Schema;
let ItemSchema = new Schema({
    name : String,
    cost : Number
});

let Item = mongoose.model('Item', ItemSchema);

let db = mongoose.connection;
// Check for connection error events by binding connection
db.on('error', console.error.bind(console, "MongoDB connection error: "));

// Pick the port to listen on
let port = process.env.port || 8080;
console.log("Server begginning");
// Creates a router
/*
var router = express.Router();

router.get('/', ( req, res ) => {
    res.json({ message: 'Your server works dude! '});
});

// Where to add routes
app.use('/api', router);
*/
app.get('/', (req, res) => {
    res.json( {message : "New server!!!"} );
});

app.get('/home', function ( req, res ){
    res.json({home : "You are home!"});
});

app.get('/items', function(req, res){
    // Create a promise
    console.log("Get to GET items");
    Item.find(function(error, items){
        if(error){
            console.log("Error");
        }
        else{
            //console.log("Sending items: " + items.toString());
            res.json(JSON.stringify(items));
        }
    });
});

app.post('/item', (req, res) => {
    console.log("Got to POST items. Name: " + req.body.name + " Cost: " + req.body.cost);
    // Create a new model
    let newItem = new Item({
            name : req.body.name,
            cost : req.body.cost
    });
    console.log(newItem.toString());
    newItem.save(function(error){
        if(error === null){
            res.send("Save successfull");
        }
        else{
            res.json(JSON.stringify("Error: " + error));
        }
    });
});

app.post('/', (req, res) => {
    let item = new Item();
    item.name = req.body.name;
    item.cost = req.body.cost;
    item.save(function(error){
        if(error){
            res.send(error);
        }
        res.json({ message: 'Item received'});
    });
});

app.put('/item', (req, res) => {
    let updateID = req.body.name;
    Item.updateOne({name : updateID}, {cost : req.body.cost}, function(error){
        if(error){
            if(error){
                res.json({ Error : 'Could not find and update item'});
            }
            else{
                res.json( {Sucess: "Item found and updated"});
            }
        }
    });
});


// Start the server
app.listen(port);
console.log('Server listening on port ' + port);




