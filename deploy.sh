#!/bin/bash -e 

docker build -t localhost:5000/lifeweb-cbd-int git@github.com:scbd/lifeweb.cbd.int.git
docker push     localhost:5000/lifeweb-cbd-int
