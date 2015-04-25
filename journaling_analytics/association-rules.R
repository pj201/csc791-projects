############################################################
# CSC791 P3: Function to extract rules using Apriori from
# Journaling data set. 
# Paul Jones, pjones@ncsu.edu, Last updated: 4/24/2015
############################################################

#install.packages("arules")
library("arules")
#install.packages("arulesViz")
library("arulesViz")

# extracting rules using Apriori Algorithm from 
# Journaling Dataset.
extract_rules <- function(new_j_df) {

# Purging out other attributes except for the UserId, EvtTime, WebURL.
colname<- c("UserId", "EvtTime", "WebURL")
subsetJournaling<- new_j_df[colname]

# Setting a global variable, a counter which indicates the previous Transaction ID. 
currentTransId <<- 1

#In the next three lines, we are creating a new column NextEvtTime, which 
# which holds the EvtTime of the next Event.
NextEvtTime <- subsetJournaling$EvtTime[2:nrow(subsetJournaling)] 
NextEvtTime[nrow(subsetJournaling)]<- NextEvtTime[nrow(subsetJournaling)-1]
subsetJournaling$NextEvtTime<-NextEvtTime

# setting the maximum inactivity time gap allowed for a URL to be a 
# part of the transaction.  
inActiv <- 3600000

# Function which returns a vector of Transaction Id corresponding to each
# WebURL.
compareRows<-function(x) {

# If there is no activity for a period of inActiv duration, 
# we create a new transaction.
  if(as.numeric(x[4]) - as.numeric(x[2]) > inActiv) {
    currentTransId<<-currentTransId+1; 
  }
  return(currentTransId)
}

# We club all the web URL's into one transaction if there is no 
# inactivity duration greater than inActiv, else we start a new 
# transactionId.  
transIds<-apply(subsetJournaling, 1, compareRows)

# Adding a new column TransId which corresponds to the transaction ID.
subsetJournaling$TransId <- transIds

# Subsetting TransId and WebURL from the subsetJournaling data frame.
transJourn<-subsetJournaling[c("TransId","WebURL")]

# Removing Duplicate WebURL's from each transaction.
ddup <- unique(transJourn)

# Writing a transJourn.csv to the current dir location.
write.csv(ddup, file = "transJourn.csv", row.names = FALSE)

# Creating a transaction object from the transJourn.csv
trans <- read.transactions("transJourn.csv" , format = c("single"), sep = ',',
                           cols = c(1,2))
# Using Apriori Algorithm to select only those rules whose support and confidence satisfy
# the specified threshhold in the function.						   
rules <- apriori(trans, parameter = list(supp = 0.1, conf = 0.8))

# Plotting a Support vs Confidence graph for the rules which satisfy the support and confidence 
# threshhold.
png("../journaling_dashboard/public/images/Support-Confidence.png")
plot(rules, control=list(jitter=2))
dev.off()

rules_high_lift <- head(sort(rules, by="lift"), 3)
inspect(rules_high_lift)

plot(rules_high_lift, method="graph", control=list(type="items"))

}
