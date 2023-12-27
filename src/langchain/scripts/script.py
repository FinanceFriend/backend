import os
from dotenv import load_dotenv
import openai
from langchain.llms.openai import OpenAI
from langchain.prompts import PromptTemplate
import re, pdfplumber, sys, json

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

lesson_index = int(sys.argv[1])
mini_lesson_index = int(sys.argv[2])

with pdfplumber.open('src/langchain/docs/Savings.pdf') as pdf:
    full_text = ''
    for page in pdf.pages:
        full_text += page.extract_text()

# Split the text by weeks
week_pattern = r'Week \d+:'
weeks = re.split(week_pattern, full_text)[1:]  # Skipping the first split as it's likely empty

# Initialize a 2D array for weeks and lessons
week_lessons = []

for week in weeks:
    # Extract mini-lessons for each week
    lesson_pattern = r'Mini-Lesson \d+: (.*?)\n• Content: (.*?)(?=\nMini-Lesson \d+:|\Z)'
    lessons = re.findall(lesson_pattern, week, re.DOTALL)
    week_lessons.append(lessons)


llm = OpenAI(temperature=0, model_name = 'text-davinci-003')

prompt = PromptTemplate(
    input_variables=["text"],
    template="Explain the following to a child in simple terms:\n{text}"
)

lesson_title, lesson_content = week_lessons[lesson_index][mini_lesson_index]
query = lesson_title + ": " + lesson_content

final_prompt = prompt.format(text=query)
output = llm(final_prompt)
print(output)

sys.stdout.flush()