var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var request = require('request');
//for calling R script from node.js server..
var http = require('http');
var spawn = require('child_process').spawn;
// var hashmap = require('hashmap');
//for priority queue implementation..
var PriorityQueue = require('priorityqueuejs');

/*Calling R code from node.js*/
//Begin Section
/**/
var env = process.env;
var opts = {cwd: process.cwd(), // + '/public/rscripts', 
            env: process.env
            };

// opts.env['YEAR']=1987; 
// opts.env['NAME']='@NitinTak';




/*
console.log("Nitin's opts: " + opts.cwd + ', ' + opts.env['YEAR']);

var RCall = ['--no-restore', '--no-save', opts.cwd + '/hello.R'];
console.log("**********opts : " + opts);
//console.log("this is the call to RCAll : ..." + RCall);
var R = spawn('Rscript', RCall, opts.env);

R.stdout.on('data', function(data){
  var str  = data.toString();
  console.log("NT_inside the stdout.on function.." + str);
});
//calld before close call..
R.on('exit', function(code){
    console.log('got exit code: '+code)
    if(code==1){
        // do something special
        // done()
    }else{
        // done()
    }
    return null;
});
//called after exit call
R.on('close', function(code){
  console.log("process code on call to 'close': " + code);  //code 0 for success....
});
*/


/*calling R code and displaying content on client..*/
//Begin Section
//http://leapon.tumblr.com/post/10168944986/run-r-script-and-display-graph-using-node-js
var exec = require('child_process').exec;
// var server = express(); //.createServer();
// server.configure(function(){    
//     server.use(express.static(__dirname + '/public/rscripts'));
// });
/*
app.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('R graph<br>');
    process.env.R_WEB_DIR = process.cwd() + '/public/rscripts';
    var child = exec('Rscript ./public/rscripts/graph.R', function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        res.write('<img src='+process.cwd() +"/public/rscripts/xyplot.png" + '/>');
        // res.write('<img src="/xyplot.png"/>');
        res.end('<br>end of R script');
    });
});
app.listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');
*/
//End Section


//logic for top-k over URL's using count-min-sketch and priority Queue..
//Begin Section
/*
var createCountMinSketch = require("count-min-sketch");
var sketch = createCountMinSketch();
var URLs = ['A','B','C','A'];
var smallGrp = [];
smallGrp.push(URLs[2]);
smallGrp.push(URLs[1]);
smallGrp.push(URLs[0]);

console.log(smallGrp);
smallGrp.sort();
console.log("after sorting: " + smallGrp);

console.log("updating a count min sketch..");
for(var i=0; i<URLs.length ; i++)
{
  console.log("URL: " + URLs[i].toString());
  sketch.update(URLs[i].toString(), 1);
}
console.log("querying sketch for A : " + sketch.query('A'));
console.log("querying sketch for B : " + sketch.query('B'));
console.log("querying sketch for C : " + sketch.query('C'));
console.log("querying sketch for D : " + sketch.query('D'));
var queue = new PriorityQueue();

*/
/*Algorithm...
1. decide on the maxumum size of priority Queue
MAX_Q_SIZE to contain number of elements..
2. Check the count of the element in sketch.
3. loop into the priority Q and check if the element 
is present, if present then update the element in priority Q.


*/


//End Section..


/*Call to journialing service..*/
//Begin Section..
/*
request({
    url: 'https://las-skylr-token.oscar.ncsu.edu/api/data/document/query', //URL to hit
    method: 'POST',
    body: {
'type':'find',
  'query':{'data.UserId':'pjones',
            'data.ProjId':"journaling-chrome",
              'data.EvtTime':{"$gte":1423717200000,
                              "$lte":1424303540000}}
    },
    headers:
    {
    'Content-Type': 'application/json', 
    'AuthToken':'9c0c9a9e0ec177d2bf9fd55edff5272cb2a3b9823babf07d6f762e3f9c9509bb'
    },
    json : true
}, function(error, response, body){
  console.log("nitinnnnnnnnnn is awesome...");
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
}
});
*/
//End Section..


/*Journaling Dashboard...*/
//Begin Section..
var server = require( 'http' ).createServer(app);
var port = 3000;
server.listen(port);
console.log("Dashboard server listening at http://127.0.0.1: "+port);

//create WebSockets - server object and attach to http server
var sio = require( 'socket.io' ).listen(server);
sio.sockets.on('connection', function(socket){
    console.log('Dashboard client connected...');
    
//for sending events to dashboard client...
// socket.volatile.emit
    socket.emit('startup', {json : 'sample'});

    socket.emit('request', {json : 'sample'});
    socket.on('GetUserData', function(data){
      console.log('request received from client: ' + data.username.toString());

      //call the rscript for this user..
      process.env.UNITYID = data.username.toString();
      process.env.ASSIGNMENT = "ALL";
      RscriptName = "main.R";
      pathOfR = process.cwd() + '/../journaling_analytics/' + RscriptName;

console.log("data.username : " + data.username.toString());
console.log("pathOfR : " + pathOfR);


      var RCall = ['--no-restore', '--no-save', pathOfR];
      var R = spawn('Rscript', RCall);  //opts.env
      R.stdout.on('data', function(data){
        var str  = data.toString();
        console.log("NT_inside the stdout.on function.." + str);
      });
      //calld before close call..
      R.on('exit', function(code){
          console.log('got exit code: '+code)
          if(code==1){
              // do something special
              // done()
          }else{
              // done()
          }
          return null;
      });
      //called after exit call
      R.on('close', function(code){
        console.log("process code on call to 'close': " + code);  //code 0 for success....
        if(code == 0)
        {
          console.log("inside code 0..");
          var _fileName = process.cwd() + '/public/images/HoltWinters_' + data.username.toString() + '.png';
          console.log("Filename: " + _fileName);
          socket.emit('UserDataResponse', {FilePath : _fileName});
          console.log("Completed a socket emit call for user data response..");
        }
      });

    });
    
// On receiving events from dashboard client..
    socket.on('GetData', function(data) {
      console.log('Message from Dashboard client..');
    });

//Handle Disconnect
    socket.on('disconnect', function() {
        console.log('Dashboard client disconnected');
    });
});
//End Section..




/*For TWitter..*/
//Begin Section..lllllllllllllllllllllllll
//start a server
// var server = require( 'http' ).createServer(app);
// var port = 3000;
// server.listen(port);
// console.log("Socket.io server listening at http://127.0.0.1: "+port);
//End Section

/*Twitter stream analysis..
//Begin Section..
// //variable to maintain twitter stats
// var totalTweets = 0;
// var loveTweets = 0;
// var hateTweets = 0;
// var tweetType = "default";

//create WebSockets - server object and attach to http server
var sio = require( 'socket.io' ).listen(server);
sio.sockets.on('connection', function(socket){
    console.log('Web client connected');
    
    mytweets.stream('statuses/filter',{'track':'love, hate'}, function(stream) {
        stream.on('data', function (data) {
             totalTweets++;
	     //Check if the tweet has both love and hate in it
             if((data.text.toLowerCase().search('love') !== -1) && (data.text.toLowerCase().search('hate') !== -1)) {
                 loveTweets++; hateTweets++;
		 tweetType = "both";
	     } else if(data.text.toLowerCase().search('love') !== -1) {
                 //Tweet has only 'love'
		 loveTweets++;
		 tweetType = "love";
	     } else if(data.text.toLowerCase().search('hate') !== -1) {
                 //Tweet has only 'hate'
		 hateTweets++;
		 tweetType = 'hate';
	     }
	     // console.log(tweetType + " --> " + data.user.screen_name + ": " + data.text);
	     //emit in JSON format to client
	     socket.volatile.emit('ss-tweet', {
  	           name: data.user.screen_name,
                   tweet: data.text,
                   actualTweets: totalTweets,
              	   loveTweets: loveTweets,
		   hateTweets: hateTweets,
		   lovePercent: Math.round(loveTweets / (loveTweets + hateTweets) * 100),
		   hatePercent: Math.round(hateTweets / (loveTweets + hateTweets) * 100),
		   tweetType: tweetType
             });
	    
        });
    });

    //Handle Disconnect
    socket.on('disconnect', function() {
        console.log('Web client disconnected');
    });
});
*/
//End Section..


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
