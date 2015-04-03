############################################################
# CSC791 P3: Main function to demonstrate streaming
# time series analysis techniques in R
# AUTHOR(S), Last updated: 3/28/2015
############################################################

# TO DO - add in names etc
install.packages("forecast");
library(forecast)
library(stats)

this.dir <- dirname(parent.frame(2)$ofile)
setwd(this.dir)

source("ingest-journaling.R")
source("preprocess.R")

# Get current timestamp
presentTime <- as.numeric(as.POSIXct(Sys.time(),origin="1970-01-01"))*1000 # Shouldn't this be inside the loop???

# Initialise timeseries object
tsOld <- ts(c(0))

# Start loop

# calculating number of bins.
previousTime <- presentTime - 60000; 
size <- (presentTime - previousTime)/binSize;

# Wait one minute

# get latest data from all 3 sources
# new_t_df <- ingest_twitter(t)
new_osx_df <- ingest_osx(previousTime, presentTime)
new_j_df <- ingest_journaling(presentTime) # I think we should filter out the data and fetch records which are within the 1 min range
										   # to avoid re-processing the same data ???

# pre-process to create time series
new_j_ts <- create_timeseries(new_j_df, tsOld, "UserId", "EvtTime", size)
new_osx_ts <- create_timeseries(new_osx_df, tsOld, "UserId", "EvtTime", size)

# Run predictive algorithms!
fit <- ets(new_osx_ts)
plot(forecast(fit))
# Update results in plots

# End of loop

