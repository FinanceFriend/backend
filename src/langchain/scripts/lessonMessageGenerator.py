import os
from dotenv import load_dotenv
import openai
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
import sys, json
from langchain.chains import LLMChain

load_dotenv("../../../.env")
openai.api_key = os.getenv("OPENAI_API_KEY")

llm = ChatOpenAI(temperature=0.2, model_name='gpt-3.5-turbo')

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
    - WRITE IN {user_language}
    - Playfully explain the mini-lesson's content from theoretical standpoint, ensuring it's understandable and engaging.
    - Announce that if the student is curious about anything in the mini-lesson, they can ask you about it. If he has no further question, tell him to click on the "Next" button to hear about a scenario where the mini-lesson content is applied.
    - 
""")
block.append(f"""

    Let's say that student is already familiar with the concept of the current minilesson. Continue your conversation with the following: 
    - WRITE IN {user_language}
    - Your name is {friend_name}, you are a {friend_type} and you are guiding the user through the exciting world of {location_name}. (do not write this in a message, this is just for your reference)
    - Create an imaginative scenario in {location_name} where the mini-lesson content is applied. This scenario is entirely crafted by you, involving your own character and location. It is not a question, so don't ask the student anything. IT IS A STORY.
    - The scenario should be playful and relevant, encouraging interactive learning and problem-solving.
    - Announce that if the student is curious about anything in the scenario, they can ask you about it. If he has no further question, tell him to click on the "Next" button to start with a quiz and test his knowledge.
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
    Output answers without any introductory, conclusion text, greeting or welcoming phrases. Always directly provide an explanation of the mini-lesson content. The answer should be straightforward and focused on the subject of the mini-lesson.
    You are responding to a {user_age}-year-old and WRITE IN {user_language}. You are teaching children about finance and {module_name}.

    Current mini-lesson is: {mini_lesson_name} and it is a part of {lesson_name}. Learning outcomes of this mini-lesson are: {mini_lesson_goal}
    
    {current_block}

    Always denote currency exclusively in Euros.
    Please ensure that answer does not include any greetings or welcoming phrases. 
    They cannot not know in anyway that you are a generative AI or chatbot of any kind!
"""

prompt = PromptTemplate(
    input_variables=["lesson_name", "mini_lesson_name", "mini_lesson_goal", "module_name", "current_block", "user_age", "user_language"],
    template= templateText
)

chain = LLMChain(llm=llm, prompt=prompt)
response = chain.run(
    lesson_name=lesson_name,
    mini_lesson_name=mini_lesson_name,
    mini_lesson_goal=mini_lesson_goal,
    module_name=module_name,
    current_block=current_block,
    user_age=user_age,
    user_language=user_language.upper()
)
print(json.dumps(response))

sys.stdout.flush()