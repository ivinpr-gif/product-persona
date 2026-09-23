from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas import (
    PersonaGenerationRequest,
    PersonaResponse,
    ProductValidationRequest,
    ProductValidationResponse,
    SurveyRunRequest,
    SurveyRunResponse,
    BehaviouralInsightsRequest,
    BehaviouralInsightsResponse,
    InsightExtractionRequest,
    InsightExtractionResponse,
    ProductAdoptionScoreRequest,
    ProductAdoptionScoreResponse,
    ScenarioTestRequest,
    ResearchReportRequest,
    ResearchReportResponse,
)
from app.services.persona_service import PersonaService

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/generate-personas", response_model=list[PersonaResponse])
async def generate_personas(request: PersonaGenerationRequest, db: Session = Depends(get_db)) -> list[PersonaResponse]:
    try:
        service = PersonaService(db)
        results = await service.create_personas(request, request.number_of_personas)
        return [PersonaResponse(**result) for result in results]
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Persona generation failed: {exc}") from exc


@router.get("/personas")
def list_personas(all_batches: bool = False, db: Session = Depends(get_db)) -> list[dict]:
    service = PersonaService(db)
    return service.list_personas(current_batch_only=not all_batches)


@router.delete("/personas")
def clear_all_personas(db: Session = Depends(get_db)) -> dict:
    service = PersonaService(db)
    return service.clear_all_personas()


@router.post("/personas/{persona_id}/interview")
async def interview_persona(
    persona_id: int,
    payload: dict,
    db: Session = Depends(get_db),
) -> dict:
    try:
        service = PersonaService(db)
        message = payload.get("message", "")
        product_description = payload.get("product_description")
        research_objective = payload.get("research_objective")
        if not message:
            raise HTTPException(status_code=400, detail="Message is required.")
        return await service.interview_persona(
            persona_id=persona_id,
            message=message,
            product_description=product_description,
            research_objective=research_objective,
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Interview failed: {exc}") from exc


@router.delete("/personas/{persona_id}/memory")
def clear_persona_memory(persona_id: int, db: Session = Depends(get_db)) -> dict:
    try:
        service = PersonaService(db)
        return service.clear_persona_memory(persona_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/product-validation", response_model=ProductValidationResponse)
async def validate_product(payload: ProductValidationRequest, db: Session = Depends(get_db)) -> dict:
    try:
        service = PersonaService(db)
        return await service.validate_product(
            persona_ids=payload.persona_ids,
            product_description=payload.product_description,
            target_audience=payload.target_audience,
            research_objective=payload.research_objective,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Product validation failed: {exc}") from exc


@router.get("/survey/presets")
async def get_survey_presets(db: Session = Depends(get_db)) -> list[dict]:
    service = PersonaService(db)
    return await service.get_survey_presets()


@router.post("/survey/run")
async def run_survey(payload: dict, db: Session = Depends(get_db)) -> dict:
    try:
        service = PersonaService(db)
        survey_title = payload.get("survey_title", "Product User Research Survey")
        product_domain = payload.get("product_domain", "General Product Research")
        questions = payload.get("questions", [])
        persona_ids = payload.get("persona_ids")
        product_description = payload.get("product_description")
        research_objective = payload.get("research_objective")

        if not questions:
            raise HTTPException(status_code=400, detail="Survey questions are required.")

        return await service.execute_survey(
            survey_title=survey_title,
            product_domain=product_domain,
            questions=questions,
            persona_ids=persona_ids,
            product_description=product_description,
            research_objective=research_objective,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Survey execution failed: {exc}") from exc


@router.post("/behavioural-insights")
@router.post("/insights/extract")
async def extract_insights(payload: InsightExtractionRequest, db: Session = Depends(get_db)) -> dict:
    try:
        service = PersonaService(db)
        return await service.generate_insights(
            persona_ids=payload.persona_ids,
            product_description=payload.product_description,
            target_audience=payload.target_audience,
            research_objective=payload.research_objective,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Insight extraction failed: {exc}") from exc


@router.post("/adoption-scores")
async def score_product_adoption(payload: ProductAdoptionScoreRequest, db: Session = Depends(get_db)) -> dict:
    try:
        service = PersonaService(db)
        return await service.score_product_adoption(
            persona_ids=payload.persona_ids,
            product_description=payload.product_description,
            target_audience=payload.target_audience,
            research_objective=payload.research_objective,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Adoption scoring failed: {exc}") from exc


@router.post("/quality-validation")
async def validate_insight_quality(payload: ScenarioTestRequest, db: Session = Depends(get_db)) -> dict:
    try:
        service = PersonaService(db)
        return await service.run_scenario_quality_validation(
            scenario_id=payload.scenario_id,
            product_description=payload.product_description,
            target_audience=payload.target_audience,
            research_objective=payload.research_objective,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Quality validation failed: {exc}") from exc


@router.get("/scenarios/presets")
async def get_scenario_presets(db: Session = Depends(get_db)) -> list[dict]:
    service = PersonaService(db)
    return await service.get_scenario_presets()


@router.post("/reports/full-summary", response_model=ResearchReportResponse)
async def generate_full_research_report(payload: ResearchReportRequest, db: Session = Depends(get_db)) -> dict:
    try:
        service = PersonaService(db)
        return await service.generate_full_research_report(
            persona_ids=payload.persona_ids,
            product_description=payload.product_description,
            target_audience=payload.target_audience,
            research_objective=payload.research_objective,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Research report generation failed: {exc}") from exc




