############################################################
# CSC791 P3: Main function to demonstrate streaming
# time series analysis techniques in R
# AUTHOR(S), Last updated: 3/28/2015
############################################################

# TO DO - add in names etc

library(stats)

this.dir <- dirname(parent.frame(2)$ofile)
setwd(this.dir)

source("ingest-journaling.R")
source("preprocess.R")

# Get current timestamp
t <- as.numeric(as.POSIXct(Sys.time(),origin="1970-01-01"))*1000

# Initialise timeseries object
tsOld <- ts(c(0))

# Start loop

# Wait one minute

# get latest data from all 3 sources
# new_t_df <- ingest_twitter(t)
# new_osx_df <- ingest_osx(t)
new_j_df <- ingest_journaling(t)

# pre-process to create time series
new_j_ts <- create_timeseries(new_j_df, tsOld, "UserId", "EvtTime", 60000)

# Run predictive algorithms!

# Update results in plots

# End of loop

