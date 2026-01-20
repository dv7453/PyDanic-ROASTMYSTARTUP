import asyncio
import os
import sys

# Add the current directory to sys.path so we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.agents import pitch_decomposition_agent, MODEL_NAME
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

async def main():
    print(f"Testing agents with model: {MODEL_NAME}")
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("Error: OPENROUTER_API_KEY not found.")
        return

    print("API Key found (masked):", api_key[:10] + "...")

    sample_pitch = "We are building the Uber for dog walking but on the blockchain."
    print(f"\nRunning decomposition on: '{sample_pitch}'")
    
    try:
        result = await pitch_decomposition_agent.run(sample_pitch)
        print("\nSuccess! Result type:", type(result))
        print("Result attributes:", dir(result))
        # print(result.data.model_dump_json(indent=2)) 
    except Exception as e:
        print(f"\nError running agent: {e}")

if __name__ == "__main__":
    asyncio.run(main())
