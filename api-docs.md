# API Documentation

## 1. User Registration

- **Endpoint**: `/api/register`
- **Method**: `POST`
- **Description**: This endpoint is used to create a new user account.
- **Request Body**:
  - `username`: String (required) - The desired username of the user.
  - `email`: String (required) - The user's email address.
  - `password`: String (required) - The user's password.
  - `dateOfBirth`: Date (required) - The user's date of birth.
  - `countryOfOrigin`: String (required) - The user's country of origin.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message describing the outcome.
  - `user`: Object - Contains user information (excluding password).
- **Error Handling**:
  - Returns `400 Bad Request` if the username already exists, the email already exists, or the email format is incorrect.
  - Returns `500 Internal Server Error` for any server-side errors.
- **Security Notes**:
  - Passwords are hashed before being stored.
  - Email validation is performed to check the format.

## 2. User Login

- **Endpoint**: `/api/login`
- **Method**: `POST`
- **Description**: This endpoint is used for user authentication.
- **Request Body**:
  - `login`: String (required) - The user's username or email address.
  - `password`: String (required) - The user's password.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message describing the outcome.
  - `user`: Object - Contains user information (username and email).
- **Error Handling**:
  - Returns `400 Bad Request` if either field is missing or if the user is not found.
  - Returns `401 Unauthorized` if the password does not match.
  - Returns `500 Internal Server Error` for any server-side errors.
- **Security Notes**:
  - Password verification is performed using bcrypt.

## 3. Fetch User Profile

- **Endpoint**: `/api/user/:username`
- **Method**: `GET`
- **Description**: Fetches the profile details of a specific user by their username.
- **URL Parameters**:
  - `username`: String (required) - The username of the user whose profile is being requested.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `user`: Object - Contains the requested user's information (excluding password).
- **Error Handling**:
  - Returns `404 Not Found` if the user does not exist.
  - Returns `500 Internal Server Error` for any server-side errors.

## 4. Fetch All Users 

- **Endpoint**: `/api/users`
- **Method**: `GET`
- **Description**: Retrieves a list of all users. This endpoint is intended for admin use.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `users`: Array - A list of user objects, each containing user information (excluding passwords).
- **Error Handling**:
  - Returns `401 Unauthorized` if the user is not authorized (non-admin).
  - Returns `500 Internal Server Error` for any server-side errors.

## 5. Update User Information

- **Endpoint**: `/api/user/:username`
- **Method**: `PUT`
- **Description**: Allows users to update their account information.
- **URL Parameters**:
  - `username`: String (required) - The current username of the user whose profile is being updated.
- **Request Body** (Any or all of the following):
  - `newUsername`: String (optional) - The new username for the user.
  - `email`: String (optional) - The new email address for the user.
  - `dateOfBirth`: Date (optional) - The new date of birth for the user.
  - `countryOfOrigin`: String (optional) - The new country of origin for the user.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message describing the outcome.
  - `user`: Object - Contains the updated user's information.
- **Error Handling**:
  - Returns `400 Bad Request` if the new username or email already exists, or if the email format is incorrect.
  - Returns `404 Not Found` if the original user is not found.
  - Returns `500 Internal Server Error` for any server-side errors.
- **Security Notes**:
  - Ensure this endpoint is accessible only to the authenticated user or users with admin privileges.
  - Validate the email format before processing updates.

## 6. Delete User

- **Endpoint**: `/api/user/:username`
- **Method**: `DELETE`
- **Description**: Deletes a specific user's account.
- **URL Parameters**:
  - `username`: String (required) - The username of the user to be deleted.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message describing the outcome.
- **Error Handling**:
  - Returns `404 Not Found` if the user does not exist.
  - Returns `500 Internal Server Error` for any server-side errors.

## 7. Fetch User Stats

- **Endpoint**: `/api/stats/:username`
- **Method**: `GET`
- **Description**: Retrieves the statistics associated with a specific user.
- **URL Parameters**:
  - `username`: String (required) - The username of the user whose stats are being requested.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `data`: Object - Contains the user's statistics.
    - `username`: String - The username of the user.
    - `completionPercentages`: Array of Numbers - An array of completion percentages.
    - `points`: Array of Numbers - An array of points.
    - `correctAnswers`: Number - The count of correct answers.
    - `incorrectAnswers`: Number - The count of incorrect answers.
    - `totalCompletion`: Number - The average of all completion percentages.
    - `totalPoints`: Number - The sum of all points.
    - `correctAnswersPercentage`: Number - The percentage of correct answers.
- **Error Handling**:
  - Returns `404 Not Found` if the stats for the given username are not found.
  - Returns `500 Internal Server Error` for any server-side errors.

## 8. Update User Stats

- **Endpoint**: `/api/stats/:username`
- **Method**: `PUT`
- **Description**: Updates the statistics associated with a specific user.
- **URL Parameters**:
  - `username`: String (required) - The username of the user whose stats are to be updated.
- **Request Body** (Any or all of the following):
  - `completionPercentages`: Array of Numbers (optional) - An array of new completion percentages.
  - `points`: Array of Numbers (optional) - An array of new points.
  - `correctAnswers`: Number (optional) - The updated count of correct answers.
  - `incorrectAnswers`: Number (optional) - The updated count of incorrect answers.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `message`: String - A message describing the outcome.
  - `data`: Object - Contains the updated stats for the user.
- **Error Handling**:
  - Returns `400 Bad Request` if the provided data is invalid or if required fields are missing.
  - Returns `404 Not Found` if no stats are found for the given username.
  - Returns `500 Internal Server Error` for any server-side errors.

## 9. General Leaderboard

- **Endpoint**: `/api/leaderboard/general`
- **Method**: `GET`
- **Description**: Retrieves a leaderboard of first 100 users sorted by total points. Each entry includes the user's username, country, age, total points, and their rank.
- **Response**:
  - `success`: Boolean - Indicates if the operation was successful.
  - `leaderboard`: Array of Objects - A list of user rankings.
    - `username`: String - The username of the user.
    - `countryOfOrigin`: String - The country of origin of the user.
    - `age`: Number - The age of the user, calculated from their date of birth.
    - `totalPoints`: Number - The total points accumulated by the user.
    - `rank`: Number - The rank of the user in the leaderboard. Users with the same number of points share the same rank.
- **Error Handling**:
  - Returns `500 Internal Server Error` for any server-side errors.

## 10. General Leaderboard

- **Endpoint**: `/api/leaderboard/general`
- **Method**: `GET`
- **Description**: This method provides a leaderboard of the first 100 users, sorted by their total points. It supports optional filtering based on the user's age and country of origin. Each user's entry includes their username, country, age, total points, and rank.
- **Query Parameters**:
  - `age` (optional): Integer - Specifies the age to filter the leaderboard.
  - `country` (optional): String - Specifies the country to filter the leaderboard.
- **Response**: 
  - `success`: Boolean - Indicates if the operation was successful.
  - `leaderboard`: Array of Objects - List of user rankings, each containing:
    - `username`: String - The user's username.
    - `countryOfOrigin`: String - The user's country of origin.
    - `age`: Number - The user's age, calculated from their date of birth.
    - `totalPoints`: Number - The total points accumulated by the user.
    - `rank`: Number - The user's rank in the leaderboard. Users with the same number of points share the same rank.
- **Error Handling**:
  - On server-side errors, returns `500 Internal Server Error` with an error message.


## 11. Evaluate User Answer to a Question

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
