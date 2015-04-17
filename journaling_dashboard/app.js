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

//start a server
var server = require( 'http' ).createServer(app);
var port = 3000;
server.listen(port);
console.log("Socket.io server listening at http://127.0.0.1: "+port);

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
	     console.log(tweetType + " --> " + data.user.screen_name + ": " + data.text);
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
