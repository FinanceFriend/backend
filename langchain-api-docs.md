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

- **Endpoint**: `/api/langchain/lessonMessage`
- **Method**: `POST`
- **Description**: Generates a message for the current mini-lesson or a quiz based on the user's progress. For lesson messages, it includes a theoretical explanation and a playful scenario. For quiz messages, it generates a 5-question quiz based on the mini-lesson content, formatted as JSON objects with question details. This approach is aimed at enhancing the learning experience in a fun, interactive way, using the OpenAI language model. This call automatically updates user progress.
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
        
    },
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
- **Description**: This endpoint enables a freeform chat experience in the "Imagination Jungle" module, where users interact with Cleo the Chameleon. It supports both text-based conversations and image generation based on user input. For text chats, Cleo offers educational and respectful responses. Inappropriate or offensive content triggers a response emphasizing positive communication. If the user opts for image generation, the endpoint returns an image URL based on the provided message.
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
    },
    "type": "text" // or "image" to generate an image response
  }
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: Depending on the `type` parameter in the request, this can be either:
    - String - The response from Cleo the Chameleon for text-based chats.
    - String - A URL to the generated image for image requests.

- **Error Handling**:
  - Returns `500 Internal Server Error` for server-side issues.

## Implementation Details:
This endpoint corresponds to the `getFreeformMessage` function in the backend. It processes the user's message, and depending on the requested type (text or image), invokes the appropriate Python script. For text responses, the `executePython` function uses OpenAI's language model to generate Cleo's response based on the `templateText` input template, considering the user's age, language, and chat history. For image responses, it executes a different script to generate an image URL based on the message. The endpoint also handles detection of inappropriate or offensive content to ensure a respectful chat environment.


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

## 7. Evaluate User Answer to a Question

- **Endpoint**: `/evaluateQuestion`
- **Method**: `POST`
- **Description**: This endpoint evaluates a user's answer to a given question. It determines the relevance and correctness of the answer compared to a provided example of a correct answer. The evaluation and explanation are generated using the OpenAI language model, tailored to the specified language.
- **Request Body**:
  
  The request body should be a JSON object with the following structure:
  ```json
  {
    "user": {
      "username": "string",
      "preferredLanguage": "string"
    },
    "question": "string",
    "userAnswer": "string",
    "correctAnswerExample": "string"
  }

- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: JSON Object - Contains two fields:
    - `evaluation`: String - Indicates the correctness of the user's answer ('correct' or 'incorrect').
    - `explanation`: String - Provides a rationale for the evaluation of the user's answer.

- **Error Handling**:
  - Returns `500 Internal Server Error` for server-side issues.

## Implementation Details:
The `getQuestionEvaluation` function in the backend handles this endpoint. It receives the user's answer, the question, the preferred language, and an example of a correct answer. These inputs are then passed to a Python script that utilizes the OpenAI language model to evaluate the answer's correctness and relevance. The script employs structured output parsing to ensure the response is formatted as a JSON object with the evaluation and explanation.

