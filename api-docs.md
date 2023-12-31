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