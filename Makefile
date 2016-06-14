current_dir = $(shell pwd)


all:
	docker run -v $(current_dir)/project:/home/project --privileged -p 3000:4000 --rm -ti jesse/jekyll:latest

build:
	docker build -t jesse/jekyll:latest .

rmi:
	docker rmi $(docker images -a | grep "^<none>" | awk '{print $3}')

rm:
	docker rm $(docker ps -a -q)