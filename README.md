#############################################
# CSC591/791 Advanced Algorithms Project P3
# Authors:
# - Paul Jones, pjones@ncsu.edu
# - Preetham, pmahish@ncsu.edu
# - Kshitij Sharma, ksharma3@ncsu.edu 
# - Denil Vira, dvvira@ncsu.edu
# - Nitin Tak, ntak@ncsu.edu
# Last Updated: 4/4/15
#############################################

To install:

Execute the 'install.R' file inside R - this will install all dependencies

To run:

Execute the 'main.R' file inside R - this will run the complete demo.

----------------------------------------------

Project description:

Demonstration of four different time series analysis techniques, against
three different data sets (Tweets from BarackObama, a month's worth of OSX
OInstrumenter data for pjones, and a month's worth of Journaling data for
pjones).

The time series modelling techniques we've included are:

* Holt-Winters: simple linear model to capture seasonality
* ARIMA: auto-regressive integrated moving average model
* GARCH: generalized auto-regressive conditional heteroskedasticity
* ETS: weighted average, with exponentially descreasing weights over time

-----------------------------------------------

Source files:

- ingest*.R: ingesters for the three datasets
- preprocess.R: functions for creating time series objects
- predict-*.R: functions to build models and create predictions
- main.R: overall demo file

