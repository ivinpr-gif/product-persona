import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePersonaContext } from '../context/PersonaContext';

export default function SurveyMode() {
  const { personas, latestBatch, productContext } = usePersonaContext();
  const [filterScope, setFilterScope] = useState(latestBatch.length > 0 ? 'latest' : 'all');
  const activePersonaList = filterScope === 'latest' && latestBatch.length > 0 ? latestBatch : personas;

  const [surveyTitle, setSurveyTitle] = useState('Product Research Survey');
  const [productDomain, setProductDomain] = useState('Product Perception & Pricing');
  const [questionText, setQuestionText] = useState('How likely are you to switch from your current brand to this product, and why?');
  const [questionType, setQuestionType] = useState('open_ended');

  const [selectedPersonaIds, setSelectedPersonaIds] = useState([]);
  const [surveyResults, setSurveyResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    axios.get('/api/survey/presets').then((res) => {
      setPresets(res.data || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (activePersonaList.length > 0) {
      setSelectedPersonaIds(activePersonaList.map((p) => p.id).filter(Boolean));
    }
  }, [activePersonaList]);

  const togglePersonaSelection = (id) => {
    if (selectedPersonaIds.includes(id)) {
      if (selectedPersonaIds.length > 1) {
        setSelectedPersonaIds(selectedPersonaIds.filter((pid) => pid !== id));
      }
    } else {
      setSelectedPersonaIds([...selectedPersonaIds, id]);
    }
  };

  const handleApplyPreset = (preset) => {
    setSurveyTitle(preset.title);
    setProductDomain(preset.domain);
    if (preset.questions?.[0]) {
      setQuestionText(preset.questions[0].question_text);
      setQuestionType(preset.questions[0].question_type);
    }
  };

  const handleRunSurvey = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setError('Please enter a survey question before running comparison.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/survey/run', {
        survey_title: surveyTitle.trim() || 'Product Research Survey',
        product_domain: productDomain,
        questions: [
          {
            id: 'q1',
            question_text: questionText.trim(),
            question_type: questionType,
          },
        ],
        persona_ids: selectedPersonaIds.length > 0 ? selectedPersonaIds : null,
        product_description: productContext.product_description,
        research_objective: productContext.research_objective,
      });

      setSurveyResults(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Survey execution failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (personas.length === 0) {
    return (
      <div className="page-stack">
        <section className="card empty-state">
          <h3>No Personas Available for Survey Mode</h3>
          <p className="muted">Generate synthetic product personas first to run survey simulations.</p>
          <a className="primary-button" href="/generate">Generate Personas</a>
        </section>
      </div>
    );
  }

  // Calculate aggregated findings
  const sentimentCounts = surveyResults?.results?.reduce(
    (acc, res) => {
      const s = res.answers?.[0]?.sentiment?.toLowerCase() || 'neutral';
      if (s === 'positive') acc.positive += 1;
      else if (s === 'negative') acc.negative += 1;
      else acc.neutral += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const totalResults = surveyResults?.results?.length || 0;

  return (
    <div className="page-stack">
      {/* Header */}
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Quantitative & Qualitative Simulator</p>
          <h2>Product Research Survey Simulator</h2>
          <p className="muted">
            Execute survey questions across synthetic personas. Evaluates individual reactions based on personality, behaviour, and psychological profile.
          </p>
        </div>
      </section>

      {/* Preset Templates Row */}
      {presets.length > 0 && (
        <section className="card presets-card">
          <h4>⚡ Survey Research Presets</h4>
          <div className="quick-presets-row" style={{ marginTop: '8px' }}>
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="quick-preset-button"
                onClick={() => handleApplyPreset(preset)}
              >
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Survey Form Panel */}
      <section className="card survey-form-panel">
        <form onSubmit={handleRunSurvey}>
          <div className="form-row-2col">
            <label className="filter-field">
              <span>Survey Title</span>
              <input
                type="text"
                placeholder="e.g. Sensitive Skin Soap Brand Switching Survey"
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
              />
            </label>

            <label className="filter-field">
              <span>Research Focus Area</span>
              <select value={productDomain} onChange={(e) => setProductDomain(e.target.value)}>
                <option value="Product Perception & Pricing">Product Perception & Pricing</option>
                <option value="Brand Switching & Competitors">Brand Switching & Competitors</option>
                <option value="Feature Priority & Benefits">Feature Priority & Benefits</option>
                <option value="Usability & Trust">Usability & Trust</option>
              </select>
            </label>
          </div>

          {/* Single Question Builder */}
          <div className="single-question-box" style={{ marginTop: '14px' }}>
            <h4>Survey Question</h4>
            <div className="question-input-card" style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                style={{ flex: 1 }}
                placeholder="Enter your survey question..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
              >
                <option value="open_ended">Open-Ended Response</option>
                <option value="likert_scale">Likert Scale (1-5)</option>
                <option value="yes_no">Yes / No Stance</option>
                <option value="choice">Multiple Choice</option>
              </select>
            </div>
          </div>

          {/* Persona Target Selection */}
          <div className="persona-target-selector" style={{ marginTop: '16px' }}>
            <div className="selector-header-row">
              <h4>Target Personas ({selectedPersonaIds.length} / {activePersonaList.length} selected)</h4>
              <div className="scope-pills">
                <button
                  type="button"
                  className={`scope-pill ${filterScope === 'latest' ? 'active-scope' : ''}`}
                  onClick={() => setFilterScope('latest')}
                  disabled={latestBatch.length === 0}
                >
                  ⚡ Latest Batch ({latestBatch.length})
                </button>
                <button
                  type="button"
                  className={`scope-pill ${filterScope === 'all' ? 'active-scope' : ''}`}
                  onClick={() => setFilterScope('all')}
                >
                  🗄️ All Saved ({personas.length})
                </button>
              </div>
            </div>

            <div className="persona-checkboxes-grid" style={{ marginTop: '8px' }}>
              {activePersonaList.map((p) => {
                const name = p.name || p.player_name;
                return (
                  <label key={p.id} className={`persona-checkbox-pill ${selectedPersonaIds.includes(p.id) ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedPersonaIds.includes(p.id)}
                      onChange={() => togglePersonaSelection(p.id)}
                    />
                    <span>{name} ({p.occupation})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {error && <p className="error" style={{ marginTop: '12px' }}>{error}</p>}

          <div className="submit-row" style={{ marginTop: '16px' }}>
            <button type="submit" className="primary-button run-survey-btn" disabled={loading || !questionText.trim()}>
              {loading ? 'Simulating Persona Responses...' : '🚀 Execute Survey & Aggregate Findings'}
            </button>
          </div>
        </form>
      </section>

      {/* Disclaimer Notice */}
      <div className="disclaimer-banner card">
        <small className="muted">
          ℹ️ <strong>AI-Simulated Research Notice:</strong> Results are simulated responses generated by LLM reasoning over individual persona profiles. They represent synthetic qualitative feedback for product research.
        </small>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <section className="card loading-state">
          <h3>Simulating Persona Responses...</h3>
          <p className="muted">Running parallel survey prompts across selected participant profile cards.</p>
          <div className="skeleton" style={{ height: '32px', width: '100%' }} />
          <div className="skeleton" style={{ height: '140px', width: '100%', marginTop: '12px' }} />
        </section>
      )}

      {/* Survey Aggregated & Matrix Results */}
      {surveyResults && !loading && (
        <section className="survey-cards-matrix">
          <div className="results-header-bar card">
            <div>
              <h3>{surveyResults.survey_title || 'Survey Comparison Results'}</h3>
              <p className="muted">Question: "{questionText}"</p>
            </div>
            <div className="badge-tag">{totalResults} Personas Evaluated</div>
          </div>

          {/* Aggregated Research Summary Bar */}
          {totalResults > 0 && (
            <div className="aggregate-summary-card card" style={{ marginTop: '14px' }}>
              <h4>Aggregated Sentiment & Stance Distribution</h4>
              <div className="sentiment-bar-container" style={{ marginTop: '8px' }}>
                <div
                  className="bar-segment positive-bar"
                  style={{ width: `${(sentimentCounts.positive / totalResults) * 100}%` }}
                  title={`Positive: ${sentimentCounts.positive}`}
                >
                  {sentimentCounts.positive > 0 && `${Math.round((sentimentCounts.positive / totalResults) * 100)}% Positive`}
                </div>
                <div
                  className="bar-segment neutral-bar"
                  style={{ width: `${(sentimentCounts.neutral / totalResults) * 100}%` }}
                  title={`Neutral: ${sentimentCounts.neutral}`}
                >
                  {sentimentCounts.neutral > 0 && `${Math.round((sentimentCounts.neutral / totalResults) * 100)}% Neutral`}
                </div>
                <div
                  className="bar-segment negative-bar"
                  style={{ width: `${(sentimentCounts.negative / totalResults) * 100}%` }}
                  title={`Negative: ${sentimentCounts.negative}`}
                >
                  {sentimentCounts.negative > 0 && `${Math.round((sentimentCounts.negative / totalResults) * 100)}% Negative`}
                </div>
              </div>
            </div>
          )}

          {/* Individual Persona Response Cards Grid */}
          <div className="persona-profile-cards-grid" style={{ marginTop: '16px' }}>
            {surveyResults.results?.map((res, pIdx) => {
              const matchingPersona = personas.find((p) => p.id === res.persona_id) || res;
              const name = res.name || res.player_name || matchingPersona.name || matchingPersona.player_name;
              const ans = res.answers?.[0] || {};

              return (
                <div key={res.persona_id || pIdx} className="persona-full-response-card card">
                  <div className="avatar-header">
                    <div className="avatar-circle">{name?.charAt(0) || 'P'}</div>
                    <div>
                      <h3>{name}</h3>
                      <span className="badge-tag">{res.occupation || matchingPersona.occupation || 'Participant'}</span>
                    </div>
                  </div>

                  <div className="profile-details-grid">
                    <div className="detail-item">
                      <small>Age & Location</small>
                      <strong>{matchingPersona.age || '35 yrs'} • {matchingPersona.country || 'US'}</strong>
                    </div>
                    <div className="detail-item">
                      <small>Personality</small>
                      <strong>{matchingPersona.personality_traits || matchingPersona.player_personality}</strong>
                    </div>
                    <div className="detail-item">
                      <small>Psychological Profile</small>
                      <strong>{matchingPersona.psychological_profile}</strong>
                    </div>
                  </div>

                  <div className="persona-answer-box" style={{ marginTop: '12px' }}>
                    <div className="detailed-answer-text">
                      <p>"{ans.answer_text}"</p>
                    </div>

                    <div className="ans-meta" style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`sentiment-pill ${ans.sentiment?.toLowerCase() || 'neutral'}`}>
                        {ans.sentiment || 'Neutral'} Sentiment
                      </span>
                      {ans.rating && (
                        <span className="rating-badge">Rating: {ans.rating} / 5</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

