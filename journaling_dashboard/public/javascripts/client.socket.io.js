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


function ClickFun(){
	alert("button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...button clicked...");
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
