import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePersonaContext } from '../context/PersonaContext';

export default function BehaviouralInsights() {
  const navigate = useNavigate();
  const {
    personas,
    activePersonas,
    productContext,
    insightResults,
    setInsightResults,
    adoptionScores,
    setAdoptionScores,
  } = usePersonaContext();

  const [filterScope, setFilterScope] = useState('current');
  const targetPersonas = filterScope === 'current' ? (activePersonas && activePersonas.length > 0 ? activePersonas : personas) : personas;

  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingScores, setLoadingScores] = useState(false);
  const [error, setError] = useState('');

  const fetchInsightsAndScores = async () => {
    if (targetPersonas.length === 0) return;
    setLoadingInsights(true);
    setLoadingScores(true);
    setError('');

    try {
      const personaIds = targetPersonas.map((p) => p.id).filter(Boolean);
      const [insightsRes, scoresRes] = await Promise.all([
        axios.post('/api/insights/extract', {
          persona_ids: personaIds,
          product_description: productContext.product_description,
          target_audience: productContext.target_audience,
          research_objective: productContext.research_objective,
        }),
        axios.post('/api/adoption-scores', {
          persona_ids: personaIds,
          product_description: productContext.product_description,
          target_audience: productContext.target_audience,
          research_objective: productContext.research_objective,
        }),
      ]);

      setInsightResults(insightsRes.data);
      setAdoptionScores(scoresRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Insight extraction & adoption scoring failed.');
    } finally {
      setLoadingInsights(false);
      setLoadingScores(false);
    }
  };

  useEffect(() => {
    if ((!insightResults || !adoptionScores) && targetPersonas.length > 0) {
      fetchInsightsAndScores();
    }
  }, [targetPersonas, filterScope]);

  if (targetPersonas.length === 0) {
    return (
      <div className="page-stack">
        <section className="card empty-state">
          <h3>No Personas Available for Insight Agent</h3>
          <p className="muted">Generate synthetic research personas first to extract LLM-powered insights and product adoption scores.</p>
          <a className="primary-button" href="/generate">Generate Personas</a>
        </section>
      </div>
    );
  }

  const isLoading = loadingInsights || loadingScores;

  return (
    <div className="page-stack">
      {/* Header */}
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">LLM Research Analytics Agent</p>
          <h2>Insight Agent & Product Adoption Scoring</h2>
          <p className="muted">
            Objective-aware research insight agent evaluating recurring themes with evidence support, sentiment by segment, agreement patterns, and "Would Use This Product?" adoption scores.
          </p>
        </div>
      </section>

      {/* Research Context Bar */}
      <section className="card research-context-bar">
        <div className="context-grid">
          <div>
            <small className="muted">Product Description</small>
            <p><strong>{productContext.product_description || 'N/A'}</strong></p>
          </div>
          <div>
            <small className="muted">Target Audience</small>
            <p><strong>{productContext.target_audience || 'N/A'}</strong></p>
          </div>
          <div>
            <small className="muted">Research Objective</small>
            <p><strong>{productContext.research_objective || 'N/A'}</strong></p>
          </div>
        </div>
        <div style={{ marginTop: '14px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="secondary-button" onClick={fetchInsightsAndScores} disabled={isLoading}>
            {isLoading ? '⚡ Analyzing Research Data...' : '🔄 Re-run Insight Agent & Adoption Scoring'}
          </button>
          <button className="primary-button" onClick={() => navigate('/dashboard')}>
            📈 Open Results Dashboard & Export PDF →
          </button>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Analysis Scope:</span>
            <button
              type="button"
              className={`chip ${filterScope === 'current' ? 'active' : ''}`}
              style={{
                background: filterScope === 'current' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                color: filterScope === 'current' ? '#000' : '#fff',
                cursor: 'pointer',
                fontWeight: filterScope === 'current' ? '600' : 'normal',
              }}
              onClick={() => {
                setFilterScope('current');
                setInsightResults(null);
                setAdoptionScores(null);
              }}
            >
              ✨ Currently Generated ({activePersonas?.length || 0})
            </button>
            {personas.length > (activePersonas?.length || 0) && (
              <button
                type="button"
                className={`chip ${filterScope === 'all' ? 'active' : ''}`}
                style={{
                  background: filterScope === 'all' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                  color: filterScope === 'all' ? '#000' : '#fff',
                  cursor: 'pointer',
                  fontWeight: filterScope === 'all' ? '600' : 'normal',
                }}
                onClick={() => {
                  setFilterScope('all');
                  setInsightResults(null);
                  setAdoptionScores(null);
                }}
              >
                🌐 All Historical ({personas.length})
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Disclaimer Notice */}
      <div className="disclaimer-banner card">
        <small className="muted">
          ℹ️ <strong>AI-Simulated Research Findings Notice:</strong> All scores, sentiment breakdowns, and themes are derived from AI-simulated personas and responses. They represent synthetic qualitative analytics for product testing.
        </small>
      </div>

      {isLoading && (
        <section className="card loading-state">
          <h3>Insight Extraction Agent Analyzing {targetPersonas.length} Personas...</h3>
          <p className="muted">Synthesizing recurring themes, checking evidence traceability, and calculating adoption likelihood scores.</p>
          <div className="skeleton" style={{ height: '32px', width: '100%' }} />
          <div className="skeleton" style={{ height: '140px', width: '100%', marginTop: '12px' }} />
        </section>
      )}

      {error && <p className="error">{error}</p>}

      {/* SECTION 1: WOULD USE THIS PRODUCT? ADOPTION SCOREBOARD */}
      {adoptionScores && !isLoading && (
        <section className="section-block card" style={{ padding: '24px' }}>
          <div className="section-title-row">
            <h3>"Would Use This Product?" Adoption Scoreboard</h3>
            <p className="muted">Simulated adoption likelihood scores calculated dynamically per persona and segment</p>
          </div>

          <div className="metrics-summary-grid" style={{ marginTop: '16px' }}>
            <div className="metric-card card" style={{ background: 'rgba(0, 255, 135, 0.05)', border: '1px solid rgba(0, 255, 135, 0.3)' }}>
              <span className="metric-label">Overall Adoption Likelihood</span>
              <h2 className="metric-value accent-green">{Math.round(adoptionScores.overall_adoption_score)} / 100</h2>
              <small className="muted">{adoptionScores.overall_summary}</small>
            </div>
          </div>

          {/* Segment-Level Aggregated Scores */}
          <div style={{ marginTop: '20px' }}>
            <h4>Segment-Level Adoption Scores</h4>
            <div className="recommendations-grid" style={{ marginTop: '10px' }}>
              {adoptionScores.segment_scores?.map((seg, idx) => (
                <div key={idx} className="recommendation-box" style={{ background: '#18181b', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#fafafa', fontSize: '1rem' }}>{seg.segment_name}</strong>
                    <span className="rating-badge" style={{ fontSize: '1rem' }}>{Math.round(seg.average_score)} / 100</span>
                  </div>
                  <p style={{ marginTop: '6px', fontSize: '0.86rem', color: '#d4d4d8' }}>{seg.segment_reasoning}</p>

                  {seg.main_motivations?.length > 0 && (
                    <div style={{ marginTop: '6px', fontSize: '0.8rem' }}>
                      <strong style={{ color: '#10b981' }}>Key Motivations:</strong>
                      <ul style={{ paddingLeft: '14px', margin: '2px 0 0', color: '#a1a1aa' }}>
                        {seg.main_motivations.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                  )}

                  {seg.main_objections?.length > 0 && (
                    <div style={{ marginTop: '6px', fontSize: '0.8rem' }}>
                      <strong style={{ color: '#fbbf24' }}>Main Objections:</strong>
                      <ul style={{ paddingLeft: '14px', margin: '2px 0 0', color: '#fbbf24' }}>
                        {seg.main_objections.map((o, i) => <li key={i}>{o}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Persona-Level Scores */}
          <div style={{ marginTop: '20px' }}>
            <h4>Persona-Level Score Reasoning</h4>
            <div className="validation-cards-grid" style={{ marginTop: '10px' }}>
              {adoptionScores.persona_scores?.map((pScore, idx) => (
                <div key={pScore.persona_id || idx} className="validation-card card">
                  <div className="validation-header">
                    <div>
                      <h3>{pScore.name}</h3>
                      <p className="persona-label">{pScore.occupation}</p>
                    </div>
                    <span className={`stance-badge ${pScore.score >= 70 ? 'stance-accept' : pScore.score >= 45 ? 'stance-uncertain' : 'stance-reject'}`}>
                      {pScore.score} / 100
                    </span>
                  </div>

                  <div className="intent-meter">
                    <div className="intent-header">
                      <span>Adoption Score</span>
                      <strong>{pScore.score} / 100</strong>
                    </div>
                    <div className="meter-bar">
                      <div
                        className="meter-fill"
                        style={{
                          width: `${pScore.score}%`,
                          backgroundColor:
                            pScore.score >= 70 ? '#10b981' : pScore.score >= 45 ? '#f59e0b' : '#ef4444',
                        }}
                      />
                    </div>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: '#e4e4e7' }}><strong>Reasoning:</strong> {pScore.reasoning}</p>
                  <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p><strong style={{ color: '#10b981' }}>Motivator:</strong> {pScore.key_motivator}</p>
                    <p><strong style={{ color: '#fbbf24' }}>Objection:</strong> {pScore.key_objection}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: INSIGHT EXTRACTION AGENT FINDINGS */}
      {insightResults && !isLoading && (
        <div className="insights-container" style={{ marginTop: '20px' }}>
          {/* Research Objective Direct Findings */}
          {insightResults.research_objective_findings?.length > 0 && (
            <div className="card" style={{ background: 'rgba(0, 255, 135, 0.04)', border: '1px solid rgba(0, 255, 135, 0.3)' }}>
              <div className="insight-card-header">
                <span className="insight-icon">🎯</span>
                <h3>Research Objective Analysis</h3>
              </div>
              <ul className="insight-list" style={{ marginTop: '8px' }}>
                {insightResults.research_objective_findings.map((finding, idx) => (
                  <li key={idx} style={{ fontSize: '0.92rem', color: '#fafafa', fontWeight: 500 }}>
                    📌 {finding}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recurring Themes with Evidence Support */}
          {insightResults.recurring_themes?.length > 0 && (
            <div className="section-block">
              <div className="section-title-row">
                <h3>Recurring Themes & Evidence Traceability</h3>
                <p className="muted">Extracted patterns supported by simulated participant evidence</p>
              </div>

              <div className="insights-grid">
                {insightResults.recurring_themes.map((themeItem, idx) => (
                  <div key={idx} className="insight-card card">
                    <div className="insight-card-header">
                      <span className="insight-icon">💡</span>
                      <div>
                        <h3>{themeItem.theme}</h3>
                        <span className="chip" style={{ fontSize: '0.72rem', marginTop: '2px' }}>
                          {themeItem.observed_in}
                        </span>
                      </div>
                    </div>

                    <div className="verdict-box" style={{ marginTop: '8px' }}>
                      <p><em>"{themeItem.evidence_quote}"</em></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sentiment Breakdown by Segment */}
          {insightResults.sentiment_by_segment?.length > 0 && (
            <div className="card" style={{ marginTop: '10px' }}>
              <div className="insight-card-header">
                <span className="insight-icon">📊</span>
                <h3>Sentiment Breakdown by Persona Segment</h3>
              </div>
              <div className="recommendations-grid" style={{ marginTop: '12px' }}>
                {insightResults.sentiment_by_segment.map((segSent, idx) => (
                  <div key={idx} className="recommendation-box" style={{ background: '#18181b' }}>
                    <strong>{segSent.segment_name}</strong>
                    <div className="sentiment-bar-container" style={{ marginTop: '8px' }}>
                      <div className="bar-segment positive-bar" style={{ width: `${segSent.positive_pct}%` }}>
                        {segSent.positive_pct > 0 && `${Math.round(segSent.positive_pct)}% Pos`}
                      </div>
                      <div className="bar-segment neutral-bar" style={{ width: `${segSent.neutral_pct}%` }}>
                        {segSent.neutral_pct > 0 && `${Math.round(segSent.neutral_pct)}% Neu`}
                      </div>
                      <div className="bar-segment negative-bar" style={{ width: `${segSent.negative_pct}%` }}>
                        {segSent.negative_pct > 0 && `${Math.round(segSent.negative_pct)}% Neg`}
                      </div>
                    </div>
                    <small className="muted" style={{ marginTop: '6px' }}>Key Driver: {segSent.key_driver}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agreement vs Disagreement Patterns */}
          <div className="insights-grid" style={{ marginTop: '10px' }}>
            {insightResults.agreement_patterns?.length > 0 && (
              <div className="insight-card card">
                <div className="insight-card-header">
                  <span className="insight-icon">🤝</span>
                  <h3>Agreement Patterns</h3>
                </div>
                <ul className="insight-list">
                  {insightResults.agreement_patterns.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.topic}:</strong> {item.summary} ({item.supporting_personas_count} personas agree)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insightResults.disagreement_patterns?.length > 0 && (
              <div className="insight-card card">
                <div className="insight-card-header">
                  <span className="insight-icon">⚡</span>
                  <h3>Disagreement & Contrasts</h3>
                </div>
                <ul className="insight-list">
                  {insightResults.disagreement_patterns.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.topic}:</strong> {item.viewpoint_a} <em>vs</em> {item.viewpoint_b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

