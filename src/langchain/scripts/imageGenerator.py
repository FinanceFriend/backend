from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.llms import OpenAI
from langchain_community.utilities.dalle_image_generator import DallEAPIWrapper
from dotenv import load_dotenv
import sys

load_dotenv("../../../.env")

llm = OpenAI(temperature=0.4)

query = str(sys.argv[1])

prompt = PromptTemplate(
    input_variables=["image_desc"],
    template="Generate a prompt to generate an image based on the following description: {image_desc}",
)
chain = LLMChain(llm=llm, prompt=prompt)
image_url = DallEAPIWrapper().run(chain.run(query))
print(image_url)