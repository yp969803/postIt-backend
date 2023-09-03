# Use the official Deno Docker image
FROM denoland/deno:alpine

# Set the working directory
WORKDIR /app

# Copy your Deno application files into the container
COPY . .

# Allow network access (for Deno)
EXPOSE 8080

# Run your Deno application
CMD ["deno", "run", "--allow-net","--allow-read","--allow-write","--allow-env" ,"server.ts"]
