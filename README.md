#################################################
# CSC591/791 Advanced Algorithms Capstone Project
# Authors:
# - Paul Jones, pjones@ncsu.edu
# - Kshitij Sharma, ksharma3@ncsu.edu 
# - Nitin Tak, ntak@ncsu.edu
# Last Updated: 5/4/15
##################################################

To install:

* cd journaling_dashboard
* sudo npm install

* To have a working R in Ubuntu, following entries have to be made:
(http://www.r-bloggers.com/permanently-setting-the-cran-repository/)
Setting the CRAN repository so that it does not ask every time you try to install a package. 
This is accomplished through a setting in one of the Rprofile files.  

There is the site file found at:

/etc/R/Rprofile.site
Add the following code section:

local({
  r <- getOption("repos")
  r["CRAN"] <- "http://cran.cnr.berkeley.edu/"
  options(repos = r)
})

NOTE: the above example has berkeley CRAN set as default. Any CRAN can be used.

* Execute the 'install.R' file inside R - this will install all dependencies. 



TO DO

--------------------------------------------------

To run:

TO DO

--------------------------------------------------

Documentation:

See report 'capstone-journaling.pdf' in Dropbox. 

