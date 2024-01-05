import os
from dotenv import load_dotenv
import openai
from langchain.llms.openai import OpenAI
from langchain.prompts import PromptTemplate
import sys, json

load_dotenv("../../../.env")
openai.api_key = os.getenv("OPENAI_API_KEY")

llm = OpenAI(temperature=0.2, model_name = 'text-davinci-003', max_tokens=1024)

block = []
block.append("""
    We are just starting to talk about this part of the lesson, so first thing you should explain to user is: 

    Introduction and Explanation
    - Playfully explain the mini-lesson's content from theoretical standpoint, ensuring it's understandable and engaging.
    - Incorporate elements of Numberland and interactions with Cal or related characters for an immersive experience.
""")
block.append("""

    Let's say that student is already familiar with the concept of the current minilesson. Continue your conversation with the following: 

    - Create an imaginative scenario in Numberland where the mini-lesson content is applied. This scenario is entirely crafted by you, involving your own character and location. It is not a question, so don't ask the student anything. IT IS A STORY.
    - The scenario should be playful and relevant, encouraging interactive learning and problem-solving.
""")

username = str(sys.argv[1])
location_name = str(sys.argv[2])
friend_name = str(sys.argv[3])
friend_type = str(sys.argv[4])
module_name = str(sys.argv[5])
current_lesson_ind = int(sys.argv[6])
current_minilesson_ind = int(sys.argv[7])
current_block_ind = int(sys.argv[8])
user_age = int(sys.argv[9])
user_language = str(sys.argv[10])


#file_path = '../docs/' + location_name + '_converted.json'
file_path = 'src/langchain/docs/' + location_name + '.json'


with open(file_path, 'r') as file:
    lessons = json.load(file)

lesson_name = lessons[current_lesson_ind]['name']
lesson = lessons[current_lesson_ind]

mini_lesson_name = lesson['mini_lessons'][current_minilesson_ind]['name']
mini_lesson_goal = lesson['mini_lessons'][current_minilesson_ind]['content']
current_block = block[current_block_ind]

templateText = """
    You are responding to {username}, a {user_age}-year-old. PLEASE WRITE IN LANGUAGE: {user_language}.

    You are {friend_name}, the friendly and knowledgeable {friend_type} living in {location_name}. You are teaching children about finance and {module_name}.

    Current mini-lesson is: {mini_lesson_name} and it is a part of {lesson_name}. Learning outcomes of this mini-lesson are: {mini_lesson_goal}
    
    {current_block}

    Remember user is a kid so be creative and use words that he/she will understand!
"""

prompt = PromptTemplate(
    input_variables=["username", "location_name", "friend_name", "friend_type", "lesson_name", "mini_lesson_name", "mini_lesson_goal", "module_name", "current_block", "user_age", "user_language"],
    template= templateText
)

final_prompt = prompt.format(
    username=username,
    location_name=location_name, 
    friend_name=friend_name,
    friend_type=friend_type,
    lesson_name=lesson_name,
    mini_lesson_name=mini_lesson_name,
    mini_lesson_goal=mini_lesson_goal,
    module_name=module_name,
    current_block=current_block,
    user_age=user_age,
    user_language=user_language
)

output = llm(final_prompt)
print(json.dumps(output))

sys.stdout.flush()