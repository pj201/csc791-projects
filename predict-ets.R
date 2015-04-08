############################################################
# CSC791 P3: Function to build and forecast based on
# a Exponential smoothing state space model ()ets)
# Nitin Tak, ntak@ncsu.edu
############################################################

predict_ets <- function(timeseries, label="Unspecified") {

# [NT] Run ets prediction
fit_ets <- ets(timeseries)

# [NT] Plot the ets model
#plot(fit_ets)

# [NT] Plot forecasts from the model
#t <- paste("Exponential Smoothing Forecast for",label,sep=" ")
plot(forecast(fit_ets),main="Exponential Smoothing",xlab="Bin number (1 bin=1 hour)",ylab="Events per bin")

}

