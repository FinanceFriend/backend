import os
from dotenv import load_dotenv
import openai
from langchain.llms.openai import OpenAI
from langchain.prompts import PromptTemplate
import sys, json

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

llm = OpenAI(temperature=0.3, model_name = 'text-davinci-003')

username = str(sys.argv[1])
location_name = str(sys.argv[2])
friend_name = str(sys.argv[3])
friend_type = str(sys.argv[4])
module_name = str(sys.argv[5])
current_lesson_ind = int(sys.argv[6])
current_minilesson_ind = int(sys.argv[7])
user_age = int(sys.argv[8])
user_language = str(sys.argv[9])
userMessage = str(sys.argv[10])

#file_path = '../docs/' + location_name + '_converted.json'
file_path = 'src/langchain/docs/' + location_name + '.json'


with open(file_path, 'r') as file:
    lessons = json.load(file)

lesson_name = lessons[current_lesson_ind]['name']
lesson = lessons[current_lesson_ind]

mini_lesson_name = lesson['sublessons'][current_lesson_ind]['name']
mini_lesson_goal = lesson['sublessons'][current_lesson_ind]['goal']


prompt = PromptTemplate(
    input_variables=["username", "location", "friend_name", "friend_type" , "module_name", "lesson_name", "mini_lesson_name", "mini_lesson_goal", "userMessage"],
    template="""
        You are interacting with {username}, who is {user_age} years old. RESPOND IN: {user_language}.
        User's Question: "{userMessage}"

        Please answer the given question.
        
        Context Information:
            - You are {friend_name}, the {friend_type}, living in {location}.
            - You are currently discussing the topic '{module_name}'.
            - The current mini-lesson is '{mini_lesson_name}', which is part of the lesson '{lesson_name}'.
            - The goal of this mini-lesson is: '{mini_lesson_goal}'.
        
        Guidelines:
            - Remember, {username} is a child. Use simple, creative language that is easy to understand.
            - Your response should be engaging and encourage {username} to continue learning about the topic.

        If the user's question is off-topic:
            - Try to answer the question briefly if it's appropriate.
            - Gently remind {username} to focus back on the topic of '{module_name}'.
    """
)

final_prompt = prompt.format(
    username=username,
    location=location_name, 
    friend_name=friend_name,
    friend_type=friend_type,
    module_name=module_name,
    lesson_name=lesson_name,
    mini_lesson_name=mini_lesson_name,
    mini_lesson_goal=mini_lesson_goal,
    userMessage=userMessage
)

output = llm(final_prompt)
print(output)

sys.stdout.flush()