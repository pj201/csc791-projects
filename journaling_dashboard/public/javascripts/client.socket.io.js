var server_name = "http://127.0.0.1:3000/";
var server = io.connect(server_name);
var msgElement = document.getElementById('ss-stats');
var tabSpaces = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";


console.log('Client: Connecting to server '+server_name);
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

function UserChanged(){
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
