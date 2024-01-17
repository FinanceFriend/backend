import os
from langchain.llms.openai import OpenAI
#from dotenv import load_dotenv
import openai
from langchain.prompts import PromptTemplate
import sys, json

#load_dotenv("../../../.env")
openai.api_key = os.getenv("OPENAI_API_KEY")

llm = OpenAI(temperature=0.2, model_name = 'gpt-3.5-turbo-instruct', max_tokens=1024)

location_name = str(sys.argv[1])
friend_name = str(sys.argv[2])
friend_type = str(sys.argv[3])
module_name = str(sys.argv[4])
current_lesson_ind = int(sys.argv[5])
current_minilesson_ind = int(sys.argv[6])
current_block_ind = int(sys.argv[7])
user_age = int(sys.argv[8])
user_language = str(sys.argv[9])

block = []
block.append(f"""
    We are just starting to talk about this part of the lesson, so first thing you should explain to user is: 
    
    Introduction and Explanation
    - Playfully explain the mini-lesson's content from theoretical standpoint, ensuring it's understandable and engaging.
    - Incorporate elements of {location_name} and interactions with {friend_name} the {friend_type} or related characters for an immersive experience but don't introduce them.
""")
block.append(f"""

    Let's say that student is already familiar with the concept of the current minilesson. Continue your conversation with the following: 

    - Create an imaginative scenario in {location_name} where the mini-lesson content is applied. This scenario is entirely crafted by you, involving your own character and location. It is not a question, so don't ask the student anything. IT IS A STORY.
    - The scenario should be playful and relevant, encouraging interactive learning and problem-solving.
""")




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

    You are responding to a {user_age}-year-old. Language: {user_language}.

    You are teaching children about finance and {module_name}.

    Current mini-lesson is: {mini_lesson_name} and it is a part of {lesson_name}. Learning outcomes of this mini-lesson are: {mini_lesson_goal}
    
    {current_block}

    Note: Directly provide an explanation of the mini-lesson content without introductory greetings or welcoming phrases. The response should be straightforward and focused on the subject matter.

"""

prompt = PromptTemplate(
    input_variables=["lesson_name", "mini_lesson_name", "mini_lesson_goal", "module_name", "current_block", "user_age", "user_language"],
    template= templateText
)

final_prompt = prompt.format(
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