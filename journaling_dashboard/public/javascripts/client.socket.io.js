var server_name = "http://127.0.0.1:3000/";
var server = io.connect(server_name);
var msgElement = document.getElementById('ss-stats');
var tabSpaces = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

console.log('Client: Connecting to server '+server_name);

server.on('startup', function(data) {
	// document.getElementById("nitin").innerHTML = "Event received from server with data : " + data;
});

server.on('request', function(data){
	// document.getElementById("nitin").innerHTML = "This was after the button click Event.." + data;
});

server.on('UserDataResponse', function(data){
	console.log("Reading file from path : " + data.FilePath.toString());
	document.getElementById("img_user").src = data.FilePath.toString();
});

server.on('UserAssignmentResponse', function(data){
	console.log("Reading file from path : " + data.FilePath.toString());
	document.getElementById("img_assignment").src = data.FilePath.toString();
});

server.on('ArulesGraphResponse', function(data){
	console.log("Reading file from path : " + data.FilePath.toString());
	document.getElementById("img_top_association").src = data.FilePath.toString();
});

server.on('SupportConfidenceResponse', function(data){
	console.log("Reading file from path : " + data.FilePath.toString());
	document.getElementById("img_sup_conf").src = data.FilePath.toString();
});

server.on('ShowTopK', function(data){
	console.log("data available for top k..");
	document.getElementById("div_url1").innerHTML = data.url1;
	document.getElementById("div_url2").innerHTML = data.url2;
	document.getElementById("div_url3").innerHTML = data.url3;
	document.getElementById("div_url4").innerHTML = data.url4;
	document.getElementById("div_url5").innerHTML = data.url5;
	document.getElementById("div_count1").innerHTML = data.count1;
	document.getElementById("div_count2").innerHTML = data.count2;
	document.getElementById("div_count3").innerHTML = data.count3;
	document.getElementById("div_count4").innerHTML = data.count4;
	document.getElementById("div_count5").innerHTML = data.count5;

	var HeavyHitterURL= document.getElementById("liHeavyHitterURL");
	var HeavyHitterCount= document.getElementById("liHeavyHitterCount");

	// HeavyHitterURL.prepend('<li>' + data.url5 + '<li>');
	// HeavyHitterCount.prepend('<li>' + data.count5 + '<li>');
	// HeavyHitterURL.prepend('<li>' + data.url4 + '<li>');
	// HeavyHitterCount.prepend('<li>' + data.count4 + '<li>');
	// HeavyHitterURL.prepend('<li>' + data.url3 + '<li>');
	// HeavyHitterCount.prepend('<li>' + data.count3 + '<li>');
	// HeavyHitterURL.prepend('<li>' + data.url2 + '<li>');
	// HeavyHitterCount.prepend('<li>' + data.count2 + '<li>');
	// HeavyHitterURL.prepend('<li>' + data.url1 + '<li>');
	// HeavyHitterCount.prepend('<li>' + data.count1 + '<li>');

	//         HeavyHitterCount.children('li').slice(4).remove();

});


server.on('ShowHeavyHitters', function(data){
	console.log("data available for Heavy Hitters...");
	console.log(data.toString());
	console.log(data.g1url1.toString());
	document.getElementById("div1URL1").innerHTML = data.g1url1;
	document.getElementById("div1URL2").innerHTML = data.g1url2;
	document.getElementById("div1URL3").innerHTML = data.g1url3;
	document.getElementById("div2URL1").innerHTML = data.g2url1;
	document.getElementById("div2URL2").innerHTML = data.g2url2;
	document.getElementById("div2URL3").innerHTML = data.g2url3;
	document.getElementById("div3URL1").innerHTML = data.g3url1;
	document.getElementById("div3URL2").innerHTML = data.g3url2;
	document.getElementById("div3URL3").innerHTML = data.g3url3;
	
	document.getElementById("div1count1").innerHTML = data.g1count1;
	document.getElementById("div1count2").innerHTML = data.g1count2;
	document.getElementById("div1count3").innerHTML = data.g1count3;
	document.getElementById("div2count1").innerHTML = data.g2count1;
	document.getElementById("div2count2").innerHTML = data.g2count2;
	document.getElementById("div2count3").innerHTML = data.g2count3;
	document.getElementById("div3count1").innerHTML = data.g3count1;
	document.getElementById("div3count2").innerHTML = data.g3count2;
	document.getElementById("div3count3").innerHTML = data.g3count3;

});


function ClickFun(){
	alert("Welcome to the Journaling Situational Awareness Dashboard, developed by Paul Jones, Dakota Medd, Kshitij Sharma and Nitin Tak for the CSC591/791 Advanced Algorithms class Capstone Project!\n\nYou should be seeing five display areas containing the following near real-time displays: (1) [top] Top-5 heavy hitting URLs submitted over the past week - the list updates dynamically (via Socket.IO) and is derived from a Count-Min Sketch in Javascript, (2) [middle left] Time series plot of activity for a given user (make a selection via the drop-down list) or for ALL users; it also includes a Holt-Winters Activity prediction for the next 10 hours, (3) [middle right] Time series plot of activity for a given assignment (or for ALL assignments), and a corresponding HW prediction for the next 10 hours, (4) [bottom left] Support-Confidence plot derived from APRIORI association rules for a given user or assignment, (5) [bottom right] Graphical illustration of the top 3 rules found for each user or assignment - the size of intermediate circles represents the Support (bigger means higher Support); the color represents the Lift or relevance (darker means higher Lift).\n\nTo see some illustrative cases, try Users 'pjones' (well-behaved), 'drmedd' (semi-degenerate), and 'shsu3' (degenerate). Also try 'Project 3' for a nice illustration of a time series for a specific assignment. Note that the graphical displays can take a few seconds to update depending on server and connection speeds.\n\nRefer to the project report for full details.");
      document.getElementById("csv_student").innerHTML = "This is spaceholder for CSV file..";
      // csvFunction();
      var _username = document.getElementById("selectionUser").value;
      var _assignment = document.getElementById("selectionAssignment").value;
      console.log("username: " + _username + ", Assignment : " + _assignment);
      document.getElementById("selectionUser").value;
      server.emit('request', {username: _username, assignment: _assignment});

}


function UserChanged(){

/*  
      //for updating the image files..
      var dirName = document.getElementById("selectionUser").value;
      document.getElementById("nitin").innerHTML = dirName;
      var chartPath = "/public/images/users/" + dirName + "/1.png";
      <!-- alert("selection changed for file path : ..." + chartPath);<!-- document.getElementById("") --> -->
      document.getElementById("img_user").src = chartPath;
      <!--      document.getElementById("img_user").background-image = chartPath;
      -->
      //for updating the csv files..
      <!-- alert("calling for csv section.." + document.getElementById("csv_student").innerHTML);
      <!-- document.getElementById("csv_student").CSVToTable("student.csv"); -->
*/

}



function GetUserData(){
      //for updating the image files..
      var UserName = document.getElementById("selectionUser").value;
      // document.getElementById("nitin").innerHTML = UserName;
//      var chartPath = "/public/images/users/" + dirName + "/1.png";
      // document.getElementById("img_user").src = chartPath;
      
      //send an event to server to execute the rscript to fetch data..
      console.log("call received for get user data...passing call to server..");
      server.emit('GetUserData', {username: UserName});

      // <!-- alert("calling for csv section.." + document.getElementById("csv_student").innerHTML);
      // <!-- document.getElementById("csv_student").CSVToTable("student.csv"); -->
}


function AssignmentChanged(){
	/*
      var dirName = document.getElementById("selectionAssignment").value;
      document.getElementById("nitin").innerHTML = dirName;
      var chartPath = "assignments/" + dirName + "/1.png";
      <!-- alert("selection changed for file path : ..." + chartPath);<!-- document.getElementById("") --> -->
      document.getElementById("img_assignment").src = chartPath;
      //for updating the csv files..
      <!-- document.getElementById("csv_student").csvToTable("data.csv"); -->
*/

}

function GetAssignmentData(){
      var Assignment = document.getElementById("selectionAssignment").value;
      // document.getElementById("nitin").innerHTML = dirName;
      // var chartPath = "assignments/" + dirName + "/1.png";
      // document.getElementById("img_assignment").src = chartPath;
// Arules-Graph.png
//Support-Confidence.png
      //send an event to server to exec rscript for particular assignment..
      server.emit('GetAssignmentData', {assignment: Assignment});

}

function csvFunction () {
	alert("into jquery function for csv,,,");
	$('#csv_student').CSVToTable('student.csv');
}



/*
function UserChanged(){
      //for updating the image files..
      var dirName = document.getElementById("selectionUser").value;
      document.getElementById("nitin").innerHTML = dirName;
      var chartPath = "users/" + dirName + "/1.png";
      <!-- alert("selection changed for file path : ..." + chartPath);<!-- document.getElementById("") --> -->
      document.getElementById("img_user").src = chartPath;
      <!--      document.getElementById("img_user").background-image = chartPath;
      -->
      //for updating the csv files..
      <!-- alert("calling for csv section.." + document.getElementById("csv_student").innerHTML);
      <!-- document.getElementById("csv_student").CSVToTable("student.csv"); -->
      }
      function AssignmentChanged(){
      var dirName = document.getElementById("selectionAssignment").value;
      document.getElementById("nitin").innerHTML = dirName;
      var chartPath = "assignments/" + dirName + "/1.png";
      <!-- alert("selection changed for file path : ..." + chartPath);<!-- document.getElementById("") --> -->
      document.getElementById("img_assignment").src = chartPath;
      //for updating the csv files..
      <!-- document.getElementById("csv_student").csvToTable("data.csv"); -->
      }
      function ClickFun(){
      document.getElementById("csv_student").innerHTML = "This is spaceholder for CSV file..";
      csvFunction();
      }
    </script>
    <script>
      function csvFunction () {
      alert("into jquery function for csv,,,");
      $('#csv_student').CSVToTable('student.csv');
      }
*/


/*for twitter..
$(function() {
    var hateList = $('#ss-hate');  //Displays hateTweets
    var loveList = $('#ss-love');  //Displays loveTweets
    var loveCount = 0, hateCount = 0;    


    server.on('ss-tweet', function(data) {
        
	//if both, display in both columns
	if(data.tweetType === 'both') {
	    loveCount++; hateCount++;
            loveList.prepend('<li>' + data.name+': ' + data.tweet + '</li>');
            hateList.prepend('<li>' + data.name+': ' + data.tweet + '</li>');
	    if(loveCount > 10) {
		loveCount--;
	        loveList.children('li').slice(11).remove();
            }
            if(hateCount > 10) { 
		hateCount--;
		hateList.children('li').slice(11).remove();
            }
        } else if(data.tweetType === 'love') {
	    loveCount++;
            loveList.prepend('<li>' + data.name+': ' + data.tweet + '</li>');
	    if(loveCount > 10) {
		loveCount--;
	        loveList.children('li').slice(11).remove();
            }
        } else {
	    hateCount++;
	    hateList.prepend('<li>' + data.name+': ' + data.tweet + '</li>');
	    if(hateCount > 10) { 
		hateCount--;
		hateList.children('li').slice(11).remove();
            }
        }
	
	//Display the statistics about the tweets
        msgElement.innerHTML = "Love Count = " + data.loveTweets + tabSpaces + "Hate Count = " +data.hateTweets + "<br> "
			  + "Love Percent = " + data.lovePercent + "%" + tabSpaces + "Hate Percent= " +data.hatePercent + "%<br><br>"
			  + "Total Tweets = " + data.actualTweets; 
    });
});
*/
