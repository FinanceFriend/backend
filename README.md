# FinanceFriend backend

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js
- npm (Node Package Manager)
- MongoDB (local setup or MongoDB Atlas URI)
- Python 3 (with Pip)

## Installing

Follow these steps to get your development environment set up:

1. Clone the Repository: `git clone https://github.com/FinanceFriend/backend.git`
2. Navigate to the Directory
3. Install Dependencies: `npm install`
4. Set Up Environment Variables:
   - Create a `.env` file in the root of your project.
   - Add your MongoDB URI and other necessary environment variables. Example:
     ```
     MONGODB_URI=your_mongodb_uri
     OPENAI_API_KEY=your_api_key
     PORT=3001
     ```
5. Start the Server: `npm start`
6. Verify Installation:
   - Open `http://localhost:3001` in your web browser. You should see a confirmation message indicating that the server is running.

## Setting Up Python Environment

To run the Python script with `langchain`, follow these steps:

1. Create a Virtual Environment:
   - Navigate to the Python project directory.
   - Create a virtual environment using: `python3 -m venv venv`
   - This will create a directory called `venv` in your project folder.

2. Activate the Virtual Environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS and Linux: `source venv/bin/activate`
   - Your command prompt should now indicate that you are in a virtual environment.

3. Install Python Dependencies:
   - With the virtual environment activated, install the required packages using: `pip install -r requirements.txt`

4. Run the Python Script:
   - With the dependencies installed, you can now run your Python script within the virtual environment.

5. Deactivate the Virtual Environment:
   - Once you're done, you can deactivate the virtual environment by simply running: `deactivate`

