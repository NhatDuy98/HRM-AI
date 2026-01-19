# Build and save docker image
docker build -t mlmt-map:latest -f Dockerfile.deploy .
docker save mlmt-map:latest | gzip > mlmt-map.docker.tar
# docker save -o mlmt-map.docker.tar mlmt-map:latest

sh upload-gdrive.sh