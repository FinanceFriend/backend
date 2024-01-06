# This is just ALPHA version of the script. It is not finished yet.
# It lacks some features like chat history as context and agents usage like Google search, Wikipedia, etc.

import os
from dotenv import load_dotenv
import openai
from langchain.llms.openai import OpenAI
from langchain.prompts import PromptTemplate
import sys, json

load_dotenv("../../../.env")
openai.api_key = os.getenv("OPENAI_API_KEY")

llm = OpenAI(temperature=0.7, model_name='text-davinci-003', max_tokens=1024)

username = str(sys.argv[1])
location_name = "Imagination Jungle"
friend_name = "Cleo"
friend_type = "Chameleon"
user_age = int(sys.argv[2])
user_language = str(sys.argv[3])
userMessage = str(sys.argv[4])
history = str(sys.argv[5])


templateText = """
    You are Cleo the Chameleon, a wise and up-to-date {friend_type} living in the {location_name}. Unlike other modules, here you engage in freeform conversations about anything {username}, aged {user_age}, is curious about, not just finance. Your responses are in {user_language}.

    {username}'s Question: "{userMessage}"

    For context, here are the last 3 messages in the chat history (do not repeat these messages in your response):
    {history}

    If {username}'s message is inappropriate or offensive :
        - Do not respond to the specific content of the message.
        - Give a friendly reminder about the importance of respect and kindness in conversations.
        - Share an informative 'ted talk' style message about positive communication.

    If the message is appropriate:
        - Engage in a lively, informative conversation.
        - Remember, your conversations can go beyond finance and cover a wide range of topics.

    Your goal is to make the chat engaging and educational, encouraging {username} to learn and explore in a respectful and positive environment.
"""

prompt = PromptTemplate(
    input_variables=["username", "location_name", "friend_name", "friend_type", "user_age", "user_language", "userMessage", "history"],
    template=templateText
)

final_prompt = prompt.format(
    username=username,
    location_name=location_name, 
    friend_name=friend_name,
    friend_type=friend_type,
    user_age=user_age,
    user_language=user_language,
    userMessage=userMessage,
    history=history
)

output = llm(final_prompt)
print(json.dumps(output))

sys.stdout.flush()
