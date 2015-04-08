############################################################
# CSC791 P3: Function to build and forecast based on
# a Arima time series model.
# Denil Vira Last updated: 4/4/2015
############################################################

predict_arima <- function(timeseries, label="Unspecified") {

# [DV] Run Arima prediction
# auto.arima returns best ARIMA model according to either AIC, AICc or BIC value. 
# The function conducts a search over possible model within the order constraints provided.
fit_arima <- auto.arima(timeseries)

# [DV] Plot the Arima model
#plot(fit_arima)

# [DV] Plot forecasts from the model. TODO - explain more.
#t <- paste("ARIMA Forecasts for",label,sep=" ")
plot(forecast(fit_arima),main="ARIMA",xlab="Bin number (1 bin=1 hour)",ylab="Events per bin")

}
