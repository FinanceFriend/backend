# API Documentation

## 1. Get Welcome Message

- **Endpoint**: `api/langchain/welcome`
- **Method**: `POST`
- **Description**: Generates a personalized welcome message for a new or returning user. For new users, the message introduces the module, the user's guide (friend), and provides both a child-friendly and a parent-focused description of the module. For returning users, it includes a motivational message, highlighting their progress and the next steps in their learning journey. This message is generated using the OpenAI language model.
- **Request Body**:

    The request body is a JSON object with the following structure:
    ```json
    {
      "currentBlock": 0,
      "currentLesson": 0,
      "currentMinilesson": 0,
      "land": {
        "id": 0,
        "name": "string",
        "friendName": "string",
        "friendType": "string",
        "moduleName": "string",
        "moduleDecriptionKids": "string",
        "moduleDescriptionParents": "string"
      },
      "progress": 0,
      "user": {
        "username": "string",
        "dateOfBirth": "string",
        "preferredLanguage": "string"
      }
    }
    ```
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - The customized welcome message.
- **Error Handling**:
  - Returns `500 Internal Server Error` for any server-side errors.

## 2. Get Lesson Message

- **Endpoint**: `/api/langchain/lessonMessageAlt`
- **Method**: `POST`
- **Description**: Generates a message for the current mini-lesson or a quiz based on the user's progress. For lesson messages, it includes a theoretical explanation and a playful scenario. For quiz messages, it generates a 5-question quiz based on the mini-lesson content, formatted as JSON objects with question details. This approach is aimed at enhancing the learning experience in a fun, interactive way, using the OpenAI language model.
- **Request Body**:

  The request body is a JSON object with the following structure:
  ```json
  {
    "currentBlock": 0,
    "currentLesson": 0,
    "currentMinilesson": 0,
    "land": {
      "id": 0,
      "name": "string",
      "friendName": "string",
      "friendType": "string",
      "moduleName": "string"
    },
    "user": {
      "username": "string",
      "dateOfBirth": "string",
      "preferredLanguage": "string"
    }
  }
  ```

- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - The lesson message.
- **Error Handling**:
  - Returns `500 Internal Server Error` for any server-side errors.


## 3. Get AI Answer From User Message

- **Endpoint**: `/api/langchain/userMessage`
- **Method**: `POST`
- **Description**: Save message that user have sent and respond with AI-generated message in chat-like conversation.
- **Request Body**:

  The request body is a JSON object with the following structure:
  ```json
  {
    "username": "string",
    "location_id": 0,
    "message": "string"
  }
  ```
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message we want.
- **Error Handling**:
  - Returns `500 Internal Server Error` for any server-side errors.

## 4. Get Freeform Chat Message

- **Endpoint**: `/api/langchain/freeformChat`
- **Method**: `POST`
- **Description**: This endpoint facilitates a freeform chat experience in the "Imagination Jungle" module. It allows users to engage in an interactive conversation with Cleo the Chameleon on a wide range of topics, beyond just finance. Cleo, being sensitive to the tone of the conversation, will provide educational and respectful responses, and may use external sources like Google search for up-to-date information. However, if inappropriate or offensive content is detected, Cleo will share a message emphasizing positive communication instead of responding to the specific content.
- **Request Body**:
  
  The request body should be a JSON object with the following structure:
  ```json
  {
    "user": {
      "username": "string",
      "dateOfBirth": "string",
      "preferredLanguage": "string",
      "message": "string"
    },
    "land": {
      "name": "Imagination Jungle",
      "friendName": "Cleo",
      "friendType": "Chameleon"
    }
  }
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - The response from Cleo the Chameleon, either addressing the user's query or providing guidance on positive communication.

- **Error Handling**:
  - Returns `500 Internal Server Error` for server-side issues.

## Implementation Details:
This endpoint corresponds to the `getFreeformMessage` function in the backend, which processes the user's message and invokes the `executePython` function. The Python script uses OpenAI's language model to generate Cleo's response based on the `templateText` input template. The script considers the user's age, language, and the content of the message to tailor the response. It also handles the detection of inappropriate or offensive content to maintain a respectful chat environment.



## 5. Get User Chat

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

## 6. Get Lessons and Mini-Lessons Names

- **Endpoint**: `/api/langchain/lessonNames`
- **Method**: `GET`
- **Description**: Retrieves lessons and mini lessons names for location.
- **URL Parameters**:
  - `locationName`: String (required)
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message we want.
- **Error Handling**:
  - Returns `500 Internal Server Error` for any server-side errors.