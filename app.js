var redisClient = require('redis').createClient;
var redis = redisClient(6379, "localhost");
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const r = require(' ');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

var connection = null;
r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
    
})

app.get('/getData', function(req,res) {
    var dbName = req.query.dbName;
    var table = req.query.tableName;
    if (!dbName)
        res.status(400).send("Please send a proper title");
    else {
        findDataCached(dbName, table, res, function(data) {
            if (!data)
                res.status(500).send("Server error");
            else
                res.status(200).send(data);
        });
    }
});

//getdata logic
function findDataCached(dbName , table, res){
    redis.get(table, function(err, reply) {
        if (err)
            res.send(null);
        else if (reply) //Book exists in cache
            res.send(JSON.parse(reply));
        else {	
            r.db(dbName).table(table).changes().run(connection,(err,cursor)=>{
                cursor.toArray((err,result) =>{
                    //Book found in database, save to cache and return to client
						redis.set(table, JSON.stringify(result), function() {
							res.send(result);
						}); 
                })
            })	
                
            }
            })
            };


var server = app.listen(3000,function(){
    console.log('listning on port 3000');
})
