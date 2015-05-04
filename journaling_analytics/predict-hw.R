############################################################
# CSC791 P5: Function to build and forecast based on
# a Holt-Winters time series model.
# Paul Jones, pjones@ncsu.edu, Last updated: 5/4/2015
############################################################

predict_hw <- function(timeseries, label="All") {

  # [PJ] A Holt-Winters model takes into account three components of a time series,
  # controlled by the parameters Alpha, Beta and Gamma:
  # - Alpha: exponential moving average (basically a Simple Exponential Smoother)
  # - Beta: estimates the overall trend (slope) in the time series
  # - Gamma: takes into account seasonality in the data
  
  # Our data sets are likely to require a model with all three of these components -
  # Twitter, OSXInstrumenter and Journaling will likely all have an overall positive trend
  # (typically people log more data over time), and show seasonality on various time periods.
  # The most likely here will be daily patterns of activity. Given an expectation of
  # increased activity over time, a multiplicative model of seasonality would seem the
  # most sensible, since we most care about % changes, not absolute values.
  
  # The R Holt-Winters function contains a built-in optimizer that will attempt to find
  # the best values for Alpha, Beta, and Gamma. In our case, the defaults suggested by the
  # documentation seem sensible, so we use these below.
  
  # [PJ] Run Holt-Winters prediction (with trend and multiplicative seasonality)
  #      We have a month of data, so expect about 20 periods.
  
  fit_hw <- HoltWinters(timeseries, 
                        alpha=NULL, beta=NULL, gamma=FALSE, 
                        optim.start = c(alpha=0.3, beta=0.1, gamma=0.1)) #start.periods = 2,

  # [PJ] Plot the Holt-Winters model (useful for debugging)
  #plot(fit_hw)

  # [PJ] Generate forecasts based on the model. By default, this function will either forecast
  # 10-steps ahead, or it will generate 2*frequency of the time series. We can stick with these
  # defaults, although we don't know the exact frequency of our data, so we also use the find.frequency
  # option to try to determine it automatically. We also set the confidence level for prediction
  # intervals to 80-95% as suggested by the documentation, and we try to make it as robust to missing
  # data as possible - this can certainly happen with OSXInstrumenter and Journaling data.
  
  forecast_hw <- forecast(fit_hw, level=c(80,95), robust=TRUE) #, find.frequency=TRUE)
  
  # Save to a fie
 
  filename <- paste("../journaling_dashboard/public/images/HoltWinters_",label,".png",sep="")
  png(filename)
  #t <- paste("HoltWinters Forecasts for",label,sep=" ")
  # [PJ] Create a title, and plot the forecasts
  plot(forecast(forecast_hw),main="",xlab="Bin number (1 bin=1 hour)",ylab="Events per bin")
  dev.off()
  
  
}

