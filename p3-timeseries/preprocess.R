############################################################
# CSC791 P3: Function to preprocess data into time series
# AUTHOR(S), Last updated: 3/28/2015
############################################################

create_timeseries <- function(df, tsOld, UserAttr, TimeAttr, binSize) {
  
  # Extract User and Time attributes 
  #df.sub <- subset(df, select = c(UserAttr, TimeAttr))
  # Bin the data according to binSize
  v <-df$EvtTime #above line is redundant.
  r <- tapply(v, cut(v, binSize), length, simplify=FALSE)
  r[sapply(r, is.null)] <- 0
  matrix <- do.call(rbind, r)
  tsmatrix <- ts(matrix)
  # Extract data from tsOld by converting back to a vector
  v <- as.matrix(tsOld)
  
  # For now just grab the number of rows - TO DO: fix this
  new_datapoint <- nrow(df)
  
  # Append new data onto this vector
  
  #new_v <- c(v,new_datapoint)
  
  # Create a new timeSeries object and return it
  return(ts(rbind(v, tsmatrix)))
  
}