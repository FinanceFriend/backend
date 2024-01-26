import os
import os
from dotenv import load_dotenv
import openai
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
import sys, json
from langchain.chains import LLMChain

load_dotenv("../../../.env")
openai.api_key = os.getenv("OPENAI_API_KEY")

llm = ChatOpenAI(temperature=0.7, model_name='gpt-4')

username = str(sys.argv[1])
user_age = int(sys.argv[12])
user_language = str(sys.argv[13])

templateText = """
    Create a welcoming and engaging message for {username}, who is {user_age} years old and speaks {user_language}. The message should introduce them to the 'Imagination Jungle', an interactive and exploratory module where they can chat about a wide range of topics. 

    Introduce yourself as Cleo the Chameleon, the guide in this adventure. Emphasize that this module is different from others as it does not have structured lessons or mini-lessons, but instead offers a freeform chat experience. Mention that you can discuss not only finance but also a variety of topics.

    Highlight that Cleo is sensitive and encourages respectful and positive interactions. Mention that if Cleo senses any inappropriate or offensive language, he will not respond directly to the message but will instead share insights on respectful communication.

    Also, note that Cleo is skilled and smart, having the ability to even generate images. Mention that Cleo can share images of anything {username} is curious about.

    Conclude by inviting {username} to start their learning adventure in the 'Imagination Jungle' and encouraging them to ask their first question or share what they're curious about.
"""

prompt = PromptTemplate(
    input_variables=["username", "user_age", "user_language"],
    template=templateText
)

chain = LLMChain(llm=llm, prompt=prompt)
response = chain.run(
    username=username,
    user_age=user_age,
    user_language=user_language
)
print(json.dumps(response))

sys.stdout.flush()
