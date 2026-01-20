from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class PitchAnalysis(BaseModel):
    summary: str = Field(description="Brief summary of the pitch")
    problem_statement: str = Field(description="The core problem being solved")
    target_customer: str = Field(description="Who this is for")
    value_proposition: str = Field(description="Why they will buy it")
    market_size_assumptions: str = Field(description="Explicit or inferred market size claims")
    distribution_strategy: str = Field(description="How they get customers")
    competitive_moat: str = Field(description="Why they win against competitors")
    execution_timeline: str = Field(description="Proposed timeline")
    founder_assumptions: List[str] = Field(description="Implicit assumptions about the founder's ability")
    missing_info: List[str] = Field(description="Critical components missing from the pitch")
    is_vague: bool = Field(description="If the pitch is too vague to analyze properly")

class Assumption(BaseModel):
    description: str
    category: Literal["Market", "User Behavior", "Technical", "Execution"]
    confidence_score: Literal["Low", "Medium", "High"]
    reason_risky: str

class AssumptionsList(BaseModel):
    assumptions: List[Assumption]

class FailureScenario(BaseModel):
    scenario_name: str
    description: str
    probability: Literal["Low", "Medium", "High", "Certain"]
    impact: Literal["Minor", "Major", "Fatal"]
    mechanism_of_failure: str = Field(description="How exactly this kills the startup")

class FailureSimulation(BaseModel):
    scenarios: List[FailureScenario]
    execution_risk_summary: str

class RoastCritique(BaseModel):
    market_delusions: str = Field(description="Why the market doesn't exist or doesn't care")
    execution_fantasy: str = Field(description="Why they can't build/sell it")
    competitive_reality: str = Field(description="Who actually eats their lunch")
    timeline_lies: str = Field(description="Why their schedule is impossible")
    overall_harshness_comment: str

class RoastRound(BaseModel):
    round_number: int
    critique: RoastCritique
    survived: bool = Field(description="Did the idea survive this round?")
    fatal_flaw_found: Optional[str] = Field(description="If kiled, what was the kill shot?")

class Verdict(BaseModel):
    final_verdict: Literal["This idea fails under scrutiny.", "This idea survives, but only narrowly.", "This idea is fundamentally broken."]
    ranked_fatal_flaws: List[str]
    assumptions_that_broke: List[str]
    kill_reason: str
    viability_score: int = Field(description="0-10, where 0 is dead on arrival")
