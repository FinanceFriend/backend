import os
from dotenv import load_dotenv
import openai
from langchain.chat_models import ChatOpenAI
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain.prompts import PromptTemplate
import sys, json
from langchain.chains import LLMChain

load_dotenv("../../../.env")
openai.api_key = os.getenv("OPENAI_API_KEY")

question = str(sys.argv[1])
userAnswer = str(sys.argv[2])
userLanguage = str(sys.argv[3])
correctAnswerExample = str(sys.argv[4])

llm = ChatOpenAI(temperature=0, model_name='gpt-4', max_tokens=1024)

# Define response schemas for the quiz question components
response_schemas = [
    ResponseSchema(name="evaluation", description="The evaluation of the user's answer to the quiz question. The evaluation should be a string with one of the following values: 'correct', 'incorrect'"),
    ResponseSchema(name="explanation", description="The explanation for the evaluation of the user's answer to the quiz question. The explanation should be a string.")
]

# Create an output parser from the response schemas
output_parser = StructuredOutputParser.from_response_schemas(response_schemas)


format_instructions = output_parser.get_format_instructions()

quiz_prompt_template = """
    Given the question:
    {question}
    Decide if the following answer is relevant and correct: 
    {userAnswer}
    Be strict. 

    Example of a correct answer: {correctAnswerExample}

    Questions and answers are written in {userLanguage}. Use {userLanguage} in evaluation JSON values. Keep the key names as they are. Do not print anything else.

    If the retrieved context is correct, evaluate the user's answer as correct. Otherwise, evaluate the user's answer as incorrect. Provide an explanation for the evaluation of the user's answer.

    Present the final output as a JSON object with key-value pairs of evaluation:Boolean and explanation:String.
"""


prompt = PromptTemplate(
    input_variables=["question", "userAnswer", "userLanguage", "correctAnswerExample"],
    template=quiz_prompt_template
)

chain = LLMChain(llm=llm, prompt=prompt)
response = chain.run(
    question=question,
    userAnswer=userAnswer,
    userLanguage=userLanguage,
    correctAnswerExample=correctAnswerExample
)
print(json.dumps(response))

sys.stdout.flush()