var express = require('express'),
app = express(),
server = require('http').createServer(app),
users = {},
db='Demo',
table = 'user_data';
io = require('socket.io').listen(server);
var bodyParser = require('body-parser');

server.listen(5000,() => {
  console.log('Server is running on port 5000')
  });

app.get('/data', function(req, res){
  
var r = require('rethinkdbdash');
io.sockets.on('connection', function(socket){
  r.db(db).table(table)
  .pluck('name')
  .changes()
  .run()
  .then(function(feed){
    feed.each(function(err, item){
      console.log(JSON.stringify(item, null, 1));
      io.emit('new message', item.new_val.name);
    })
  })
})

});


