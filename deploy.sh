#!/bin/bash -e 

docker build -t registry.infra.cbd.int:5000/lifeweb-cbd-int git@github.com:scbd/lifeweb.cbd.int.git
docker push     registry.infra.cbd.int:5000/lifeweb-cbd-int
