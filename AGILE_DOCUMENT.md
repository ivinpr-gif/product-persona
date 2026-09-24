# ProductPersona AI — Agile Project Documentation

This document contains the complete **Agile Management Sheet** for the **ProductPersona AI Research Studio** project, covering all 4 sprints (Milestones 1 to 4).

The corresponding Excel workbook has been generated and saved at:
📁 [`Agile_Project_Sheet.xlsx`](file:///d:/intern/Gamer%20persona%20-%20Copy%20(2)/Agile_Project_Sheet.xlsx)

---

## 1️⃣ Product Backlog

| Planned Sprint | Actual Sprint | US ID | User Story Description | MOSCOW | Dependency | Assignee | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sprint 1** | **Sprint 1** | **US-01** | As a product researcher, I want to generate synthetic personas based on product description, target audience, and research objective so that I can simulate target market participants without recruitment costs. | Must | None | Full Stack Dev | Completed |
| **Sprint 1** | **Sprint 1** | **US-02** | As a UX strategist, I want each generated persona to have consistent psychological profiles, shopping habits, and demographic traits so that their feedback is realistic and reliable. | Must | US-01 | AI Engineer | Completed |
| **Sprint 1** | **Sprint 1** | **US-03** | As a product manager, I want a Persona Hub to view, filter, and manage participant profiles so that I can reuse cards across test scenarios. | Must | US-01 | Frontend Dev | Completed |
| **Sprint 2** | **Sprint 2** | **US-04** | As a product researcher, I want a Product Validation module to evaluate concept acceptance, rejection, purchase intent, and perceived value so that I can gauge market feasibility. | Must | US-01 | Backend Dev | Completed |
| **Sprint 2** | **Sprint 2** | **US-05** | As a qualitative researcher, I want an interactive Interview Mode where personas respond in character maintaining structured memory so that I can dig into specific preferences. | Must | US-02 | AI Engineer | Completed |
| **Sprint 3** | **Sprint 3** | **US-06** | As a market researcher, I want a Survey Simulator Mode to execute quantitative and open-ended questionnaires across persona cohorts so that I can collect structured feedback. | Must | US-03 | Full Stack Dev | Completed |
| **Sprint 3** | **Sprint 3** | **US-07** | As an analytics lead, I want an Insight Extraction Agent to surface objective-aware theme clusters, sentiment breakdowns, and agreement patterns so that I can identify recurring trends. | Must | US-05, US-06 | AI Engineer | Completed |
| **Sprint 3** | **Sprint 3** | **US-08** | As a product decision maker, I want a 'Would Use This Product?' adoption scoring model (0-100) per persona & segment so that I can quantify adoption likelihood. | Must | US-07 | Backend Dev | Completed |
| **Sprint 3** | **Sprint 3** | **US-09** | As a QA lead, I want a Scenario Quality Lab to evaluate theme relevance, evidence traceability, and hallucination prevention so that I can validate insight extraction quality. | Should | US-07 | QA Lead | Completed |
| **Sprint 4** | **Sprint 4** | **US-10** | As an executive stakeholder, I want an Insights & Experiment Results Dashboard featuring Recharts sentiment graphics, theme cards, and key verbatim quotes so that I can visualize experiment outcomes. | Must | US-07, US-08 | Frontend Dev | Completed |
| **Sprint 4** | **Sprint 4** | **US-11** | As a research lead, I want to export structured downloadable PDF research reports compiling persona profiles, response highlights, and adoption scoring so that I can share findings with team members. | Must | US-10 | Full Stack Dev | Completed |
| **Sprint 4** | **Sprint 4** | **US-12** | As a system developer, I want a multi-model LLM fallback chain across Gemini models (gemini-3.5-flash, gemini-3.5-flash-lite, gemini-2.0-flash) so that rate limit quota errors do not crash research sessions. | Must | US-01 | Backend Dev | Completed |

---

## 2️⃣ Sprint Backlog

| Sprint | Task ID | US ID | Task Description | Activity Type | Assignee | Start Date | End Date | Est. Hours | Day 1 Rem | Day 2 Rem | Day 3 Rem | Day 4 Rem | Day 5 Rem | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sprint 1** | **T-01** | US-01 | Design FastAPI request/response Pydantic schemas for persona generation | Backend | Backend Dev | 2026-08-04 | 2026-08-04 | 4.0 | 4.0 | 0.0 | 0.0 | 0.0 | 0.0 | Completed |
| **Sprint 1** | **T-02** | US-01 | Integrate Gemini REST API endpoint with system instructions | AI Eng | AI Engineer | 2026-08-05 | 2026-08-05 | 6.0 | 6.0 | 3.0 | 0.0 | 0.0 | 0.0 | Completed |
| **Sprint 1** | **T-03** | US-02 | Implement profile psychological consistency prompts and avatar seed generation | AI Eng | AI Engineer | 2026-08-06 | 2026-08-06 | 5.0 | 5.0 | 2.0 | 0.0 | 0.0 | 0.0 | Completed |
| **Sprint 1** | **T-04** | US-03 | Build React GeneratePersona page & PersonaHub card view component | Frontend | Frontend Dev | 2026-08-07 | 2026-08-08 | 8.0 | 8.0 | 4.0 | 0.0 | 0.0 | 0.0 | Completed |
| **Sprint 2** | **T-05** | US-04 | Implement product validation scoring endpoint & DB persistence in SQLite | Backend | Backend Dev | 2026-08-11 | 2026-08-12 | 7.0 | 7.0 | 3.0 | 0.0 | 0.0 | 0.0 | Completed |
| **Sprint 2** | **T-06** | US-04 | Build ProductValidation frontend page with purchase intent & perceived value cards | Frontend | Frontend Dev | 2026-08-13 | 2026-08-13 | 6.0 | 6.0 | 2.0 | 0.0 | 0.0 | 0.0 | Completed |
| **Sprint 2** | **T-07** | US-05 | Implement interactive chat_with_persona endpoint with structured memory history | AI Eng | AI Engineer | 2026-08-14 | 2026-08-15 | 9.0 | 9.0 | 5.0 | 1.0 | 0.0 | 0.0 | Completed |
| **Sprint 2** | **T-08** | US-05 | Build PersonaInterview frontend page with real-time turn history | Frontend | Frontend Dev | 2026-08-16 | 2026-08-16 | 6.0 | 6.0 | 2.0 | 0.0 | 0.0 | 0.0 | Completed |
| **Sprint 3** | **T-09** | US-06 | Create SurveyMode preset generator and persona response engine | Backend | Full Stack Dev | 2026-08-18 | 2026-08-19 | 8.0 | 8.0 | 4.0 | 0.0 | 0.0 | 0.0 | Completed |
| **Sprint 3** | **T-10** | US-07 | Develop extract_research_insights_agent for theme clustering & sentiment breakdown | AI Eng | AI Engineer | 2026-08-20 | 2026-08-21 | 10.0 | 10.0 | 6.0 | 2.0 | 0.0 | 0.0 | Completed |
| **Sprint 3** | **T-11** | US-08 | Implement score_product_adoption_agent algorithm per persona & segment | Backend | Backend Dev | 2026-08-22 | 2026-08-22 | 6.5 | 6.5 | 3.0 | 0.0 | 0.0 | 0.0 | Completed |
| **Sprint 3** | **T-12** | US-09 | Develop ScenarioQualityLab validation pipeline & ground-truth metrics test | Testing | QA Lead | 2026-08-23 | 2026-08-24 | 7.5 | 7.5 | 3.5 | 0.0 | 0.0 | 0.0 | Completed |
| **Sprint 4** | **T-13** | US-10 | Build Dashboard page with Recharts Donut/Bar charts & Theme Cluster cards | Frontend | Frontend Dev | 2026-08-25 | 2026-08-26 | 9.5 | 9.5 | 5.0 | 1.0 | 0.0 | 0.0 | Completed |
| **Sprint 4** | **T-14** | US-11 | Implement reportGenerator.js with jsPDF & html2canvas multi-page export | Frontend | Full Stack Dev | 2026-08-27 | 2026-08-28 | 8.0 | 8.0 | 4.0 | 0.0 | 0.0 | 0.0 | Completed |
| **Sprint 4** | **T-15** | US-11 | Create POST /api/reports/full-summary backend report aggregator service | Backend | Backend Dev | 2026-08-29 | 2026-08-29 | 5.5 | 5.5 | 2.0 | 0.0 | 0.0 | 0.0 | Completed |
| **Sprint 4** | **T-16** | US-12 | Configure multi-model Gemini fallback array & 429 quota exception handling | AI Eng | Backend Dev | 2026-08-30 | 2026-08-30 | 4.5 | 4.5 | 1.5 | 0.0 | 0.0 | 0.0 | Completed |

---

## 3️⃣ Stand-up Meeting Logs

| Sprint | Day | Team Member | Problem / Blocker Encountered | Action Taken / Resolution |
| :--- | :--- | :--- | :--- | :--- |
| **Sprint 1** | Day 2 | AI Engineer | Google Gemini Free Tier returning HTTP 429 rate limit during multi-persona chunk generation. | Implemented automatic chunking (3 personas/chunk) with 0.5s pause and model fallback array. |
| **Sprint 1** | Day 4 | Frontend Dev | Persona cards breaking alignment on small viewports with varied text length. | Refactored CSS grid layout to use CSS flex-wrap and normalized persona object fields. |
| **Sprint 2** | Day 2 | Backend Dev | Database query accumulating historical personas across past product runs, diluting active test scope. | Added `current_batch_only=True` filter in PersonaService to isolate current product batch. |
| **Sprint 2** | Day 4 | AI Engineer | Persona memory growing too large during long qualitative interview sessions. | Designed structured memory JSON storing top stated preferences, motivators, and key opinions. |
| **Sprint 3** | Day 3 | Full Stack Dev | Survey response generation timing out when executing 10 personas sequentially. | Refactored survey engine to execute persona queries in parallel using asyncio.gather. |
| **Sprint 3** | Day 5 | QA Lead | Inconsistent theme relevance scores across varied scenario quality tests. | Added objective-aware context injection to the insight extraction prompt. |
| **Sprint 4** | Day 2 | Frontend Dev | Recharts components rendering with zero width inside hidden tab containers. | Added ResponsiveContainer wrappers with explicit min-height parameters. |
| **Sprint 4** | Day 4 | Full Stack Dev | jsPDF DOM capture failing on high-DPI displays due to canvas scaling defects. | Added custom canvas scaling factor (scale: 2) and fallback text-based PDF compilation. |

---

## 4️⃣ Retrospection

| Sprint | Team Member | What to Start Doing | What to Stop Doing | What to Continue Doing | Action Taken |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sprint 1** | AI Engineer | Define explicit JSON schemas for LLM prompts before writing code. | Hardcoding single model names without fallbacks. | Testing prompt edge cases early in development. | Configured model candidate fallback array in AIService. |
| **Sprint 1** | Frontend Dev | Create reusable UI component tokens and CSS variables. | Using inline pixel widths for cards and metrics. | Maintaining clean dark-mode styling and glassmorphism. | Standardized design system in styles.css. |
| **Sprint 2** | Backend Dev | Writing modular service methods separated from route handlers. | Overwriting DB memory history without structured schema. | Comprehensive Pydantic schema validation. | Refactored PersonaService with clear data access layers. |
| **Sprint 2** | AI Engineer | Self-assessing realism & consistency scores inside persona replies. | Assuming LLM output will always be valid JSON. | Maintaining strict persona behavioral profiles. | Added _parse_json fallback regex parser. |
| **Sprint 3** | Full Stack Dev | Running async calls concurrently with asyncio.gather. | Running sequential LLM loops inside REST endpoints. | Caching preset surveys and scenarios with TTL. | Implemented async parallel batching for surveys & insights. |
| **Sprint 3** | QA Lead | Automating scenario test suites for quality verification. | Manual inspection of individual JSON responses. | Benchmarking theme relevance and hallucination checks. | Built automated ScenarioQualityLab endpoint. |
| **Sprint 4** | Frontend Dev | Testing PDF report export across different browser viewports. | Relying solely on DOM screenshot capture for PDF. | Creating responsive visual dashboards with Recharts. | Added dual PDF export engine (canvas + structured text). |
| **Sprint 4** | Backend Dev | Adding endpoint verification scripts before declaring completion. | Testing API endpoints manually one by one. | Documenting endpoints with OpenAPI schemas. | Created scratch test scripts for full suite verification. |
