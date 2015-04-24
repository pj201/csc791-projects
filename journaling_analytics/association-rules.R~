
install.packages("arules")
library("arules")
install.packages("arulesViz")
library("arulesViz")

new_j_df

colname<- c("UserId", "EvtTime", "WebURL")
subsetJournaling<- new_j_df[colname]

currentTransId <<- 1



NextEvtTime <- subsetJournaling$EvtTime[2:nrow(subsetJournaling)] 
NextEvtTime[nrow(subsetJournaling)]<- NextEvtTime[nrow(subsetJournaling)-1]
subsetJournaling$NextEvtTime<-NextEvtTime

compareRows<-function(x) {
  
  if(as.numeric(x[4]) - as.numeric(x[2]) > 3600000) {
    currentTransId<<-currentTransId+1; 
  }
  return(currentTransId)
}

transIds<-apply(subsetJournaling, 1, compareRows)

subsetJournaling$TransId <- transIds

transJourn<-subsetJournaling[c("TransId","WebURL")]
ddup <- unique(transJourn)
write.csv(ddup, file = "transJourn.csv", row.names = FALSE)

trans <- read.transactions("transJourn.csv" , format = c("single"), sep = ',',
                           cols = c(1,2))
rules <- apriori(trans, parameter = list(supp = 0.1, conf = 0.8))
plot(rules, control=list(jitter=2))
rules_high_lift <- head(sort(rules, by="lift"), 3)
inspect(rules_high_lift)
plot(rules_high_lift, method="graph", control=list(type="items"))

