# this is just a test script to see if the agent works and how well it picks which tool to use

from langchain.agents import load_tools
from langchain.agents import initialize_agent
import openai
from langchain.llms.openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv("../../../.env")
openai.api_key = os.getenv("OPENAI_API_KEY")

llm = OpenAI(temperature=0)
tools = load_tools(["wikipedia", "dalle-image-generator"])

agent = initialize_agent(tools, 
                        llm, 
                        agent = "zero-shot-react-description",
                        verbose=True)

agent.run("Create an image of a cat in a hat.")