import os
from dotenv import load_dotenv
import openai
from langchain.llms.openai import OpenAI
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.prompts import PromptTemplate
import sys, json

load_dotenv("../../../.env")
openai.api_key = os.getenv("OPENAI_API_KEY")

location_name = str(sys.argv[1])
friend_name = str(sys.argv[2])
friend_type = str(sys.argv[3])
module_name = str(sys.argv[4])
current_lesson_ind = int(sys.argv[5])
current_minilesson_ind = int(sys.argv[6])
current_block_ind = int(sys.argv[7])
user_age = int(sys.argv[8])
user_language = str(sys.argv[9])


#file_path = '../docs/' + location_name + '.json'
file_path = 'src/langchain/docs/' + location_name + '.json'

with open(file_path, 'r') as file:
    lessons = json.load(file)

lesson_name = lessons[current_lesson_ind]['name']
lesson = lessons[current_lesson_ind]

mini_lesson_name = lesson['mini_lessons'][current_minilesson_ind]['name']
mini_lesson_goal = lesson['mini_lessons'][current_minilesson_ind]['content']

llm = OpenAI(temperature=0, model_name='gpt-3.5-turbo-instruct', max_tokens=1024)

# Define response schemas for the quiz question components
response_schemas = [
    ResponseSchema(name="question", description="The quiz question text"),
    ResponseSchema(name="type", description="The type of question (True/False, Multiple Choice, Fill-in-the-Blank)"),
    ResponseSchema(name="correct_answer", description="The correct answer for the quiz question"),
    ResponseSchema(name="options", description="A list of options for multiple choice questions written as a list of strings")
]

# Create an output parser from the response schemas
output_parser = StructuredOutputParser.from_response_schemas(response_schemas)


format_instructions = output_parser.get_format_instructions()

quiz_prompt_template = """
    Generate a 5-question quiz from the provided lecture content. Format each question as a JSON object with 'type', 'question', 'correct_answer', and 'options' (if applicable). Include two True/False questions, two multiple-choice questions with four options each, and one fill-in-the-blank question.

    Ensure that the True/False statements and Fill-in-the-Blank questions are factual based on the lecture content. For multiple-choice questions, only one option should be correct. IF OPTIONS ARE PRESENT, THEY SHOULD BE WRITTEN AS A LIST OF STRINGS. Correct answer must be included in options.

    Tailor the questions to suit {user_age}-year-olds and write them in {user_language}. 

    As {friend_name}, a {friend_type} living in {location_name}, you are educating children about finance and {module_name}.

    Lecture Content for Quiz: {mini_lesson_goal}

    {format_instructions}

    Always denote currency exclusively in Euros.
    Present the final output as a list of JSON objects, enclosed in square brackets.
"""


prompt = PromptTemplate(
    input_variables=["location_name", "friend_name", "friend_type", "module_name", "mini_lesson_goal", "user_age", "user_language", "format_instructions"],
    template=quiz_prompt_template
)

final_prompt = prompt.format(
    friend_name=friend_name,
    friend_type=friend_type,
    location_name=location_name,
    module_name=module_name,
    user_age=user_age,
    user_language=user_language,
    mini_lesson_goal=mini_lesson_goal,
    format_instructions=format_instructions
)

output = llm(final_prompt)
print(json.dumps(output))

sys.stdout.flush()