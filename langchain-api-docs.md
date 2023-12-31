# API Documentation

## 1. Save And Return AI Message

- **Endpoint**: `/api/langchain/lessons`
- **Method**: `POST`
- **Description**: Retrieves and save a message that explains mini-lesson goal.
- **URL Parameters**:
  - `username`: String (required)
  - `location_id`: Integer (required)
  - `location`: String (required)
  - `friend_name`: String (required)
  - `friend_type`: String (required)
  - `lesson_index`: Integer (required)
  - `mini_lesson_index`: Integer (required)
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message we want.
- **Error Handling**:
  - Returns `500 Internal Server Error` for any server-side errors.

## 2. Save User Message

- **Endpoint**: `/api/chat`
- **Method**: `POST`
- **Description**: Save message that user have sent.
- **Request Body**:
  - `username`: String (required)
  - `location_id`: Integer (required)
  - `message`: String (required)
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message we want.
- **Error Handling**:
  - Returns `500 Internal Server Error` for any server-side errors.

## 3. Fetch User Chat

- **Endpoint**: `/api/chat`
- **Method**: `GET`
- **Description**: Retrieves chat of user for location.
- **URL Parameters**:
  - `username`: String (required)
  - `location_id`: Integer (required)
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message we want.
- **Error Handling**:
  - Returns `500 Internal Server Error` for any server-side errors.  