# Function to ingest data from Journaling project
# Paul Jones, pjones@ncsu.edu 3/25/15

#library(Rcurl)
#library(TimeSeries)
library(jsonlite)
library(httr)
library(RJSONIO)

# Returns an object containing a time series of CSC791 Journaling data since timestamp
ingest_journaling <- function(timestamp) {
  
  # Get latest data - equivalent curl command looks like:
  # curl -H "Content-Type: application/json" 
  #      -H "AuthToken: ${AUTH_TOKEN}" 
  #      -d '{"type":"find","query":{"data.UserId”:”${UNITYID}","data.ProjId":"journaling-chrome",
  #           "data.EvtTime":{"$gte":1423717200000,"$lte":1424303540000}}}'
  #     https://las-skylr-token.oscar.ncsu.edu/api/data/document/query
  
  # TO DO: Ingest JSON object
  resp <- POST("https://las-skylr-token.oscar.ncsu.edu/api/data/document/query",
               accept_json(),
               verbose(),
               add_headers("Content-Type" = "application/json", 
                           "AuthToken" = "79e0eb5ad4c0a4ceff6889dc6e8fd3ec188219db7a8a7e63d04a0730c2f9f0c9"),
               body = toJSON(list(
                 "type" = "find",
                 "query" = list(
                   "data.ProjId" = "journaling-chrome",
                   "data.UserId" = "pjones",
                   "data.EvtTime" = list(
                     "$gte" = 1422717200000,
                     "$lte" = 1424303540000
                   )
                 )
               ))
  )
  h<-content(resp, "text", encoding = "ISO-8859-1", col.names=FALSE, row.names=FALSE)
  data.Journaling <- jsonlite::fromJSON(h)
  data.Journaling <- data.Journaling$data$data
  head(data.Journaling)
  dim(data.Journaling)
  names(data.Journaling)
  fix(data.Journaling)
  # TO DO: Parse and extract timestamps
  
  # TO DO: Create timeSeries object
  
}