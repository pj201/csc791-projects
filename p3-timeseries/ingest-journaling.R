############################################################
# CSC791 P3: Function to ingest data from Journaling project
# Paul Jones, pjones@ncsu.edu, Last updated: 4/4/2015
############################################################

#library(Rcurl)
#library(TimeSeries)
library(jsonlite)
library(httr)
library(RJSONIO)

# Returns an object containing a time series of CSC791 Journaling data since timestamp
ingest_journaling <- function(fromTimestamp, toTimestamp) {
  
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
               add_headers("Content-Type" = "application/json", 
                           "AuthToken" = "9c0c9a9e0ec177d2bf9fd55edff5272cb2a3b9823babf07d6f762e3f9c9509bb"),
               body = toJSON(list(
                 "type" = "find",
                 "query" = list(
                   "data.ProjId" = "journaling-chrome",
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
  data.Journaling <- jsonlite::fromJSON(h)
  
  # Extract nested data object into data frame
  data.Journaling <- data.Journaling$data$data
  
  # For debugging only
  #head(data.Journaling)
  #dim(data.Journaling)
  #names(data.Journaling)
  #fix(data.Journaling)
  
  # Just return the data frame (gets converted to a timeSeries object
  # by the create_timeseries function in preprocess.R)
  return(data.Journaling) 
}
