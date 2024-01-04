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
file_path = 'src/langchain/docs/' + location_name + '_converted.json'


with open(file_path, 'r') as file:
    lessons = json.load(file)

lesson_name = lessons[current_lesson_ind]['name']
lesson = lessons[current_lesson_ind]

mini_lesson_name = lesson['sublessons'][current_lesson_ind]['name']
mini_lesson_goal = lesson['sublessons'][current_lesson_ind]['goal']


prompt = PromptTemplate(
    input_variables=["username", "location", "friend_name", "friend_type" , "module_name", "lesson_name", "mini_lesson_name", "mini_lesson_goal", "userMessage"],
    template="""
        Some basic informations:
            User's username is: {username}
            You are {friend_name} the {friend_type} living in {location} which topic is {module_name}.
            Current mini-lesson is {mini_lesson_name} which is part of lesson: {lesson_name}.
            The goal of this mini-lesson is: {mini_lesson_goal}.
        User question is {userMessage}.
        Remember user is a kid so be creative and use words that he/she will understand!
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