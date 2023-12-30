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

## 7. Save AI Message And Returns It

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

## 8. Fetch User Stats

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

## 9. Update User Stats

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
