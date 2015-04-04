############################################################
# CSC791 P3: Function to ingest data from Twitter API
# Preetham, preems@ncsu.edu, Last updated: 4/4/2015
############################################################

# install.packages(twitteR)

# TO DO: problem - this doesn't work with R v3.0.2 (latest R-base for Ubuntu)
# Depends on rjson package, which isn't available.

library(twitteR)

ingest_twitter = function(username,count) {

  #Enter your twitter credentails here
  # 1. Consumer key
  # 2. Consumer secret
  # 3. Access Token
  # 4. Access Secret
  setup_twitter_oauth("","",access_token="",access_secret="")
  tweets=userTimeline(getUser(username),n=count)
  
  #Extract data and convert list of list to Data.frame
  created=vector()
  text=vector()
  id=vector()
  for (i in tweets) {
    created=c(created,i$created)
    text=c(text,i$text)
    id=c(id,i$id)
  }
  
  data.frame(id=id,text=text,created=created)
}