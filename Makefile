docker-build:
	docker build -t html-server-image:v1 .

docker-run:
	docker run --name=html-server-image -d --rm -v $(shell pwd):/usr/share/nginx/html -p 8181:80 html-server-image:v1

docker-stop:
	docker stop html-server-image