import os
from dotenv import load_dotenv
import openai
from langchain.llms.openai import OpenAI
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.prompts import PromptTemplate
import sys, json

load_dotenv("../../../.env")
openai.api_key = os.getenv("OPENAI_API_KEY")

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
file_path = 'src/langchain/docs/' + location_name + '_converted.json'

with open(file_path, 'r') as file:
    lessons = json.load(file)

lesson_name = lessons[current_lesson_ind]['name']
lesson = lessons[current_lesson_ind]

mini_lesson_name = lesson['sublessons'][current_minilesson_ind]['name']
mini_lesson_goal = lesson['sublessons'][current_minilesson_ind]['goal']

llm = OpenAI(temperature=0, model_name='text-davinci-003', max_tokens=1024)

# Define response schemas for the quiz question components
response_schemas = [
    ResponseSchema(name="question", description="The quiz question text"),
    ResponseSchema(name="type", description="The type of question (True/False, Multiple Choice, Fill-in-the-Blank)"),
    ResponseSchema(name="correct_answer", description="The correct answer for the quiz question"),
    ResponseSchema(name="options", description="A list of options for multiple choice questions")
]

# Create an output parser from the response schemas
output_parser = StructuredOutputParser.from_response_schemas(response_schemas)


format_instructions = output_parser.get_format_instructions()

quiz_prompt_template = """
    Create a 5-question quiz based on the following lecture content. Each question should be formatted as a JSON object, including fields for 'type', 'question', 'correct_answer', and 'options' (if applicable). Two questions should be True/False, two should be multiple choice, and one should be fill-in-the-blank.

    True/False should be statements that are either true or false. Multiple choice questions should have 4 options, one of which is the correct answer.
    Fill-in-the-blank questions should have a phrase "BLANK" where the answer should be inserted. That should be true statements with one word or phrase missing.
    
    The questions should be written in {user_language}. The questions should be written in a way that is appropriate for {user_age}-year-olds.

    You are {friend_name}, the friendly and knowledgeable {friend_type} living in {location_name}. You are teaching children about finance and {module_name}.

    User Name: {username}

    Lecture Content: {mini_lesson_goal}

    {format_instructions}
    
    Wrap your final output with closed and open brackets (a list of json objects)
"""

prompt = PromptTemplate(
    input_variables=["username", "location_name", "friend_name", "friend_type", "module_name", "mini_lesson_goal", "user_age", "user_language", "format_instructions"],
    template=quiz_prompt_template
)

final_prompt = prompt.format(
    friend_name=friend_name,
    friend_type=friend_type,
    location_name=location_name,
    module_name=module_name,
    username=username,
    user_age=user_age,
    user_language=user_language,
    mini_lesson_goal=mini_lesson_goal,
    format_instructions=format_instructions
)

output = llm(final_prompt)
print(json.dumps(output))

sys.stdout.flush()