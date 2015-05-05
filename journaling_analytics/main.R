#!/usr/bin/Rscript

############################################################
# CSC591/791 P5: Capstone project - script to extract a
# time series of data for either all users, or a particular
# user from Journaling data. Much of the code is based on
# our original P3 submission for time series analysis in R.
# Nitin,Paul,Kshitij,Dakota Last updated: 5/5/2015
############################################################

############################################################
# Load required libraries and source files
############################################################

# IMPORTANT: Run 'install.R' script before this one!

# Change the working directory to journaling_analytics
print("Start of main.R")
#print(getwd())
direc <- getwd()
new_dir <- paste(direc, "/../journaling_analytics", sep = "")
setwd(new_dir)
#print("updated directory...")
print(getwd())

# Load libraries needed by this script
library(forecast)
library(stats)

# Set working directory to the directory of this source file
#this.dir <- dirname(parent.frame(2)$ofile)
#setwd(this.dir)

# Load functions from other files
source("ingest-journaling-urls.R")
source("ingest-journaling-files.R")
source("preprocess.R")
source("predict-hw.R")
source("association-rules.R")

# Sleep function (used by streaming ingest loop)
sleep <- function(x)
{
  p1 <- proc.time()
  Sys.sleep(x)
  proc.time() - p1 # The cpu usage should be negligible
  
}

# get command line arguments
args <- commandArgs(trailingOnly = TRUE)

# Set wanted userId from environment
UNITYID <- Sys.getenv('UNITYID')
print(UNITYID)

# Set wanted assignment from environment
ASSIGNMENT <- Sys.getenv('ASSIGNMENT')
print(ASSIGNMENT)

############################################################
# Ingest historic data and create time series objects
############################################################

# Present Time stamp object 
presentTime <- as.numeric(as.POSIXct(Sys.time(),origin="1970-01-01"))*1000;

# Present Time stamp object for two months back (to get all historic data)
previousTime <- presentTime - 5184000000; 

# Fetch Data from Journaling project
new_j_df <- ingest_journaling_urls(previousTime, presentTime)
#new_j_df_files <- ingest_journaling_files(previousTime,presentTime)

# Concatenate the two data frames
#new_j_df <- rbind(new_j_df_urls, new_j_df_files)

# Default label 
LABEL <- "ALL"

# Filter data according to UNITYID if it is set
if(UNITYID != "ALL")
{
  new_j_df <- new_j_df[new_j_df$UserId == UNITYID,]
  LABEL <- UNITYID
}

# Filter data according to ASSIGNMENT if it is set
if(ASSIGNMENT != "ALL")
{
  new_j_df <- new_j_df[grep(ASSIGNMENT, new_j_df$TaskName),]
  LABEL <- ASSIGNMENT
}

# Remove rows corresponding to certain URLs we don't care about
# specifically, those containing localhost and newtab. 
# Commented out since this can remove all association rules for some users!
#new_j_df <- new_j_df[grep("localhost", new_j_df$WebURL, invert=TRUE),]
#new_j_df <- new_j_df[grep("newtab", new_j_df$WebURL, invert=TRUE),]

# Extract association rules from Journaling project and save PNGs to file
extract_rules(new_j_df)

# Initialise timeseries object
tsOld <- ts(c(0));

# Binning data into 1 hour chunks.
binSize <- 3600000;

# Calculating number of bins for the historical pull.
size <- (presentTime - previousTime)/binSize;

# Create a timeSeries object from the dataframe
tsNull<- ts(c(0));
history_j_ts <- create_timeseries(new_j_df, tsNull, "UserId", "EvtTime", size)

# Run HW forecasting algorithm on historic data and save PNG to file
cat("Building Holt-Winters model...\n")
predict_hw(history_j_ts, label=LABEL)
