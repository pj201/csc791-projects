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


