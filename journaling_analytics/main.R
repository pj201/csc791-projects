############################################################
# CSC791 P3: Main function to demonstrate streaming
# time series analysis techniques in R.
# Nitin,Paul,Kshitij,Denil,Preetham. Last updated: 4/5/2015
############################################################

############################################################
# Load required libraries and source files
############################################################

# IMPORTANT: Run 'install.R' script before this one!

# Load libraries needed by this script
library(forecast)
library(stats)
library(fGarch)

# Set working directory to the directory of this source file
this.dir <- dirname(parent.frame(2)$ofile)
setwd(this.dir)

# Load functions from other files
source("ingest-journaling.R")
source("ingest-osx.R")
source("ingest-twitter.R")
source("preprocess.R")
source("predict-ets.R")
source("predict-arima.R")
source("predict-garch.R")
source("predict-hw.R")

# Sleep function (used by streaming ingest loop)
sleep <- function(x)
{
  p1 <- proc.time()
  Sys.sleep(x)
  proc.time() - p1 # The cpu usage should be negligible
  
}

############################################################
# Ingest historic data and create time series objects
############################################################

# Present Time stamp object 
presentTime <- as.numeric(as.POSIXct(Sys.time(),origin="1970-01-01"))*1000;

# Present Time stamp object for one month back (to get all historic data)
previousTime<- presentTime  - 2592000000; 

cat("**************************************************************\n")
cat("* Welcome to a demo of time series analysis techniques in R! *\n")
cat("**************************************************************\n\n")

cat("Press enter to fetch historical data from the LAS OSXInstrumenter...")
t<-readline()

# Fetch Data from OSX Instrumenter
new_osx_df <- ingest_osx(previousTime, presentTime)

cat("Press enter to fetch historical data from the CSC791 Journaling Trial...")
t<-readline()

# Fetch Data from Journaling project
new_j_df <- ingest_journaling(previousTime, presentTime)

cat("Press enter to fetch historical data from Twitter (@BarackObama)...")
cat("\n[Make sure you've added your Twitter Oauth credentials to ingest-twitter.R]")
t<-readline()

# Fetch Data from Twitter
new_t_df <- ingest_twitter("BarackObama",200) 

# Initialise timeseries object
tsOld <- ts(c(0));
# Binning data into 1 hour chunks.
binSize <- 3600000;
# Calculating number of bins for the historical pull.
size <- (presentTime - previousTime)/binSize;

# Get historic data from all 3 sources
tsNull<- ts(c(0));

cat("Press enter to create time series objects from the 3 datasets...")
t<-readline()

history_j_ts <- create_timeseries(new_j_df, tsNull, "UserId", "EvtTime", size)
history_osx_ts <- create_timeseries(new_osx_df, tsNull, "UserId", "EvtTime", size)
history_twitter_ts <- create_timeseries(new_t_df, tsNull, "id", "EvtTime", size)

# Run forecasting algorithms on historic data

cat("Press enter to build prediction models on LAS OSXInstrumenter activity data...")
t<-readline()

par(mfrow=c(2,2))

cat("Building Holt-Winters model...\n")
predict_hw(history_osx_ts, label="OSXInstrumenter")
cat("Building GARCH model...\n")
predict_garch(history_osx_ts, label="OSXInstrumenter")
cat("Building ARIMA model...\n")
predict_arima(history_osx_ts, label="OSXInstrumenter")
cat("Building Exponential Smoothing model...\n")
predict_ets(history_osx_ts, label="OSXInstrumenter")

mtext("Time Series Forecasts for LAS OSXInstrumenter (pjones) Dataset",outer=TRUE,line=-1.5)

cat("\nPress enter to build prediction models on CSC791 Journaling activity data...")
t<-readline()

par(mfrow=c(2,2))

cat("Building Holt-Winters model...\n")
predict_hw(history_j_ts, label="Journaling")
cat("Building GARCH model...\n")
predict_garch(history_j_ts, label="Journaling")
cat("Building ARIMA model...\n")
predict_arima(history_j_ts, label="Journaling")
cat("Building Exponential Smoothing model...\n")
predict_ets(history_j_ts, label="Journaling")

mtext("Time Series Forecasts for LAS Journaling Dataset",outer=TRUE,line=-1.5)

cat("\nPress enter to build prediction models on @BarackObama's twitter activity data...")
t<-readline()

par(mfrow=c(2,2))

cat("Building Holt-Winters model...\n")
predict_hw(history_twitter_ts, label="@BarackObama's twitter")
cat("Building GARCH model...\n")
predict_garch(history_twitter_ts, label="@BarackObama's twitter")
cat("Building ARIMA model...\n")
predict_arima(history_twitter_ts, label="@BarackObama's twitter")
cat("Building Exponential Smoothing model...\n")
predict_ets(history_twitter_ts, label="@BarackObama's twitter")

mtext("Time Series Forecasts for Twitter (@BarackObama) Dataset",outer=TRUE,line=-1.5)

############################################################
# Ingest continuous streaming data and make forecasts
############################################################

cat("\nPress enter to update the prediction models in real-time (only runs one update for demo)...")
t<-readline()

#while(TRUE) {

  # Calculating number of bins
  presentTime <- as.numeric(as.POSIXct(Sys.time(),origin="1970-01-01"))*1000 ;
  previousTime <- presentTime - 60000; 
  size <- (presentTime - previousTime)/binSize;

  # Get new data for each time series
  
  cat("Getting new data from LAS OSXInstrumenter project...")
  new_osx_df <- ingest_osx(previousTime, presentTime)
  cat("Getting new data from CSC791 Journaling Trial...")
  new_j_df <- ingest_journaling(previousTime, presentTime) 
  cat("Getting new data from Twitter (@BarackObama)...")
  new_t_df <- ingest_twitter("BarackObama",200)

  cat("\n\nUpdating time series...\n")
  # If we have new data, pre-process to create time series
  if(!is.null(new_j_df)) {
  history_j_ts <- create_timeseries(new_j_df, history_j_ts, "UserId", "EvtTime", size)
  }
  if(!is.null(new_osx_df)) {
  history_osx_ts <- create_timeseries(new_osx_df, history_osx_ts, "UserId", "EvtTime", size)
  }
  history_twitter_ts <- create_timeseries(new_t_df, tsNull, "id", "EvtTime", 720)

  # Run forecasting algorithms to update for next time period

  cat("\nUpdating prediction models for LAS OSXInstrumenter activity data...\n")
  par(mfrow=c(2,2))
  cat("Updating Holt-Winters model...\n")
  predict_hw(history_osx_ts, label="OSXInstrumenter")
  cat("Updating GARCH model...\n")
  predict_garch(history_osx_ts, label="OSXInstrumenter")
  cat("Updating ARIMA model...\n")
  predict_arima(history_osx_ts, label="OSXInstrumenter")
  cat("Updating Exponential Smoothing model...\n")
  predict_ets(history_osx_ts, label="OSXInstrumenter")
  
  mtext("Time Series Forecasts for LAS OSXInstrumenter (pjones) Dataset",outer=TRUE,line=-1.5)

  cat("\nUpdating prediction models for CSC791 Journaling activity data...\n")
  par(mfrow=c(2,2))
  cat("Updating Holt-Winters model...\n")
  predict_hw(history_j_ts, label="Journaling")
  cat("Updating GARCH model...\n")
  predict_garch(history_j_ts, label="Journaling")
  cat("Updating ARIMA model...\n")
  predict_arima(history_j_ts, label="Journaling")
  cat("Updating Exponential Smoothing model...\n")
  predict_ets(history_j_ts, label="Journaling")

  mtext("Time Series Forecasts for CSC791 Journaling Activity Dataset",outer=TRUE,line=-1.5)

  # TO DO: Update models for Twitter!

  cat("\nUpdating prediction models for @BarackObama'a twitter activity data...\n")
  par(mfrow=c(2,2))
  cat("Updating Holt-Winters model...\n")
  predict_hw(history_twitter_ts, label="@BarackObama's twitter")
  cat("Updating GARCH model...\n")
  predict_garch(history_twitter_ts, label="@BarackObama's twitter")
  cat("Updating ARIMA model...\n")
  predict_arima(history_twitter_ts, label="@BarackObama's twitter")
  cat("Updating Exponential Smoothing model...\n")
  predict_ets(history_twitter_ts, label="@BarackObama's twitter")
  
  mtext("Time Series Forecasts for Twitter (@BarackObama) Dataset",outer=TRUE,line=-1.5)

  # Wait one minute betwen data requests 
  # (should be one hour in a real app)
  #sleep(60)
  
  # End of continuous ingest loop
#}
