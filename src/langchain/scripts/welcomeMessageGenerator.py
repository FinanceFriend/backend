import os
from dotenv import load_dotenv
import openai
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
import sys, json
from langchain.chains import LLMChain

load_dotenv("../../../.env")
openai.api_key = os.getenv("OPENAI_API_KEY")

llm = ChatOpenAI(temperature=0.7, model_name='gpt-3.5-turbo')


username = str(sys.argv[1])
location_name = str(sys.argv[2])
friend_name = str(sys.argv[3])
friend_type = str(sys.argv[4])
module_name = str(sys.argv[5])
module_description_kids = str(sys.argv[6])
module_description_parents = str(sys.argv[7])
progress = float(sys.argv[8])
current_lesson_ind = int(sys.argv[9])
current_minilesson_ind = int(sys.argv[10])
current_block_ind = int(sys.argv[11])
user_age = int(sys.argv[12])
user_language = str(sys.argv[13])


#file_path = '../docs/' + location_name + '.json'
file_path = 'src/langchain/docs/' + location_name + '.json'


with open(file_path, 'r') as file:
    lessons = json.load(file)

lesson_name = lessons[current_lesson_ind]['name']
lesson = lessons[current_lesson_ind]

mini_lesson_name = lesson['mini_lessons'][current_minilesson_ind]['name']
mini_lesson_goal = lesson['mini_lessons'][current_minilesson_ind]['content']


templateText = """
    Create an engaging and age-appropriate message for {username}, a {user_age}-year-old starting their journey in the {module_name} module. The message should be written in {user_language}.

    Introduce yourself as {friend_name}, the {friend_type}, guiding {username} through the exciting world of {location_name}. For the child-friendly part, make the message lively and fun, similar to: {module_description_kids}.

    Also, include a more theoretical description for the parents, explaining the educational value and learning outcomes of {module_name}. This part should detail how the module will enhance their child's understanding of financial concepts, like in the parent-focused description: '{module_description_parents}'.

    End the message by encouraging {username} to begin their learning adventure, emphasizing that it will be both enjoyable and informative, and reassure them that you, {friend_name}, will be there to guide and support them in their educational journey. Try to make not too long. 
""" if progress == 0 else """
    Create a motivational and engaging message for {username}, a {user_age}-year-old, who is resuming their journey in the {module_name} module, written in {user_language}.

    Start by warmly welcoming back {username} to {location_name}. Mention that they are currently at an exciting stage, in middle of lesson {lesson_name}, mini-lesson {mini_lesson_name}, and are now ready to tackle the next part of their adventure learning about {mini_lesson_goal}. 

    Highlight how much they've already learned about {module_description_kids} and how this knowledge is helping them become a little financial genius. Encourage them to keep up the great work, reminding them of the fun and interactive activities that await in the next lessons.

    Keep the message short.
"""


prompt = PromptTemplate(
    input_variables=["username", "location_name", "friend_name", "friend_type", "module_name", "module_description_kids", "module_description_parents", "user_age", "user_language"] if progress == 0 else ["username", "location_name", "friend_name", "friend_type", "lesson_name", "mini_lesson_name", "mini_lesson_goal", "module_name", "module_description_kids", "user_age", "user_language"],
    template= templateText
)

chain = LLMChain(llm=llm, prompt=prompt)
response = chain.run(
    username=username,
    location_name=location_name, 
    friend_name=friend_name,
    friend_type=friend_type,
    module_name=module_name,
    module_description_kids=module_description_kids,
    module_description_parents=module_description_parents,
    user_age=user_age,
    user_language=user_language
) if progress == 0 else chain.run(
    username=username,
    location_name=location_name, 
    friend_name=friend_name,
    friend_type=friend_type,
    lesson_name=lesson_name,
    mini_lesson_name=mini_lesson_name,
    mini_lesson_goal=mini_lesson_goal,
    module_name=module_name,
    module_description_kids=module_description_kids,
    user_age=user_age,
    user_language=user_language
)
print(json.dumps(response))

sys.stdout.flush()