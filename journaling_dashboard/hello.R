#!/usr/bin/env Rscript
args <- commandArgs(trailingOnly = TRUE)
print("****printing start")
# print(args['cwd'])
# print(args['YEAR'])
# print(args[2])
print(Sys.getenv('PARAM'))
print("****printing end")
sayHello <- function(){
	print("param")
}
sayHello();
