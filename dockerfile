# Dockerfile
# Step 1: Use Node.js base image
FROM node:18-alpine AS builder

# Step 2: Install FFmpeg
RUN apk add --no-cache ffmpeg

# Step 3: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 4: Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Step 5: Copy the entire source code into the container
COPY . .

# Step 6: Build the NestJS app
RUN npm run build

# Step 7: Prepare the production image
FROM node:18-alpine

# Step 8: Install FFmpeg for the final image
RUN apk add --no-cache ffmpeg

# Step 9: Set the working directory for the final image
WORKDIR /usr/src/app

# Step 10: Copy the built app from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# Step 11: Expose the application port
EXPOSE 3001

# Step 12: Set the default command to run the app
CMD ["node", "dist/main"]
