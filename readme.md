# Docker Reverse Proxy

This project provides a Docker-based reverse proxy solution that allows you to easily access and manage multiple Docker containers through subdomains.

## Features

- Automatically route requests to the appropriate Docker container based on subdomain
- Easy setup and configuration
- Supports MongoDB integration for advanced use cases

## Prerequisites

- Docker installed on your system
- A MongoDB cluster (for advanced features)

## Quick Start

### Pull the Docker image:

```
docker pull rajeevraj07/docker-reverse-proxy:latest
```

## Run the reverse proxy:

```
docker run \
-p 80:80 \
-e MONGO_DB_URL=<url_of_your_mongodb_cluster> \
-v /var/run/docker.sock:/var/run/docker.sock \
rajeevraj07/docker-reverse-proxy:latest
```

#### Replace <url_of_your_mongodb_cluster> with your actual MongoDB cluster URL.

### Usage

- Once the reverse proxy is running, you can easily access your Docker containers using subdomains.

### Example:

Start a new container:
```
docker run --rm --name luffy -d nginx
```

## Access the container:
- Open your web browser and navigate to http://luffy.localhost
- You should now see the default Nginx welcome page for the luffy container.

## How It Works

- The reverse proxy automatically detects running Docker containers and routes incoming requests based on the subdomain. For example, if you have a container named myapp, you can access it via myapp.localhost.

## Troubleshooting

### If you encounter any issues:

- Ensure Docker is running and you have the necessary permissions.
- Check that the MongoDB URL is correct and accessible.
- Verify that the container names do not contain any special characters.
