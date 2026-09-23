from typing import Any
from pydantic import BaseModel, Field


class PersonaRequest(BaseModel):
    product_description: str = Field(..., min_length=3)
    target_audience: str = Field(..., min_length=3)
    research_objective: str = Field(..., min_length=3)


class PersonaGenerationRequest(PersonaRequest):
    number_of_personas: int = Field(default=4, ge=1, le=20)


class PersonaResponse(BaseModel):
    id: int | None = None
    name: str
    player_name: str | None = None
    age: str
    age_range: str | None = None
    occupation: str
    personality_traits: str
    player_personality: str | None = None
    behaviour: str
    behavior_summary: str | None = None
    psychological_profile: str
    avatar_seed: str = "avatar-1"
    country: str = "United States"
    gender: str = "Any"
    product_description: str = ""
    target_audience: str = ""
    research_objective: str = ""
    memory_json: list[dict[str, Any]] = []


class ProductValidationItem(BaseModel):
    persona_id: int
    name: str
    occupation: str
    stance: str  # "Accept", "Reject", "Uncertain", "Switch Brand"
    purchase_intent_score: int  # 1 to 10
    perceived_value: str
    main_motivators: list[str]
    main_concerns: list[str]
    switching_triggers: str
    verdict_summary: str


class ProductValidationRequest(BaseModel):
    persona_ids: list[int] | None = None
    product_description: str = ""
    target_audience: str = ""
    research_objective: str = ""


class ProductValidationResponse(BaseModel):
    product_description: str
    research_objective: str
    total_personas: int
    acceptance_rate: float
    rejection_rate: float
    uncertainty_rate: float
    average_purchase_intent: float
    persona_evaluations: list[ProductValidationItem]


class PersonaStructuredMemory(BaseModel):
    stated_preferences: list[str] = []
    purchase_motivators: list[str] = []
    product_concerns: list[str] = []
    brand_loyalty: str = "Moderate"
    price_sensitivity: str = "Moderate"
    usage_habits: list[str] = []
    key_opinions: list[str] = []


class InterviewRequest(BaseModel):
    message: str = Field(..., min_length=1)
    product_description: str | None = None
    research_objective: str | None = None


class InterviewResponse(BaseModel):
    persona_id: int
    name: str
    reply: str
    updated_memory: list[dict[str, Any]]
    structured_memory: dict[str, Any] = {}
    consistency_score: int = 95
    realism_score: int = 95


class SurveyQuestion(BaseModel):
    id: str
    question_text: str
    question_type: str = "open_ended"
    options: list[str] | None = None


class SurveyRunRequest(BaseModel):
    survey_title: str = "Product User Research Survey"
    product_domain: str = "General Product Research"
    questions: list[SurveyQuestion]
    persona_ids: list[int] | None = None
    product_description: str | None = None
    research_objective: str | None = None


class SurveyAnswer(BaseModel):
    question_id: str
    question_text: str
    rating: int | None = None
    answer_text: str
    sentiment: str = "Neutral"
    consistency_score: int = 95


class SurveyPersonaResult(BaseModel):
    persona_id: int
    name: str
    occupation: str
    avatar_seed: str
    answers: list[SurveyAnswer]
    overall_alignment: int = 95


class SurveyRunResponse(BaseModel):
    survey_id: int | str
    survey_title: str
    product_domain: str
    timestamp: str
    results: list[SurveyPersonaResult]
    total_personas: int = 0
    aggregate_findings: dict[str, Any] = {}


# Insight Agent Schemas
class InsightThemeItem(BaseModel):
    theme: str
    strength: str = "High"  # "High", "Medium", "Low"
    observed_in: str = "Observed across personas"
    impact: str = "High"
    evidence_quote: str = ""


class SentimentSegmentItem(BaseModel):
    segment_name: str
    positive_pct: float
    neutral_pct: float
    negative_pct: float
    key_driver: str


class AgreementPatternItem(BaseModel):
    topic: str
    consensus_stance: str
    supporting_personas_count: int
    summary: str


class InsightExtractionRequest(BaseModel):
    persona_ids: list[int] | None = None
    product_description: str = ""
    target_audience: str = ""
    research_objective: str = ""


class InsightExtractionResponse(BaseModel):
    product_description: str
    research_objective: str
    overall_summary: str
    recurring_themes: list[InsightThemeItem]
    sentiment_breakdown: dict[str, Any]
    sentiment_by_segment: list[SentimentSegmentItem]
    agreement_patterns: list[AgreementPatternItem]
    disagreement_patterns: list[dict[str, Any]]
    behavioural_trends: list[str]
    research_objective_findings: list[str]


BehaviouralInsightsRequest = InsightExtractionRequest
BehaviouralInsightsResponse = InsightExtractionResponse


# Adoption Scoring Schemas
class PersonaAdoptionScore(BaseModel):
    persona_id: int
    name: str
    occupation: str
    score: int  # 0 to 100
    stance: str  # "Likely to use", "Uncertain", "Unlikely to use"
    reasoning: str
    key_motivator: str
    key_objection: str


class SegmentAdoptionScore(BaseModel):
    segment_name: str
    persona_count: int
    average_score: float
    segment_reasoning: str
    main_motivations: list[str]
    main_objections: list[str]


class ProductAdoptionScoreRequest(BaseModel):
    persona_ids: list[int] | None = None
    product_description: str = ""
    target_audience: str = ""
    research_objective: str = ""


class ProductAdoptionScoreResponse(BaseModel):
    product_description: str
    research_objective: str
    overall_adoption_score: float
    overall_summary: str
    persona_scores: list[PersonaAdoptionScore]
    segment_scores: list[SegmentAdoptionScore]


# Scenario Quality Validation Schemas
class ScenarioTestRequest(BaseModel):
    scenario_id: str  # "high_adoption", "low_adoption", "mixed_opinions", "brand_loyalty", "price_sensitivity"
    product_description: str = ""
    target_audience: str = ""
    research_objective: str = ""


class QualityValidationReport(BaseModel):
    scenario_id: str
    scenario_name: str
    theme_relevance_score: int
    evidence_traceability_score: int
    sentiment_accuracy_score: int
    hallucination_free_check: bool
    validation_summary: str
    evidence_findings: list[dict[str, Any]]


# Research Report Schemas
class KeyPersonaQuote(BaseModel):
    persona_id: int | str
    persona_name: str
    occupation: str = "Consumer"
    avatar_seed: str = "avatar-1"
    quote: str
    context_tag: str = "User Preference"
    sentiment: str = "Neutral"


class ResearchReportRequest(BaseModel):
    persona_ids: list[int] | None = None
    product_description: str = ""
    target_audience: str = ""
    research_objective: str = ""


class ResearchReportResponse(BaseModel):
    report_title: str = "Product Persona Synthetic Research Report"
    generated_at: str = ""
    product_description: str
    target_audience: str
    research_objective: str
    overall_adoption_score: float = 0.0
    acceptance_rate: float = 0.0
    total_personas_evaluated: int = 0
    executive_summary: str = ""
    persona_profiles: list[dict[str, Any]] = []
    key_quotes: list[KeyPersonaQuote] = []
    theme_clusters: list[InsightThemeItem] = []
    sentiment_breakdown: dict[str, Any] = {}
    sentiment_by_segment: list[SentimentSegmentItem] = []
    adoption_scores: ProductAdoptionScoreResponse | None = None
    validation_scores: ProductValidationResponse | None = None




