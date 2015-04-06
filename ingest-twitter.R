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
  setup_twitter_oauth(Sys.getenv("TWITTER_ACCESS_TOKEN"),Sys.getenv("TWITTER_ACCESS_TOKEN_SECRET"),access_token=Sys.getenv("TWITTER_CONSUMER_KEY"),access_secret=Sys.getenv("TWITTER_CONSUMER_SECRET"))
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
  
  data.frame(id=id,text=text,EvtTime=created)
}