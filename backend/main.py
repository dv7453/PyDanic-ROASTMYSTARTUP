from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncio

from .models import (
    PitchAnalysis,
    Assumption,
    AssumptionsList,
    FailureSimulation,
    RoastRound,
    Verdict
)
from .agents import (
    pitch_decomposition_agent,
    assumption_extraction_agent,
    failure_simulation_agent,
    vc_roast_agent,
    verdict_agent
)

app = FastAPI(title="Roast My Startup Idea")

from fastapi.responses import JSONResponse
from pydantic_ai.exceptions import ModelHTTPError, UnexpectedModelBehavior

@app.exception_handler(ModelHTTPError)
async def model_http_error_handler(request, exc):
    print(f"Model HTTP Error: {exc}")
    return JSONResponse(
        status_code=exc.status_code or 502,
        content={
            "error": "LLM Provider Error",
            "detail": exc.message,
            "model": exc.model_name,
            "upstream_code": exc.status_code
        }
    )

@app.exception_handler(UnexpectedModelBehavior)
async def unexpected_model_behavior_handler(request, exc):
    print(f"Unexpected Model Behavior: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Agent Logic Error",
            "detail": str(exc),
            "hint": "The model return invalid JSON or halted unexpectedly."
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    print(f"Global Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "detail": "Internal Server Error - Check Backend Logs"}
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PitchRequest(BaseModel):
    pitch: str
    intensity: str = "Normal" # or "Brutal"

class RoastResponse(BaseModel):
    analysis: PitchAnalysis
    assumptions: List[Assumption]
    failure_simulation: FailureSimulation
    roast_rounds: List[RoastRound]
    verdict: Verdict

@app.post("/analyze")
async def analyze_pitch(request: PitchRequest):
    from fastapi.responses import StreamingResponse
    import json

    async def event_generator():
        pitch = request.pitch
        intensity = request.intensity
        
        try:
            # Step 1: Decomposition
            yield json.dumps({"type": "log", "message": "Step 1: Decomposing pitch..."}) + "\n"
            decomposition_result = await pitch_decomposition_agent.run(pitch)
            analysis = decomposition_result.output
            
            # Step 2: Assumptions
            yield json.dumps({"type": "log", "message": "Step 2: Extracting hidden assumptions..."}) + "\n"
            assumptions_result = await assumption_extraction_agent.run(pitch)
            assumptions_list = assumptions_result.output.assumptions

            # Step 3: Failure Simulation
            yield json.dumps({"type": "log", "message": "Step 3: Simulating failure scenarios..."}) + "\n"
            failure_prompt = f"Pitch: {pitch}\n\nKey Components: {analysis.model_dump_json()}"
            failure_result = await failure_simulation_agent.run(failure_prompt)
            failure_sim = failure_result.output

            # Step 4: Roast Rounds
            yield json.dumps({"type": "log", "message": "Step 4: Initiating Roast Rounds..."}) + "\n"
            rounds: List[RoastRound] = []
            is_alive = True
            
            base_context = (
                f"Pitch: {pitch}\n"
                f"Analysis: {analysis.model_dump_json()}\n"
                f"Assumptions: {[a.model_dump_json() for a in assumptions_list]}\n"
                f"Failure Scenarios: {failure_sim.model_dump_json()}\n"
                f"Intensity: {intensity}\n"
            )

            for i in range(1, 5): # 4 rounds
                if not is_alive:
                    break
                    
                yield json.dumps({"type": "log", "message": f"Round {i}: Roasting logic engaged..."}) + "\n"
                round_prompt = (
                    f"{base_context}\n"
                    f"Current Round: {i}\n"
                    f"Previous Rounds: {[r.model_dump_json() for r in rounds]}\n"
                    "Proceed with the roast for this round."
                )
                
                roast_result = await vc_roast_agent.run(round_prompt)
                round_data = roast_result.output
                round_data.round_number = i
                rounds.append(round_data)
                
                if not round_data.survived:
                    yield json.dumps({"type": "log", "message": f"Round {i}: Pitch did not survive. Stopping early."}) + "\n"
                    is_alive = False
            
            # Step 5: Verdict
            yield json.dumps({"type": "log", "message": "Step 5: Delivering final verdict..."}) + "\n"
            verdict_prompt = (
                f"Original Pitch: {pitch}\n"
                f"Roast History: {[r.model_dump_json() for r in rounds]}\n"
                "Deliver the final verdict."
            )
            verdict_result = await verdict_agent.run(verdict_prompt)
            verdict = verdict_result.output

            # Final Result
            final_response = RoastResponse(
                analysis=analysis,
                assumptions=assumptions_list,
                failure_simulation=failure_sim,
                roast_rounds=rounds,
                verdict=verdict
            )
            yield json.dumps({"type": "result", "data": final_response.model_dump()}) + "\n"

        except Exception as e:
            yield json.dumps({"type": "error", "message": str(e)}) + "\n"

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")

class ChatRequest(BaseModel):
    messages: List[dict] # [{"role": "user", "content": "..."}]
    context: Optional[str] = ""

@app.post("/chat")
async def chat_interaction(request: ChatRequest):
    from fastapi.responses import StreamingResponse
    from .agents import chat_agent
    import json

    async def event_generator():
        try:
            # Construct history for the agent
            # We assume the last message is from the user
            user_input = request.messages[-1]["content"]
            
            # Use the context (previous analysis) to inform the response
            # Note: In a real app we'd pass the full conversation history to the agent
            # Pydantic AI supports history, but for this simple stateless V1,
            # we'll just prepend the context to the user prompt if it exists.
            
            full_prompt = f"Context from previous analysis:\n{request.context}\n\nUser Question: {user_input}"
            
            # pydantic_ai stream() yields the full text so far.
            # We need to calculate the delta to send to the frontend.
            previous_text = ""
            async with chat_agent.run_stream(full_prompt) as result:
                async for chunk in result.stream():
                    if isinstance(chunk, str):
                        delta = chunk[len(previous_text):]
                        previous_text = chunk
                        if delta:
                            yield json.dumps({"type": "chunk", "content": delta}) + "\n"
                    else:
                        yield json.dumps({"type": "chunk", "content": str(chunk)}) + "\n"
            
        except Exception as e:
            yield json.dumps({"type": "error", "message": str(e)}) + "\n"

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")

@app.get("/")
async def root():
    return {"message": "Roast My Startup Idea API is running"}
