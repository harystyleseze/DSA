from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from secret_ai_sdk.secret_ai import ChatSecret
from secret_ai_sdk.secret import Secret
import os
import json
from dotenv import load_dotenv

# Initialize the FastAPI app
app = FastAPI(
    title="Delegated Staking Agent Chat API",
    description="API for chat-based assistance regarding grants data",
    version="1.0.0"
)

# Load environment variables from the .env file
load_dotenv()

# Allow CORS requests from the frontend (e.g., Next.js on localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "https://dsa-snowy.vercel.app", "https://dsa-harrison-ezes-projects.vercel.app", "https://dsa-git-main-harrison-ezes-projects.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Secret AI SDK client
secret_client = Secret()
models = secret_client.get_models()
urls = secret_client.get_urls(model=models[0])

secret_ai_llm = ChatSecret(
    base_url=urls[0],
    model=models[0],
    temperature=1.0
)

# Global variable to store grants data
grants_data = {}

# Helper function to load the grants data from db.json
def load_grants_data():
    global grants_data
    try:
        if os.path.exists("../db.json"):
            with open("../db.json", "r") as f:
                grants_data = json.load(f)
            print("Grants data loaded successfully")
        else:
            print("db.json file not found.")
            grants_data = {}  # Set grants data to an empty dictionary if file is missing
    except Exception as e:
        print(f"Error loading grants data: {e}")
        grants_data = {}

# # Helper function to format context based on grants data
# def create_context(grants_data):
#     granter_grants = "\n".join([f"Granter: {grant['granter']}, Permission: {grant['permission']}, Expiration: {grant['expiration']}" for grant in grants_data.get('granterGrants', [])])
#     grantee_grants = "\n".join([f"Grantee: {grant['grantee']}, Permission: {grant['permission']}, Expiration: {grant['expiration']}" for grant in grants_data.get('granteeGrants', [])])
    
#     context = f"Granter Grants:\n{granter_grants}\n\nGrantee Grants:\n{grantee_grants}"
#     return context
# Helper function to format context based on grants data
def create_context(grants_data):
    # Generate detailed granter grants information
    granter_grants = "\n".join([f"Granter Address: {grant['granter']}, Permission: {grant['permission']}, Expiration Date: {grant['expiration']}" 
                               for grant in grants_data.get('granterGrants', [])])

    # Generate detailed grantee grants information
    grantee_grants = "\n".join([f"Grantee Address: {grant['grantee']}, Permission: {grant['permission']}, Expiration Date: {grant['expiration']}" 
                               for grant in grants_data.get('granteeGrants', [])])

    # Create a context that the AI can use to respond with relevant information
    context = f"""
    ### DSA Grants Overview:
    Below is the summary of the current grants:
    
    ### Granter Grants:
    {granter_grants}

    ### Grantee Grants:
    {grantee_grants}

    Please note:
    - The granter assigns permissions to the grantee, such as "Withdraw Delegator Reward", "Vote", or "Send Tokens".
    - The grantee, in turn, receives permissions like "Delegate" or "Vote" that are set to expire on specific dates.
    
    Respond to any user questions based on this data, and clarify specific permissions or expiration dates only when asked.
    """
    return context

# Request model to receive user message
class UserMessage(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_with_agent(user_message: UserMessage):
    # Load grants data if not already loaded
    if not grants_data:
        load_grants_data()
        if not grants_data:
            raise HTTPException(status_code=500, detail="Failed to load grants data from db.json")
    
    # Create context based on the grants data
    context = create_context(grants_data)
    
    # Combine the user message with the context
    messages = [
        ("system", "You are a delegated staking agent. Answer questions about granter and grantee grants."),
        ("human", user_message.message),
        ("system", context),  # Adding context to assist the AI
    ]
    
    try:
        # Get response from Secret AI model
        response = secret_ai_llm.invoke(messages, stream=False)
        print(f"AI Response: {response.content}")

        # If the message contains a direct request for information, provide it. Otherwise, prompt the user for clarification.
        if 'grants' in user_message.message.lower() or 'permission' in user_message.message.lower():
            return {"content": response.content}
        else:
            return {
                "content": "Hi! How can I assist you with your delegated staking and grants today? Feel free to ask me a question, and I'll be happy to help. 😊"
            }

    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail="Error processing your request. Please try again later.")

# Add environment variable support
port = int(os.getenv("PORT", 8000))
host = os.getenv("HOST", "0.0.0.0")

if __name__ == "__main__":
    # Load grants data when the app starts
    load_grants_data()
    import uvicorn
    uvicorn.run(app, host=host, port=port)
