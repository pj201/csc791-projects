############################################################
# CSC791 P3: Function to build and forecast based on
# a Holt-Winters time series model.
# Paul Jones, pjones@ncsu.edu, Last updated: 4/4/2015
############################################################

predict_hw <- function(timeseries, label="Unspecified") {

# [PJ] Run Holt-Winters prediction (non-seasonal)
fit_hw <- HoltWinters(timeseries, gamma=FALSE)

# [PJ] Plot the Holt-Winters model
#plot(fit_hw)

# [PJ] Plot forecasts from the model. TODO - explain more.
t <- paste("HoltWinters Forecasts for",label,sep=" ")
plot(forecast(fit_hw),main=t,xlab="Bin number (1 bin=1 hour)",ylab="Events per bin")

}

