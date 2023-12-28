import os
from dotenv import load_dotenv
import openai
from langchain.llms.openai import OpenAI
from langchain.prompts import PromptTemplate
import sys, json

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

lesson_index = int(sys.argv[1])
mini_lesson_index = int(sys.argv[2])


with open('src/langchain/docs/Numberland_converted.json', 'r') as file:
    lessons = json.load(file)

lesson = lessons[lesson_index]
sublesson = lesson['sublessons'][mini_lesson_index]

llm = OpenAI(temperature=0, model_name = 'text-davinci-003')

prompt = PromptTemplate(
    input_variables=["text"],
    template="Explain the following to a child in simple terms:\n{text}"
)

query = sublesson['name'] + ' ' + sublesson['goal']

final_prompt = prompt.format(text=query)
output = llm(final_prompt)
print(output)

sys.stdout.flush()