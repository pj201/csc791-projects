#################################################
# CSC591/791 Advanced Algorithms Capstone Project
# Authors:
# - Paul Jones, pjones@ncsu.edu
# - Kshitij Sharma, ksharma3@ncsu.edu 
# - Nitin Tak, ntak@ncsu.edu
# Last Updated: 5/4/15
##################################################

To install:

* cd journaling_analytics
* Rscript install.R

** If you don't have Rscript installed, use 'sudo apt-get install R-base'
** If you get an error that Rscript has no CRAN mirror set, add the following lines
   to /etc/R/Rprofile.site

   local({
     r <- getOption("repos")
     r["CRAN"] <- "http://cran.cnr.berkeley.edu/"
     options(repos = r)
   })

* cd journaling_dashboard
* sudo npm install

--------------------------------------------------

To run:

* cd journaling_dashboard
* node app.js

Then point your browser to localhost:3000

--------------------------------------------------

Documentation:

See report 'capstone-journaling.pdf' in Dropbox. 

