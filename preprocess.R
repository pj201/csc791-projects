
create_timeseries <- function(df, tsOld, UserAttr, TimeAttr, binSize) {
  
  # Extract User and Time attributes 
  
  # Bin the data according to binSize
  
  # Extract data from tsOld by converting back to a vector
  v <- as.vector(tsOld)
  
  # For now just grab the number of rows - TO DO: fix this
  new_datapoint <- nrow(df)
  
  # Append new data onto this vector
  new_v <- c(v,new_datapoint)
  
  # Create a new timeSeries object and return it
  ts(new_v)
  
}