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

## 2. Save User Message And Return AI answer

- **Endpoint**: `/api/langchain/userMessage`
- **Method**: `POST`
- **Description**: Save message that user have sent and.
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

  # API Documentation

## 4. Get Welcome Message

- **Endpoint**: `api/langchain/welcome`
- **Method**: `POST`
- **Description**: Generates a personalized welcome message for a new or returning user. For new users, the message introduces the module, the user's guide (friend), and provides both a child-friendly and a parent-focused description of the module. For returning users, it includes a motivational message, highlighting their progress and the next steps in their learning journey. This message is generated using the OpenAI language model.
- **URL Parameters**:
  - `username`: String (required) - The name of the user.
  - `userAge`: Integer (required) - The age of the user.
  - `userLanguage`: String (required) - The language in which to generate the message.
  - `locationName`: String (required) - The virtual location associated with the module.
  - `friendName`: String (required) - The name of the user's guide.
  - `friendType`: String (required) - The type of guide (e.g., character).
  - `moduleName`: String (required) - The name of the module.
  - `moduleDecriptionKids`: String (required) - The module description for kids.
  - `moduleDescriptionParents`: String (required) - The module description for parents.
  - `progress`: Integer (required) - The user's progress in the module.
  - `currentLesson`: Integer (required) - The current lesson index.
  - `currentMinilesson`: Integer (required) - The current mini-lesson index.
  - `currentBlock`: Integer (required) - The current block index.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - The customized welcome message.
- **Error Handling**:
  - Returns `500 Internal Server Error` for any server-side errors.

## 5. Get Lesson Message (new version)

- **Endpoint**: `/api/langchain/lessonMessageAlt`
- **Method**: `POST`
- **Description**: Generates a message for the current mini-lesson or a quiz based on the user's progress. For lesson messages, it includes a theoretical explanation and a playful scenario. For quiz messages, it generates a 5-question quiz based on the mini-lesson content, formatted as JSON objects with question details. This approach is aimed at enhancing the learning experience in a fun, interactive way, using the OpenAI language model.
- **URL Parameters**:
  - `username`: String (required) - The name of the user.
  - `userAge`: Integer (required) - The age of the user.
  - `userLanguage`: String (required) - The language in which to generate the message.
  - `locationName`: String (required) - The virtual location associated with the module.
  - `friendName`: String (required) - The name of the user's guide.
  - `friendType`: String (required) - The type of guide (e.g., character).
  - `moduleName`: String (required) - The name of the module.
  - `currentLesson`: Integer (required) - The current lesson index.
  - `currentMinilesson`: Integer (required) - The current mini-lesson index.
  - `currentBlock`: Integer (required) - The current block index.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - The lesson message.
- **Error Handling**:
  - Returns `500 Internal Server Error` for any server-side errors.
