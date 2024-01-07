# Use an official Go runtime as a parent image
FROM golang:1.21.0-alpine as builder

# Set the working directory inside the container
WORKDIR /go/src/github.com/siprtcio/website/app

# Copy the local code, including files from the src folder
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

FROM alpine:latest
RUN apk --no-cache add ca-certificates curl
WORKDIR /
COPY --from=builder /go/src/github.com/siprtcio/website/app .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["./main"]