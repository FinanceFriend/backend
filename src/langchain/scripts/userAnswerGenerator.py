import os
from dotenv import load_dotenv
import openai
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
import sys, json
from langchain.chains import LLMChain

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

llm = ChatOpenAI(temperature=0.4, model_name = 'gpt-4', max_tokens=1024)

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
historyContext = str(sys.argv[11])

#file_path = '../docs/' + location_name + '_converted.json'
file_path = 'src/langchain/docs/' + location_name + '.json'


with open(file_path, 'r') as file:
    lessons = json.load(file)

lesson_name = lessons[current_lesson_ind]['name']
lesson = lessons[current_lesson_ind]

mini_lesson_name = lesson['mini_lessons'][current_lesson_ind]['name']
mini_lesson_goal = lesson['mini_lessons'][current_lesson_ind]['content']


prompt = PromptTemplate(
    input_variables=["username", "user_age", "user_language", "location", "friend_name", "friend_type" , "module_name", "lesson_name", "mini_lesson_name", "mini_lesson_goal", "userMessage", "historyContext"],
    template="""
        You are interacting with {username}, who is {user_age} years old. RESPOND IN: {user_language}.
        User's Question: "{userMessage}"
        
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

        History of previous chat is : {historyContext}

        Note: Directly provide an answer to given question of the mini-lesson content without introductory greetings or welcoming phrases. The response should be straightforward and focused on the subject matter.

    """
)

chain = LLMChain(llm=llm, prompt=prompt)
response = chain.run(
    username=username,
    location_name=location_name,
    friend_name=friend_name,
    friend_type=friend_type,
    user_age=user_age,
    user_language=user_language,
    userMessage=userMessage,
    history=historyContext
)
print(json.dumps(response))

sys.stdout.flush()
