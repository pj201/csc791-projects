############################################################
# CSC791 P3: Function to build and forecast based on
# a Exponential smoothing state space model ()ets)
# Nitin Tak, ntak@ncsu.edu
############################################################

predict_ets <- function(timeseries, label="Unspecified") {

# [NT] Run ets prediction (non-seasonal)
fit_ets <- ets(timeseries, gamma=FALSE)

# [NT] Plot the ets model
#plot(fit_ets)

# [NT] Plot forecasts from the model
t <- paste("Exponential Smoothing Space Forecasts for dataset",label,sep=" ")
plot(forecast(fit_ets),main=t,xlab="Bin number (1 bin=1 hour)",ylab="Events per bin")

}

