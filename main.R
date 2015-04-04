############################################################
# CSC791 P3: Main function to demonstrate streaming
# time series analysis techniques in R
# Nitin,Paul,Kshitij,Denil,Preetham. Last updated: 4/3/2015
############################################################

############################################################
# Load required libraries and source files
############################################################

#install.packages("forecast");
library(forecast)
library(stats)

this.dir <- dirname(parent.frame(2)$ofile)
setwd(this.dir)

# Load functions from other files
source("ingest-journaling.R")
source("ingest-osx.R")
#source("ingest-twitter.R")
source("preprocess.R")
#source("predict-ets.R")
#source("predict-arima.R")
#source("predict-garch.R")
source("predict-hw.R")
############################################################
# Ingest data and create time series objects
############################################################

#
presentTime <- as.numeric(as.POSIXct(Sys.time(),origin="1970-01-01"))*1000 # Shouldn't this be inside the loop???
previousTime<- presentTime  - 2592000000; #timestamp one month in the past
new_osx_df <- ingest_osx(previousTime, presentTime)
new_j_df <- ingest_journaling(previousTime, presentTime)
#new_t_df <- ingest_twitter("BarackObama",100) 

# Initialise timeseries object
tsOld <- ts(c(0));
binSize <- 3600000;
size <- (presentTime - previousTime)/binSize;

# get latest data from all 3 sources
# new_t_df <- ingest_twitter(t)
tsNull<- ts(c(0));
history_j_ts <- create_timeseries(new_j_df, tsNull, "UserId", "EvtTime", size)
history_osx_ts <- create_timeseries(new_osx_df, tsNull, "UserId", "EvtTime", size)

predict_hw(history_j_ts)
predict_hw(history_osx_ts)

stop();

# TO DO: Start loop


# Wait one hour
# calculating number of bins.
previousTime <- presentTime - 60000; 
size <- (presentTime - previousTime)/binSize;

new_osx_df <- ingest_osx(previousTime, presentTime)
new_j_df <- ingest_journaling(previousTime, presentTime) 
#new_t_df <- ingest_twitter("BarackObama",100)

# I think we should filter out the data and fetch records which are within the 1 min range
# to avoid re-processing the same data ???

# pre-process to create time series
new_j_ts <- create_timeseries(new_j_df, tsOld, "UserId", "EvtTime", size)
#new_osx_ts <- create_timeseries(new_osx_df, tsOld, "UserId", "EvtTime", size)
#new_t_ts <- create_timeseries(new_t_df,tsOld,"id","created",size)

#########################################################
# Run forecasting algorithms
#########################################################

#fit <- ets(new_osx_ts)
#plot(forecast(fit))
# Update results in plots


# [PJ] Run Holt-Winters prediction (non-seasonal)
fit_hw <- HoltWinters(new_j_ts, gamma=FALSE)

# [PJ] Plot the Holt-Winters model
plot(fit_hw)

# [PJ] Plot forecasts from the model. TODO - explain more.
plot(forecast(fit_hw))

# End of loop

