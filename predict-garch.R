############################################################
# CSC791 P3: Function to build and forecast based on
# a Garch time series model.
# Paul Jones, pjones@ncsu.edu, Last updated: 4/4/2015
############################################################

predict_garch <- function(timeseries) {

# [PJ] Run Holt-Winters prediction (non-seasonal)
fit_hw <- HoltWinters(timeseries, gamma=FALSE)

# [PJ] Plot the Holt-Winters model
plot(fit_hw)

# [PJ] Plot forecasts from the model. TODO - explain more.
plot(forecast(fit_hw))

}
