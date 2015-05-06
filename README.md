#################################################
# CSC591/791 Advanced Algorithms Capstone Project
# Authors:
# - Paul Jones, pjones@ncsu.edu
# - Kshitij Sharma, ksharma3@ncsu.edu 
# - Nitin Tak, ntak@ncsu.edu
# - Dakota Medd, drmedd@ncsu.edu
# Last Updated: 5/5/15
##################################################

To install:

* cd journaling_analytics
* Rscript install.R

** If you don't have Rscript installed, use 'sudo apt-get install r-base'
** If you get an error that Rscript has no CRAN mirror set, add the following lines
   to /etc/R/Rprofile.site

   local({
     r <- getOption("repos")
     r["CRAN"] <- "http://cran.cnr.berkeley.edu/"
     options(repos = r)
   })

* cd ../journaling_dashboard
* sudo npm install

--------------------------------------------------

To run:

* cd journaling_dashboard
* node app.js

Then point your browser to localhost:3000, and follow
instructions in the 'Tell Me More' pop-up for some
interesting things to try!

*** Please wait at least 2-3 minutes for the first set of 
    data to appear in the dashboard! Subsequently, updates
    will happen every minute. ***

--------------------------------------------------

Documentation:

See comprehensive report 'capstone-journaling.pdf'. 

