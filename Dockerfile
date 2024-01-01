# Use an official Go runtime as a parent image
FROM golang:1.21.4

# Set the working directory inside the container
WORKDIR /app

# Copy the local code, including files from the src folder
COPY main.go /app/
COPY index.html /app/
COPY assets /app/assets

# Build the Go application
RUN go mod init siprtc
RUN go mod tidy
RUN go mod download
RUN go build -o main main.go

# Expose port 8080 to the outside world
EXPOSE 80

# Command to run the executable
CMD ["./main"]