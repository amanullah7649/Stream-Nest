# Video Streaming and File Upload Service (NestJS)

This project is a comprehensive video streaming and file upload service built with the NestJS framework. It provides endpoints for uploading files (including streaming and `ffmpeg` processing) and enables HTTP-based video streaming from object storage systems like MinIO.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Set Up Environment Variables](#set-up-environment-variables)
  - [Run the Application](#run-the-application)
- [API Endpoints](#api-endpoints)
  - [File Upload Endpoints](#file-upload-endpoints)
  - [File Streaming Endpoints](#file-streaming-endpoints)
- [MinIO Integration](#minio-integration)
  - [MinIO Setup](#minio-setup)
- [Technologies Used](#technologies-used)

## Features

- **File Upload**: Upload files via standard uploads, streams, or through `ffmpeg` for video processing.
- **File Streaming**: Serve video files through various streaming endpoints (supports MPEG-DASH).
- **MinIO Integration**: Store uploaded files in MinIO or any S3-compatible object storage.
- **Performance Measurement**: The duration of the file upload and processing is returned for analysis.

## Requirements

- **Node.js** v14+
- **NestJS** framework
- **MinIO** for object storage (or an S3-compatible service)
- **ffmpeg** for video file processing

## Getting Started

### Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/amanullah7649/Stream-Nest.git
cd video-streaming-nestjs
```

### Install Dependencies

Use npm to install all the project dependencies:

```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root directory of your project and configure the following environment variables:

```bash
APP_PORT=3000
MINIO_ENDPOINT=your-minio-endpoint
MINIO_ACCESS_KEY=your-minio-access-key
MINIO_SECRET_KEY=your-minio-secret-key
MINIO_BUCKET_NAME=your-minio-bucket-name
NODE_ENV=dev
```

Make sure to replace the placeholders with the actual values for your MinIO or S3-compatible object storage credentials.

### Run the Application

After setting up the environment variables, start the application using the following command:

```bash
npm run start:dev
```

The server will start on the port specified in your `.env` file, which defaults to `3000`.

## API Endpoints

### File Upload Endpoints

1. **Standard File Upload**

   - **Method**: `POST`
   - **Endpoint**: `/file-upload`
   - **Description**: Upload a file using the standard file upload mechanism.
   - **Response**:
     ```json
     {
       "message": "File uploaded successfully",
       "file": "filename",
       "fileId": "generated-file-id",
       "duration": "time in ms"
     }
     ```

2. **File Upload by Stream**

   - **Method**: `POST`
   - **Endpoint**: `/file-upload/by-stream`
   - **Description**: Upload a file using streaming upload.
   - **Response**:
     ```json
     {
       "message": "File uploaded successfully",
       "file": "filename",
       "fileId": "generated-file-id",
       "duration": "time in ms"
     }
     ```

3. **File Upload with ffmpeg**

   - **Method**: `POST`
   - **Endpoint**: `/file-upload/by-ffmpeg`
   - **Description**: Upload and process a video file using `ffmpeg`.
   - **Response**:
     ```json
     {
       "message": "File uploaded successfully",
       "file": "filename",
       "fileId": "generated-file-id",
       "manifestUrl": "url-to-mpd-manifest",
       "duration": "processing time in ms"
     }
     ```

### File Streaming Endpoints

1. **List Available Files**

   - **Method**: `GET`
   - **Endpoint**: `/file-streaming/list`
   - **Description**: Fetch a list of all available uploaded files.

2. **View Specific File**

   - **Method**: `GET`
   - **Endpoint**: `/file-streaming/view`
   - **Query Parameters**:
     - `fileName`: The name of the file to be streamed.
   - **Description**: Stream a specific file.

3. **Stream MPD File (MPEG-DASH)**

   - **Method**: `GET`
   - **Endpoint**: `/file-streaming/view.mpd`
   - **Query Parameters**:
     - `fileName`: The name of the file.
     - `isLocal`: Flag indicating whether the file is local or in object storage.
   - **Description**: Stream an MPEG-DASH MPD file chunk.

4. **Stream Specific MPD File**

   - **Method**: `GET`
   - **Endpoint**: `/file-streaming/:stream`
   - **Query Parameters**:
     - `fileName`: The name of the file.
     - `isLocal`: Flag indicating whether the file is local or in object storage.
   - **Description**: Stream an entire MPD file.

## MinIO Integration

This project uses MinIO (or any S3-compatible storage service) to handle file uploads. You must set up MinIO for storing the uploaded files.

### MinIO Setup

1. Install and run MinIO on your server.
2. Create a bucket for storing uploaded files.
3. Configure the `.env` file with your MinIO endpoint and credentials.

For example:

```bash
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET_NAME=your-bucket-name
```

## Technologies Used

- **NestJS**: A progressive Node.js framework for building scalable and maintainable server-side applications.
- **MinIO**: High-performance object storage that is compatible with the Amazon S3 API.
- **Multer**: A Node.js middleware for handling `multipart/form-data`, used for file uploads.
- **ffmpeg**: A powerful open-source tool for handling video, audio, and other multimedia files and streams.
