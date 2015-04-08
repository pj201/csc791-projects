############################################################
# CSC791 P3: Function to build and forecast based on
# a Garch time series model.
# Peetham TO DO... Last updated: 4/4/2015
############################################################

predict_garch <- function(timeseries, label="Unspecified") {
  
#Fit the garch Model
gFit=garchFit(formula = ~ garch(1, 1),data=timeseries)

#Plot graph
#t <- paste("Garch Model Forecasts for",label,sep=" ")
plot(residuals(gFit,standardize=T),type="l",main="GARCH",xlab="Bin number (1 bin=1 hour)",ylab="Events per bin")
  
}
