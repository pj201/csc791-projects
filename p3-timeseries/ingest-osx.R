############################################################
# CSC791 P3: Function to ingest data from OSX Journaling project
# Kshitij Sharma, ksharma3@ncsu.edu, Last updated: 4/2/2015
############################################################

#library(Rcurl)
#library(TimeSeries)
library(jsonlite)
library(httr)
library(RJSONIO)

# Returns an object containing a time series of CSC791 OSX data since timestamp
ingest_osx <- function(fromTimestamp, toTimestamp) {
  
  # Get latest data - equivalent curl command looks like:
  # curl -H "Content-Type: application/json" 
  #      -H "AuthToken: ${AUTH_TOKEN}" 
  #      -d '{"type":"find","query":{"data.UserId”:”${UNITYID}","data.ProjId":"journaling-chrome",
  #           "data.EvtTime":{"$gte":1423717200000,"$lte":1424303540000}}}'
  #     https://las-skylr-token.oscar.ncsu.edu/api/data/document/query
  
  # TO DO: Insert timestamp into request

  resp <- POST("https://las-skylr-token.oscar.ncsu.edu/api/data/document/query",
              accept_json(),
              verbose(),
              add_headers("Content-Type" = "application/json", "AuthToken" = "9c0c9a9e0ec177d2bf9fd55edff5272cb2a3b9823babf07d6f762e3f9c9509bb"),
              body = toJSON(list(
                "type" = "find",
                "query" = list(
                  "data.ProjId" = "skylr-osx-instrumenter",
                  "data.UserId" = "pjones",
                  "data.EvtTime" = list(
                    "$gte" = fromTimestamp,
                    "$lte" = toTimestamp
                  )
                )
              ))
)

  # Download query content from server
  h<-content(resp, "text", encoding = "ISO-8859-1", col.names=FALSE, row.names=FALSE)
  
  # Parse JSON
  data.OSX <- jsonlite::fromJSON(h)
  
  # Extract nested data object into data frame
  data.OSX<-data.OSX$data$data
  
  # For debugging only
  #head(data.OSX)
  #data.OSX
  
  # Just return the data frame (gets converted to a timeSeries object
  # by the create_timeseries function in preprocess.R)
  return(data.OSX) 
}
