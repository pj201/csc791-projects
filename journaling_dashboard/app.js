var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//Connect to twitter and open stream
var Twit = require('ntwitter');
var request = require('request');

//https://contourline.wordpress.com/2013/10/08/700/

//for calling R script from node.js server..
var http = require('http');
var spawn = require('child_process').spawn;
var env = process.env;

var opts = {cwd: process.cwd() + '/public/rscripts', 
            env: process.env
            };
console.log("Awesome Nitin's opts: " + opts.cwd + ', ' + opts.env);

opts.env['YEAR']=1987; 
opts.env['NAME']='@NitinTak';
var RCall = ['--no-restore', '--no-save', opts.cwd + '/hello.R'];
console.log("this is the call to RCAll : ..." + RCall);
var R = spawn('Rscript', RCall, opts);
R.stdout.on('data', function(data){
  var str  = data.toString();
  console.log("NT_inside the stdout.on function.." + str);
});
R.on('close', function(code){
  console.log("process exit code: " + code);
})

//http://leapon.tumblr.com/post/10168944986/run-r-script-and-display-graph-using-node-js

var express = require('express');
var exec = require('child_process').exec;
var server = express(); //.createServer();
// server.configure(function(){    
//     server.use(express.static(__dirname + '/public/rscripts'));
// });
server.get('/', function(req, res) {
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
server.listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');



/*
function setup_R_job(opts,done){
 
    var R  = spawn('Rscript', RCall, opts)
    R.on('exit',function(code){
        console.log('got exit code: '+code)
        if(code==1){
            // do something special
            done()
        }else{
            done()
        }
        return null
    })
    return null
}
*/



// server.configure(function(){    
//     server.use(express.static(__dirname + '/public'));
// });
/*
server.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('R execution..<br>');
    process.env.R_WEB_DIR = process.cwd() + '/public/rscripts';
    console.log("Awesome Nitin's working directory: "+process.cwd());
    var child = exec('Rscript script/hello.R', function(error, stdout, stderr) {
        console.log('stdout:' + stdout);
        console.log('stderr:' + stderr);
        if (error !== null) {
            console.log('exec error:' + error);
        }
        // res.write('<img src=”/xyplot.png"/>’);
        res.end('<br>end of R script');
    });
});
// server.listen(1337, “127.0.0.1”);
// console.log('Server running at http://127.0.0.1:1337/’);
*/



//Initialize variables to connect to twitter
var twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
var twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
var twitterAccessKey = process.env.TWITTER_ACCESS_TOKEN;
var twitterAccessSecret = process.env.TWITTER_ACCESS_SECRET;

var mytweets = new Twit({
    consumer_key: twitterConsumerKey,
    consumer_secret: twitterConsumerSecret,
    access_token_key: twitterAccessKey,
    access_token_secret: twitterAccessSecret
});

mytweets.verifyCredentials(function(err,data){
    if(err){
        console.log('Error in authenticating twitter access keys:..');
        console.dir(err);
        process.exit(1);    //for graceful failure
    }
});




//start a server
var server = require( 'http' ).createServer(app);
var port = 3000;
server.listen(port);
console.log("Socket.io server listening at http://127.0.0.1: "+port);


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



//variable to maintain twitter stats
var totalTweets = 0;
var loveTweets = 0;
var hateTweets = 0;
var tweetType = "default";

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
