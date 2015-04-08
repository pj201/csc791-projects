#############################################
# CSC591/791 Advanced Algorithms Project P3
# Authors:
# - Paul Jones, pjones@ncsu.edu
# - Preetham, pmahish@ncsu.edu
# - Kshitij Sharma, ksharma3@ncsu.edu 
# - Denil Vira, dvvira@ncsu.edu
# - Nitin Tak, ntak@ncsu.edu
# Last Updated: 4/8/15
#############################################

To install:

* Execute the 'install.R' file inside R - this will install all dependencies. 
* Please use R version 3.1.1 or later. twitteR package is not compatible with older versions.
* Please enter your twitter credentials on line 19 in ingest-twitter.R

To run:

* Execute the 'main.R' file inside R - this will run the complete demo.

----------------------------------------------

Project one-sentence description:

Demonstration of four different time series analysis techniques, against
three different data sets (Tweets from BarackObama, a month of OSXInstrumenter
data for pjones, and a month of Journaling data for pjones).

The time series modelling techniques we've included are:

* ETS: simple weighted average, with exponentially decreasing weights over time
* Holt-Winters: additive or multiplicative model to capture moving average, trend and seasonality
* ARIMA: standard auto-regressive integrated moving average model
* GARCH: generalized auto-regressive conditional heteroskedasticity

More detail on each technique is included in the predict-*.R source files

-----------------------------------------------

Source files:

- ingest*.R: ingesters for the three datasets
- preprocess.R: functions for creating time series objects
- predict-*.R: functions to build models and create predictions
- main.R: overall demo file

Example output:

- plots/Forecasts-*.png contains example output from the demo.

