############################################################
# CSC791 P3: Main function to demonstrate streaming
# time series analysis techniques in R
# Nitin,Paul,Kshitij,Denil,Preetham. Last updated: 4/4/2015
############################################################

############################################################
# Load required libraries and source files
############################################################

#install.packages("forecast");
library(forecast)
library(stats)

this.dir <- dirname(parent.frame(2)$ofile)
setwd(this.dir)

# Creating sleep function 
sleep <- function(x)
{
  p1 <- proc.time()
  Sys.sleep(x)
  proc.time() - p1 # The cpu usage should be negligible
  
}

# Load functions from other files
source("ingest-journaling.R")
source("ingest-osx.R")
#source("ingest-twitter.R")
source("preprocess.R")
source("predict-ets.R")
source("predict-arima.R")
source("predict-garch.R")
source("predict-hw.R")

############################################################
# Ingest historic data and create time series objects
############################################################

# Present Time stamp object 
presentTime <- as.numeric(as.POSIXct(Sys.time(),origin="1970-01-01"))*1000 ;
# Present Time stamp object of one month back
previousTime<- presentTime  - 2592000000; 
# Fetch Data from OSX Instruments
new_osx_df <- ingest_osx(previousTime, presentTime)
# Fetch Data from Journaling project
new_j_df <- ingest_journaling(previousTime, presentTime)
# Fetch Data from Twitter
#new_t_df <- ingest_twitter("BarackObama",100) 

# Initialise timeseries object
tsOld <- ts(c(0));
# Binning data into 1 hour chunks.
binSize <- 3600000;
# Calculating number of bins for the historical pull.
size <- (presentTime - previousTime)/binSize;

# Get historic data from all 3 sources
tsNull<- ts(c(0));
history_j_ts <- create_timeseries(new_j_df, tsNull, "UserId", "EvtTime", size)
history_osx_ts <- create_timeseries(new_osx_df, tsNull, "UserId", "EvtTime", size)
#history_twitter_ts <- create_timeseries(new_osx_df, tsNull, "UserId", "EvtTime", size)

# Run forecasting algorithms on historic data

#Creating Holt-Winters model and predicting for journaling project
predict_hw(history_j_ts, label="Journaling")
#Creating Holt-Winters model and predicting for osx instruments
predict_hw(history_osx_ts, label="OSX Instrumenter")
#Creating Garch model and predicting for journaling project
#predict_garch(history_j_ts, "Journaling")
#Creating Garch model and predicting for osx instruments
#predict_garch(history_osx_ts, "OSXInstrumenter")
#Creating Arima model and predicting for journaling project
#predict_arima(history_j_ts, "Journaling")
#Creating Arima model and predicting for osx instruments
#predict_arima(history_osx_ts, "OSXInstrumenter")

############################################################
# Ingest continuous streaming data and make forecasts
############################################################

while(TRUE) {

sleep(60)

# Wait one min
# calculating number of bins.
presentTime <- as.numeric(as.POSIXct(Sys.time(),origin="1970-01-01"))*1000 ;
previousTime <- presentTime - 60000; 
size <- (presentTime - previousTime)/binSize;

new_osx_df <- ingest_osx(previousTime, presentTime)
new_j_df <- ingest_journaling(previousTime, presentTime) 
#new_t_df <- ingest_twitter("BarackObama",100)

# pre-process to create time series
if(!is.null(new_j_df)) {
history_j_ts <- create_timeseries(new_j_df, history_j_ts, "UserId", "EvtTime", size)}
if(!is.null(new_osx_df)) {
history_osx_ts <- create_timeseries(new_osx_df, history_osx_ts, "UserId", "EvtTime", size)
}
#history_twitter_ts <- create_timeseries(new_osx_df, tsNull, "UserId", "EvtTime", size)

# Run forecasting algorithms to update for next time period

#Creating Holt-Winters model and predicting for journaling project
predict_hw(history_j_ts, label="Journaling")
#Creating Holt-Winters model and predicting for osx instruments
predict_hw(history_osx_ts, label="OSXInstrumenter")
#Creating Garch model and predicting for journaling project
#predict_garch(history_j_ts, "Journaling")
#Creating Garch model and predicting for osx instruments
#predict_garch(history_osx_ts, "OSXInstrumenter")
#Creating Arima model and predicting for journaling project
#predict_arima(history_j_ts, "Journaling")
#Creating Arima model and predicting for osx instruments
#predict_arima(history_osx_ts, "OSXInstrumenter")

# End of loop
}
