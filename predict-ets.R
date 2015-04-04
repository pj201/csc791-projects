############################################################
# CSC791 P3: Function to build and forecast based on
# a Exponential smoothing state space model ()ets)
# Nitin Tak, ntak@ncsu.edu
############################################################

predict_ets <- function(timeseries) {

# [NT] Run ets prediction (non-seasonal)
fit_ets <- ets(timeseries, gamma=FALSE)

# [NT] Plot the ets model
#plot(fit_ets)

# [NT] Plot forecasts from the model
plot(forecast(fit_ets))

}

