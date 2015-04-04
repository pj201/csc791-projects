############################################################
# CSC791 P3: Function to build and forecast based on
# a Arima time series model.
# Denil Vira Last updated: 4/4/2015
############################################################

predict_arima <- function(timeseries) {

# [DV] Run Arima prediction
fit_arima <- auto.arima(timeseries)

# [DV] Plot the Arima model
plot(fit_arima)

# [DV] Plot forecasts from the model. TODO - explain more.
plot(forecast(fit_arima,1))

}

