import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePersonaContext } from '../context/PersonaContext';

export default function ScenarioQualityLab() {
  const { productContext } = usePersonaContext();

  const [presets, setPresets] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState('high_adoption');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/scenarios/presets').then((res) => {
      setPresets(res.data || []);
    }).catch(() => {});
  }, []);

  const runQualityValidation = async (scenId = selectedScenarioId) => {
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/quality-validation', {
        scenario_id: scenId,
        product_description: productContext.product_description,
        target_audience: productContext.target_audience,
        research_objective: productContext.research_objective,
      });

      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Quality validation failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runQualityValidation('high_adoption');
  }, []);

  const handleSelectScenario = (scenId) => {
    setSelectedScenarioId(scenId);
    runQualityValidation(scenId);
  };

  return (
    <div className="page-stack">
      {/* Header */}
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Research Quality Assurance & Testing</p>
          <h2>Insight Extraction Quality Validation Lab</h2>
          <p className="muted">
            Evaluates theme relevance, evidence traceability, sentiment accuracy, and hallucination prevention across varied research scenarios.
          </p>
        </div>
      </section>

      {/* Scenario Presets Row */}
      <section className="card presets-card">
        <h4>🧪 Select Experiment Research Scenario</h4>
        <div className="quick-presets-row" style={{ marginTop: '10px' }}>
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`quick-preset-button ${selectedScenarioId === p.id ? 'active-preset' : ''}`}
              onClick={() => handleSelectScenario(p.id)}
              style={{
                borderColor: selectedScenarioId === p.id ? 'var(--color-primary)' : 'var(--color-border)',
                background: selectedScenarioId === p.id ? 'rgba(0, 255, 135, 0.1)' : 'rgba(255, 255, 255, 0.04)',
              }}
            >
              <strong>{p.name}</strong>
            </button>
          ))}
        </div>
      </section>

      {/* Loading Skeleton */}
      {loading && (
        <section className="card loading-state">
          <h3>Running Scenario Quality Validation...</h3>
          <p className="muted">Verifying evidence traceability, theme alignment, and hallucination checks.</p>
          <div className="skeleton" style={{ height: '32px', width: '100%' }} />
          <div className="skeleton" style={{ height: '140px', width: '100%', marginTop: '12px' }} />
        </section>
      )}

      {error && <p className="error">{error}</p>}

      {/* Validation Report Card */}
      {report && !loading && (
        <>
          <section className="metrics-summary-grid">
            <div className="metric-card card">
              <span className="metric-label">Theme Relevance</span>
              <h2 className="metric-value accent-green">{report.theme_relevance_score}%</h2>
              <small className="muted">Degree to which extracted themes align with persona responses</small>
            </div>
            <div className="metric-card card">
              <span className="metric-label">Evidence Traceability</span>
              <h2 className="metric-value accent-green">{report.evidence_traceability_score}%</h2>
              <small className="muted">Percentage of findings backed by participant quotes</small>
            </div>
            <div className="metric-card card">
              <span className="metric-label">Sentiment Accuracy</span>
              <h2 className="metric-value accent-green">{report.sentiment_accuracy_score}%</h2>
              <small className="muted">Classification accuracy against persona profiles</small>
            </div>
            <div className="metric-card card">
              <span className="metric-label">Hallucination Check</span>
              <h2 className="metric-value accent-green">{report.hallucination_free_check ? 'PASS ✓' : 'FAIL ✗'}</h2>
              <small className="muted">Zero ungrounded or fabricated claims detected</small>
            </div>
          </section>

          {/* Validation Summary */}
          <section className="card">
            <div className="insight-card-header">
              <span className="insight-icon">🔍</span>
              <h3>Quality Validation Summary for {report.scenario_name}</h3>
            </div>
            <p style={{ marginTop: '10px', fontSize: '0.92rem', color: '#f4f4f5', lineHeight: '1.5' }}>
              {report.validation_summary}
            </p>
          </section>

          {/* Evidence Traceability Audit Matrix */}
          <section className="section-block">
            <div className="section-title-row">
              <h3>Evidence Traceability & Audit Matrix</h3>
              <p className="muted">Detailed check log verifying zero hallucination and high empirical alignment</p>
            </div>

            <div className="insights-grid">
              {report.evidence_findings?.map((finding, idx) => (
                <div key={idx} className="insight-card card">
                  <div className="insight-card-header" style={{ justifyContent: 'space-between' }}>
                    <strong style={{ color: '#fafafa', fontSize: '1rem' }}>{finding.check_name}</strong>
                    <span className="stance-badge stance-accept" style={{ fontSize: '0.75rem' }}>
                      {finding.status}
                    </span>
                  </div>
                  <p style={{ marginTop: '8px', fontSize: '0.86rem', color: '#d4d4d8', lineHeight: '1.45' }}>
                    {finding.evidence}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
