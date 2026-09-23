import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersonaContext } from '../context/PersonaContext';

export default function Home() {
  const navigate = useNavigate();
  const { personas } = usePersonaContext();

  const activePersonas = personas.slice(0, 4);

  return (
    <div className="page-stack">
      {/* Hero Banner */}
      <section className="hero-card">
        <div className="hero-content">
          <span className="eyebrow">AI Product Research Studio</span>
          <h2>Generate Realistic Product Personas & Simulate User Research</h2>
          <p className="muted">
            Transform product descriptions and research objectives into authentic synthetic consumer personas. Validate product ideas, conduct qualitative interviews, execute surveys, and synthesize behavioural insights.
          </p>

          <div className="capability-badges">
            <span className="badge-pill">⚡ Powered by LLM Intelligence</span>
            <span className="badge-pill">🧠 Consistent Psychological Profiles</span>
            <span className="badge-pill">📊 End-to-End User Research</span>
          </div>

          <div className="hero-actions" style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
            <button className="primary-button" onClick={() => navigate('/generate')}>
              ✦ Start Research & Generate Personas
            </button>
            {personas.length > 0 && (
              <button className="secondary-button" onClick={() => navigate('/validation')}>
                ⚡ Validate Product Intent
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Feature Workflow Hub Grid */}
      <section className="section-block">
        <div className="section-title-row">
          <h3>Core Platform Capabilities</h3>
          <p className="muted">Tools built for product managers, UX researchers, and brand strategists</p>
        </div>

        <div className="feature-hub-grid">
          <div className="hub-card" onClick={() => navigate('/generate')}>
            <div className="hub-icon">✦</div>
            <h4>LLM Persona Generation</h4>
            <p>Define product description, target audience, and research objective to generate realistic research participant cards.</p>
            <span className="hub-action-link">Create Personas →</span>
          </div>

          <div className="hub-card" onClick={() => navigate('/validation')}>
            <div className="hub-icon">⚡</div>
            <h4>Product Validation</h4>
            <p>Simulate product acceptance, rejection, purchase intent, perceived value, and brand switching triggers across personas.</p>
            <span className="hub-action-link">Run Validation →</span>
          </div>

          <div className="hub-card" onClick={() => navigate('/interview')}>
            <div className="hub-icon">💬</div>
            <h4>Interview Simulation</h4>
            <p>Conduct real-time qualitative user interviews. The LLM acts as the participant maintaining identity & persona memory.</p>
            <span className="hub-action-link">Start Qualitative Chat →</span>
          </div>

          <div className="hub-card" onClick={() => navigate('/survey')}>
            <div className="hub-icon">📊</div>
            <h4>Survey Simulator</h4>
            <p>Run quantitative and open-ended questions against personas to analyze aggregate sentiment and objections.</p>
            <span className="hub-action-link">Run Survey →</span>
          </div>

          <div className="hub-card" onClick={() => navigate('/insights')}>
            <div className="hub-icon">💡</div>
            <h4>Insight Agent & Adoption Scoring</h4>
            <p>Evaluate "Would Use This Product?" scores (0-100) per persona & segment, plus objective-aware theme extraction.</p>
            <span className="hub-action-link">View Adoption Scores →</span>
          </div>

          <div className="hub-card" onClick={() => navigate('/dashboard')}>
            <div className="hub-icon">📈</div>
            <h4>Results Dashboard & PDF Report</h4>
            <p>Visualize theme clusters, sentiment charts, key verbatim persona quotes, and export structured downloadable PDF report.</p>
            <span className="hub-action-link">Open Dashboard & Export →</span>
          </div>

          <div className="hub-card" onClick={() => navigate('/quality-lab')}>
            <div className="hub-icon">🧪</div>
            <h4>Scenario Quality Lab</h4>
            <p>Test insight extraction accuracy, theme relevance, evidence traceability, and hallucination prevention across research scenarios.</p>
            <span className="hub-action-link">Open Quality Lab →</span>
          </div>
        </div>
      </section>


      {/* 3-Step Visual Workflow */}
      <section className="section-block">
        <div className="section-title-row">
          <h3>How The Research Objective Flows</h3>
          <p className="muted">3 steps from product definition to actionable strategy</p>
        </div>

        <div className="how-it-works-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h4>Define Context & Objective</h4>
            <p>Provide product description, target audience parameters, and your specific research objective.</p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h4>Generate Diverse Personas</h4>
            <p>AI creates authentic profiles with occupations, personality traits, behaviour, and psychological characteristics.</p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h4>Simulate & Extract Insights</h4>
            <p>Run validation, interviews, and surveys to extract empirical behavioural patterns and strategic recommendations.</p>
          </div>
        </div>
      </section>

      {/* Active Personas Quick Launcher */}
      {activePersonas.length > 0 && (
        <section className="section-block">
          <div className="selector-header-row">
            <div>
              <h3>Active Research Participants</h3>
              <p className="muted">Select a persona to begin qualitative interview or validation testing</p>
            </div>
            <button className="secondary-button" onClick={() => navigate('/personas')}>
              View All Personas ({personas.length}) →
            </button>
          </div>

          <div className="persona-snapshot-grid" style={{ marginTop: '14px' }}>
            {activePersonas.map((persona) => (
              <div 
                className="snapshot-item clickable" 
                key={persona.id || persona.name}
                onClick={() => navigate(`/interview?personaId=${persona.id || 1}`)}
              >
                <div className="snapshot-dot-status" />
                <div className="snapshot-info">
                  <strong>{persona.name || persona.player_name}</strong>
                  <span>{persona.occupation} • {persona.age || persona.age_range}</span>
                </div>
                <span className="snapshot-arrow">💬 Interview →</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

