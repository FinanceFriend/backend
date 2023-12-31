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
location = str(sys.argv[2])
friend_name = str(sys.argv[3])
friend_type = str(sys.argv[4])
lesson_index = int(sys.argv[5])
mini_lesson_index = int(sys.argv[6])

file_path = '../docs/' + location + '_converted.json'


with open(file_path, 'r') as file:
    lessons = json.load(file)

lesson_name = lessons[lesson_index]['name']
lesson = lessons[lesson_index]

mini_lesson_name = lesson['sublessons'][mini_lesson_index]['name']
mini_lesson_goal = lesson['sublessons'][mini_lesson_index]['goal']


prompt = PromptTemplate(
    input_variables=["username", "location", "friend_name", "friend_type", "lesson_name", "mini_lesson_name", "mini_lesson_goal"],
    template="""
        User's username is: {username}
        You are {friend_name} the {friend_type} living in {location}.
        Current mini-lesson is {mini_lesson_name} which is part of lesson: {lesson_name}.
        The goal of this mini-lesson is: {mini_lesson_goal}.
        Remember you explain this lesson to kids so be creative and use words that they will understand!
    """
)

final_prompt = prompt.format(
    username=username,
    location=location, 
    friend_name=friend_name,
    friend_type=friend_type,
    lesson_name=lesson_name,
    mini_lesson_name=mini_lesson_name,
    mini_lesson_goal=mini_lesson_goal
)

output = llm(final_prompt)
print(output)

sys.stdout.flush()