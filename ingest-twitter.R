############################################################
# CSC791 P3: Function to ingest data from Twitter API
# Preetham, pmahish@ncsu.edu, Last updated: 4/4/2015
############################################################

# install.packages(twitteR)

# This requires R version of 3.1.1 or later

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
    created=c(created,i$created*1000)
    text=c(text,i$text)
    id=c(id,i$id)
  }
  
  data.frame(id=id,text=text,EvtTime=created)
}