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

//Initializing sketch.
//Import library
var createCountMinSketch = require("count-min-sketch");
var tranSketch = createCountMinSketch();

// Initializing variables for Journaling Pre-processing.

var inActiv = 3600000;
var prevEvtTime=0;
var transId = 0;

// Defining Curl Headers
presentTime = (new Date).getTime();
previousTime = presentTime  - 2592000000;

var skylrUrl = 'https://las-skylr-token.oscar.ncsu.edu/api/data/document/query';
var curlHeader = {
        'Content-Type': 'application/json',
        'AuthToken':'9c0c9a9e0ec177d2bf9fd55edff5272cb2a3b9823babf07d6f762e3f9c9509bb'
       };
var curlBody = {'type':'find',
      'query':{'data.UserId':'pjones',
              'data.ProjId':"journaling-chrome",
                'data.EvtTime':{"$gte":previousTime,
                                "$lte":presentTime}}
        };


// This function sorts and removes duplicates from each transaction.
   function purge(a) {
      return a.sort().filter(function(item, pos, ary) {
         return !pos || item != ary[pos - 1];
     })
 }

// Priority Queue with TopK implementation using Sketches
function compare(a,b) {
  if (tranSketch.query(a.url) > tranSketch.query(b.url))
     return -1;
  if (tranSketch.query(a.url) < tranSketch.query(b.url))
    return 1;
  return 0;
} 

var enq = function(arr, a) {
    var index = -1;
  for(i=0; i < arr.length; i++) {
     if( arr[i].url == a.url) {
   index = i;
   arr[i].count = a.count;
   break;
   }
  }
  if(index == -1) {
  arr.push(a);
  }
   arr.sort(compare); 
        if(arr.length > 8) {
        arr.pop();
         }
}

// Custom indexOf function.
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
     for(var k = 0; k < myArray[i].length; k++) {
        if (myArray[i][k][property] === searchTerm) {
      return i;}
      }
    }
    return -1;
}

var GenerateCandidate = function(array, setSize) {
var newArray=[];
for(i=0; i < array.length; i++){
        for(j=i+1; j < array.length; j++) {
                var arry1 = array[i];
                var arry2 = array[j];
                var flag=1;
                for(k=0; k < setSize-1; k++){
                        if(arry1[k].url != arry2[k].url) {
                        flag=0;
                        }
                if(flag) {
                var newarry1 = arry1.slice();
                newarry1.push(arry2[setSize-1]);
                newArray.push(newarry1);
                }       
                }
        }
 }
 return newArray;
}

 
var sets = function(input, size){
    var results = [], result, mask, total = Math.pow(2, input.length);
    for(mask = 0; mask < total; mask++){
        result = [];
        i = input.length - 1;
        do{
            if( (mask & (1 << i)) !== 0){
                result.push(input[i].url);
            }
        }while(i--);
        if( result.length >= size){
            results.push(result);
        }
    }
    results.pop();
    return results;
};



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
        console.log(str); //redirecting stdout of R to console..
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
          // var _fileName = 'file://' + process.cwd() + '/public/images/HoltWinters_' + data.username.toString() + '.png';
          var _fileName = '/images/HoltWinters_' + data.username.toString() + '.png';
          console.log("Filename: " + _fileName);
          var Arules_Graph = '/images/Arules-Graph.png?xxx=' + data.username.toString();
          var Support_Confidence = '/images/Support-Confidence.png?xxx=' + data.username.toString();
          socket.emit('UserDataResponse', {FilePath : _fileName});
          socket.emit('ArulesGraphResponse', {FilePath : Arules_Graph});
          socket.emit('SupportConfidenceResponse', {FilePath : Support_Confidence});
          
        }
      });

    });
    

//for fetcing the assignment data event handler..
socket.on('GetAssignmentData', function(data){
      console.log('request received from client: ' + data.assignment.toString());

      //call the rscript for this user..
      process.env.UNITYID = "ALL";
      process.env.ASSIGNMENT = data.assignment.toString();
      RscriptName = "main.R";
      pathOfR = process.cwd() + '/../journaling_analytics/' + RscriptName;

console.log("data.assignment : " + data.assignment.toString());

      var RCall = ['--no-restore', '--no-save', pathOfR];
      var R = spawn('Rscript', RCall);  //opts.env
      R.stdout.on('data', function(data){
        var str  = data.toString();
        console.log(str); //redirecting stdout of R to console..
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
          // var _fileName = 'file://' + process.cwd() + '/public/images/HoltWinters_' + data.username.toString() + '.png';
          var _fileName = '/images/HoltWinters_' + data.assignment.toString() + '.png';
          var Arules_Graph = '/images/Arules-Graph.png?xxx=' + data.assignment.toString();
          var Support_Confidence = '/images/Support-Confidence.png?xxx=' + data.assignment.toString();
          console.log("Filename: " + _fileName);
          socket.emit('UserAssignmentResponse', {FilePath : _fileName});
          socket.emit('ArulesGraphResponse', {FilePath : Arules_Graph});
          socket.emit('SupportConfidenceResponse', {FilePath : Support_Confidence});
          console.log("Completed a socket emit call for user data response..");
        }
      });

    });


 //on completion of top-k analysis, emmit the results to the output..
    setInterval(function(){
      request.post({
      url: skylrUrl, //URL to hit
      body: curlBody,
      headers: curlHeader,
      json : true}, function(error, response, body){
      if(error) {
        console.log(error);
      } 
      else {
        // journArray is a List which contains Transaction objects(var urlList)
        var journArray = [];
        // urlList corresponds to one transaction which stores URL's(array of strings) 
        var urlList = [];
        for(var i = 0; i < body.data.length; i++) {
          var WebURL = body.data[i].data.WebURL;
          var EvtTime = body.data[i].data.EvtTime;
          // We club all the web URL's into one transaction if there is no 
          // inactivity duration greater than inActiv, else we start a new 
          // transactionId. 
          // If there is no activity for a period of inActiv duration, 
          // we create a new transaction.
          if(EvtTime - prevEvtTime > inActiv) {
          transId=transId+1;
          // Remove duplicates and sort each transaction URL's
          urlList = purge(urlList);
          journArray.push({url: urlList});
          // assigning new instance
          urlList=[];
          }
          urlList.push(WebURL);
          prevEvtTime = EvtTime;
        }
        // Creating priority Queue
        var topK = [];
        // Creating 1-itemset Sketch
        for(i=0; i < journArray.length; i++) {
          for(j=0; j < journArray[i].url.length; j++){
          tranSketch.update(journArray[i].url[j], 1);
          enq(topK, {url: journArray[i].url[j], count: tranSketch.query(journArray[i].url[j])});
          }
        } 

        socket.emit('ShowTopK', {  url1 : topK[0].url , count1 : topK[0].count,
                 url2 : topK[1].url , count2 : topK[1].count,
                 url3 : topK[2].url , count3 : topK[2].count,
                 url4 : topK[3].url , count4 : topK[3].count,
                 url5 : topK[4].url , count5 : topK[4].count});


   console.log("^^^^^^^^^^^^^^^^^^^^^^^^*" + topK[0].url );
   console.log("***************************" + topK[1].url );
   console.log("***************************" + topK[2].url );
   console.log("***************************" + topK[3].url );
   console.log("***************************" + topK[4].url );
   console.log("^^^^^^^^^^^^^^^^^^^^^^^^*" + topK[0].count );
   console.log("***************************" + topK[1].count );
   console.log("***************************" + topK[2].count );
   console.log("***************************" + topK[3].count);
   console.log("***************************" + topK[4].count);



        // Creating 2-itemset TopK
        var topK2 = [];            
        for( i=0; i< topK.length; i++)
        {
          for(j=i+1; j<topK.length; j++)
          {
          var set = [topK[i],topK[j]];
          topK2.push(set);
          }
        }

        // Create 3-itemset topK
        var pruned = [];
        var cand = GenerateCandidate(topK2,2);
        var flag = 0;
        for(k=0;k<cand.length;k++) {
          for(item=0; item < cand[k].length; item++) {
          for(i=0; i<journArray.length; i++){
            for(j=0; j<journArray[i].url.length; j++) {
            if(journArray[i].url[j] != cand[k][item].url){
              flag = 1;
            }
            }
          }
          if(flag) {
            cand.splice( k, 1 );
            flag=0;
          }
          }
        }
      }
    }); 

  }, 60000);   //refreshing every 10 minutes..600000
  //+Math.round(500*Math.random())    

//Handle Disconnect
    socket.on('disconnect', function() {
        console.log('Dashboard client disconnected');
    });
});
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
