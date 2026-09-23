import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePersonaContext } from '../context/PersonaContext';

export default function ProductValidation() {
  const { personas, activePersonas, productContext, validationResults, setValidationResults } = usePersonaContext();
  const targetPersonas = activePersonas && activePersonas.length > 0 ? activePersonas : personas;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runValidation = async () => {
    if (targetPersonas.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/product-validation', {
        persona_ids: targetPersonas.map((p) => p.id).filter(Boolean),
        product_description: productContext.product_description,
        target_audience: productContext.target_audience,
        research_objective: productContext.research_objective,
      });

      setValidationResults(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Product validation evaluation failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!validationResults && targetPersonas.length > 0) {
      runValidation();
    }
  }, [targetPersonas]);

  if (personas.length === 0) {
    return (
      <div className="page-stack">
        <section className="card empty-state">
          <h3>No Personas Available for Validation</h3>
          <p className="muted">Generate synthetic research personas first to unlock Product Validation mode.</p>
          <a className="primary-button" href="/generate">Generate Research Personas</a>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      {/* Header Banner */}
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Product Validation Mode</p>
          <h2>Simulated Product Market Validation</h2>
          <p className="muted">
            Evaluates persona acceptance, rejection, purchase intent scores, perceived value, and brand switching triggers based on your research objective.
          </p>
        </div>
      </section>

      {/* Active Product Research Context */}
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
        <div style={{ marginTop: '14px' }}>
          <button className="secondary-button" onClick={runValidation} disabled={loading}>
            {loading ? '⚡ Re-evaluating Persona Reactions...' : '🔄 Re-run Product Validation'}
          </button>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="card loading-state">
          <h3>Simulating Product Validation across {personas.length} Personas...</h3>
          <p className="muted">Evaluating individual willingness to switch, price perception, objections, and purchase intent.</p>
          <div className="skeleton" style={{ height: '24px', margin: '8px 0' }} />
          <div className="skeleton" style={{ height: '120px' }} />
        </section>
      )}

      {error && <p className="error">{error}</p>}

      {/* Validation Results Metrics */}
      {validationResults && !loading && (
        <>
          <section className="metrics-summary-grid">
            <div className="metric-card card">
              <span className="metric-label">Acceptance & Switching</span>
              <h2 className="metric-value accent-green">{validationResults.acceptance_rate}%</h2>
              <small className="muted">Percentage of personas open to adopting/switching to product</small>
            </div>
            <div className="metric-card card">
              <span className="metric-label">Uncertain / Cautious</span>
              <h2 className="metric-value accent-yellow">{validationResults.uncertainty_rate}%</h2>
              <small className="muted">Percentage requiring further trial, sample, or proof</small>
            </div>
            <div className="metric-card card">
              <span className="metric-label">Rejection Rate</span>
              <h2 className="metric-value accent-red">{validationResults.rejection_rate}%</h2>
              <small className="muted">Percentage unwilling to switch from incumbent brand</small>
            </div>
            <div className="metric-card card">
              <span className="metric-label">Avg Purchase Intent</span>
              <h2 className="metric-value">{validationResults.average_purchase_intent} / 10</h2>
              <small className="muted">Aggregate purchase intent score across all personas</small>
            </div>
          </section>

          {/* Individual Persona Stance Evaluations */}
          <section className="section-block">
            <div className="section-title-row">
              <h3>Persona Stance Evaluations</h3>
              <p className="muted">Detailed rationale and switching triggers per participant</p>
            </div>

            <div className="validation-cards-grid">
              {validationResults.persona_evaluations?.map((item, idx) => (
                <div key={item.persona_id || idx} className="validation-card card">
                  <div className="validation-header">
                    <div>
                      <h3>{item.name}</h3>
                      <p className="persona-label">{item.occupation}</p>
                    </div>
                    <span className={`stance-badge stance-${item.stance?.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.stance}
                    </span>
                  </div>

                  <div className="intent-meter">
                    <div className="intent-header">
                      <span>Purchase Intent Score</span>
                      <strong>{item.purchase_intent_score} / 10</strong>
                    </div>
                    <div className="meter-bar">
                      <div
                        className="meter-fill"
                        style={{
                          width: `${item.purchase_intent_score * 10}%`,
                          backgroundColor:
                            item.purchase_intent_score >= 7
                              ? 'var(--accent-green, #10b981)'
                              : item.purchase_intent_score >= 4
                              ? 'var(--accent-yellow, #f59e0b)'
                              : 'var(--accent-red, #ef4444)',
                        }}
                      />
                    </div>
                  </div>

                  <div className="validation-details">
                    <p><strong>Perceived Value:</strong> {item.perceived_value}</p>
                    
                    <div className="bullet-list-block">
                      <strong>Main Motivators:</strong>
                      <ul>
                        {item.main_motivators?.map((m, i) => (
                          <li key={i}>✓ {m}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bullet-list-block">
                      <strong>Main Concerns / Objections:</strong>
                      <ul>
                        {item.main_concerns?.map((c, i) => (
                          <li key={i} className="objection-item">⚠️ {c}</li>
                        ))}
                      </ul>
                    </div>

                    <p><strong>Switching Trigger:</strong> {item.switching_triggers}</p>

                    <div className="verdict-box">
                      <p><em>"{item.verdict_summary}"</em></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
