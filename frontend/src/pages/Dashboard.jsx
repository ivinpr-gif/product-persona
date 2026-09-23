import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { usePersonaContext } from '../context/PersonaContext';
import { downloadPdfReport } from '../utils/reportGenerator';

const SENTIMENT_COLORS = {
  Positive: '#10b981',
  Neutral: '#f59e0b',
  Hesitant: '#f59e0b',
  Negative: '#ef4444',
  Reject: '#ef4444',
};

export default function Dashboard() {
  const {
    personas,
    activePersonas,
    productContext,
  } = usePersonaContext();

  const [filterScope, setFilterScope] = useState('current');
  const targetPersonas = filterScope === 'current' ? (activePersonas && activePersonas.length > 0 ? activePersonas : personas) : personas;

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const reportContainerRef = useRef(null);

  const fetchReportData = async () => {
    if (targetPersonas.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const personaIds = targetPersonas.map((p) => p.id).filter(Boolean);
      const res = await axios.post('/api/reports/full-summary', {
        persona_ids: personaIds,
        product_description: productContext.product_description,
        target_audience: productContext.target_audience,
        research_objective: productContext.research_objective,
      });

      setReportData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate experiment results dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [targetPersonas.length, filterScope]);

  const handleDownloadPdf = async () => {
    if (!reportData) return;
    setDownloadingPdf(true);
    try {
      await downloadPdfReport(reportData, reportContainerRef.current);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (targetPersonas.length === 0) {
    return (
      <div className="page-stack">
        <section className="card empty-state">
          <h3>No Personas Available for Dashboard Analytics</h3>
          <p className="muted">Generate synthetic research personas first to visualize theme clusters, sentiment, key quotes, and download report.</p>
          <a className="primary-button" href="/generate">✦ Generate Personas First</a>
        </section>
      </div>
    );
  }

  // Format chart data
  const overallSentiment = reportData?.sentiment_breakdown || { Positive: 60, Neutral: 25, Negative: 15 };
  const pieData = [
    { name: 'Positive', value: Number(overallSentiment.Positive || overallSentiment.positive_pct || 60) },
    { name: 'Neutral / Hesitant', value: Number(overallSentiment.Neutral || overallSentiment.neutral_pct || 25) },
    { name: 'Negative', value: Number(overallSentiment.Negative || overallSentiment.negative_pct || 15) },
  ];

  const segmentData = reportData?.sentiment_by_segment?.map((seg) => ({
    name: seg.segment_name,
    Positive: Math.round(seg.positive_pct),
    Neutral: Math.round(seg.neutral_pct),
    Negative: Math.round(seg.negative_pct),
  })) || [
    { name: 'Tech Early Adopters', Positive: 80, Neutral: 15, Negative: 5 },
    { name: 'Price Conscious', Positive: 40, Neutral: 35, Negative: 25 },
    { name: 'Busy Professionals', Positive: 70, Neutral: 20, Negative: 10 },
  ];

  const personaScoreList = reportData?.adoption_scores?.persona_scores || [];
  const themeClusters = reportData?.theme_clusters || [];
  const keyQuotes = reportData?.key_quotes || [];

  return (
    <div className="page-stack">
      {/* Top Action Bar */}
      <section className="hero-card compact" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="eyebrow">Milestone 4 Analytics Suite</span>
          <h2>Insights & Experiment Results Dashboard</h2>
          <p className="muted">Comprehensive synthetic qualitative metrics, theme clusters, sentiment breakdown, persona quotes, and PDF research export.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="primary-button" onClick={handleDownloadPdf} disabled={loading || downloadingPdf}>
            {downloadingPdf ? '⏳ Generating PDF Document...' : '📥 Download Research Report (PDF)'}
          </button>
          <button className="secondary-button" onClick={fetchReportData} disabled={loading}>
            {loading ? '⚡ Analyzing...' : '🔄 Re-Run Full Analytics'}
          </button>
        </div>
      </section>

      {/* Scope Selector Bar */}
      <section className="card research-context-bar" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Product Context: </span>
            <strong style={{ color: '#00f6ff' }}>{productContext.product_description || 'Tested Product Concept'}</strong>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Scope:</span>
            <button
              type="button"
              className={`chip ${filterScope === 'current' ? 'active' : ''}`}
              style={{
                background: filterScope === 'current' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                color: filterScope === 'current' ? '#000' : '#fff',
                cursor: 'pointer',
                fontWeight: filterScope === 'current' ? '600' : 'normal',
              }}
              onClick={() => setFilterScope('current')}
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
                onClick={() => setFilterScope('all')}
              >
                🌐 All Historical ({personas.length})
              </button>
            )}
          </div>
        </div>
      </section>

      {loading && (
        <section className="card loading-state">
          <h3>Analyzing Experiment Results & Compiling Dashboard...</h3>
          <div className="skeleton" style={{ height: '32px', width: '100%', marginTop: '10px' }} />
          <div className="skeleton" style={{ height: '140px', width: '100%', marginTop: '12px' }} />
        </section>
      )}

      {error && <p className="error">{error}</p>}

      {/* DASHBOARD PRINT/CAPTURE CONTAINER */}
      {!loading && reportData && (
        <div ref={reportContainerRef} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* SECTION 1: EXECUTIVE KPI SUMMARY GRID */}
          <section className="section-block">
            <div className="metrics-summary-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <div className="metric-card card" style={{ background: 'rgba(0, 246, 255, 0.05)', border: '1px solid rgba(0, 246, 255, 0.3)' }}>
                <span className="metric-label">Overall Adoption Likelihood</span>
                <h2 className="metric-value accent-green">{Math.round(reportData.overall_adoption_score || 0)} / 100</h2>
                <small className="muted">Simulated aggregate score</small>
              </div>

              <div className="metric-card card" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <span className="metric-label">Validation Acceptance Rate</span>
                <h2 className="metric-value accent-green">{Math.round(reportData.acceptance_rate || 0)}%</h2>
                <small className="muted">Personas approving product concept</small>
              </div>

              <div className="metric-card card" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <span className="metric-label">Evaluated Personas</span>
                <h2 className="metric-value" style={{ color: '#f59e0b' }}>{reportData.total_personas_evaluated || 0}</h2>
                <small className="muted">Active synthetic participants</small>
              </div>

              <div className="metric-card card" style={{ background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <span className="metric-label">Extracted Persona Quotes</span>
                <h2 className="metric-value" style={{ color: '#a855f7' }}>{keyQuotes.length}</h2>
                <small className="muted">Verbatim feedback quotes</small>
              </div>
            </div>
          </section>

          {/* SECTION 2: THEME CLUSTERS VISUALIZER */}
          <section className="section-block card" style={{ padding: '24px' }}>
            <div className="section-title-row">
              <div>
                <h3>1. Recurring Theme Clusters</h3>
                <p className="muted">LLM-synthesized core themes derived from qualitative persona responses</p>
              </div>
            </div>

            {themeClusters.length > 0 ? (
              <div className="recommendations-grid" style={{ marginTop: '16px' }}>
                {themeClusters.map((t, idx) => (
                  <div key={idx} className="recommendation-box" style={{ background: '#18181b', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#fafafa', fontSize: '1.05rem' }}>{t.theme}</strong>
                      <span className="rating-badge" style={{ background: t.strength === 'High' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: t.strength === 'High' ? '#10b981' : '#f59e0b' }}>
                        {t.strength} Strength
                      </span>
                    </div>

                    <p style={{ marginTop: '8px', fontSize: '0.88rem', color: '#a1a1aa' }}>
                      <strong>Observed in:</strong> {t.observed_in || 'Multiple personas'}
                    </p>

                    {t.evidence_quote && (
                      <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--color-primary)', fontStyle: 'italic', fontSize: '0.85rem', color: '#d4d4d8' }}>
                        "{t.evidence_quote}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted" style={{ marginTop: '12px' }}>Theme clusters will automatically populate as personas engage in interviews and surveys.</p>
            )}
          </section>

          {/* SECTION 3: VISUAL SENTIMENT BREAKDOWN CHARTS */}
          <section className="section-block card" style={{ padding: '24px' }}>
            <div className="section-title-row">
              <div>
                <h3>2. Sentiment Breakdown Visualizations</h3>
                <p className="muted">Overall sentiment split & segment-level distribution</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '20px' }}>
              {/* Donut Chart: Overall Sentiment */}
              <div style={{ background: '#18181b', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '16px', color: '#e4e4e7' }}>Overall Sentiment Share</h4>
                <div style={{ height: '240px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={Object.values(SENTIMENT_COLORS)[index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => [`${val}%`, 'Share']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart: Segment Sentiment Distribution */}
              <div style={{ background: '#18181b', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '16px', color: '#e4e4e7' }}>Segment Sentiment Breakdown (%)</h4>
                <div style={{ height: '240px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={segmentData}>
                      <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} />
                      <YAxis stroke="#a1a1aa" fontSize={11} domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Positive" fill="#10b981" stackId="a" />
                      <Bar dataKey="Neutral" fill="#f59e0b" stackId="a" />
                      <Bar dataKey="Negative" fill="#ef4444" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: KEY PERSONA VERBATIM QUOTES HUB */}
          <section className="section-block card" style={{ padding: '24px' }}>
            <div className="section-title-row">
              <div>
                <h3>3. Key Persona Verbatim Quotes</h3>
                <p className="muted">Direct statements extracted from persona memory history during interactive sessions</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginTop: '16px' }}>
              {keyQuotes.map((q, idx) => (
                <div key={idx} style={{ background: '#18181b', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <img
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${q.avatar_seed}`}
                        alt={q.persona_name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#27272a' }}
                      />
                      <div>
                        <strong style={{ color: '#fafafa', fontSize: '0.95rem' }}>{q.persona_name}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>{q.occupation}</div>
                      </div>
                      <span className="rating-badge" style={{ marginLeft: 'auto', fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)' }}>
                        {q.context_tag}
                      </span>
                    </div>

                    <p style={{ fontStyle: 'italic', fontSize: '0.88rem', color: '#d4d4d8', lineHeight: '1.4' }}>
                      "{q.quote}"
                    </p>
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: SENTIMENT_COLORS[q.sentiment] || '#10b981', fontWeight: '600' }}>
                      ● {q.sentiment} Sentiment
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: PRODUCT VALIDATION & ADOPTION SCORES */}
          <section className="section-block card" style={{ padding: '24px' }}>
            <div className="section-title-row">
              <div>
                <h3>4. Persona Adoption & Product Validation Scores</h3>
                <p className="muted">Individual persona purchase intent & adoption score breakdown</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
              {personaScoreList.map((p, idx) => (
                <div key={idx} style={{ background: '#18181b', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ color: '#fafafa' }}>{p.name}</strong>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: p.score >= 70 ? '#10b981' : (p.score >= 50 ? '#f59e0b' : '#ef4444') }}>
                      {p.score} / 100
                    </span>
                  </div>
                  <small style={{ color: '#a1a1aa', display: 'block', marginBottom: '8px' }}>{p.occupation} • Stance: {p.stance}</small>

                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', height: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                    <div style={{ width: `${p.score}%`, height: '100%', background: p.score >= 70 ? '#10b981' : (p.score >= 50 ? '#f59e0b' : '#ef4444'), transition: 'width 0.4s ease' }} />
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#d4d4d8', marginBottom: '6px' }}>{p.reasoning}</p>
                  {p.key_motivator && (
                    <div style={{ fontSize: '0.78rem', color: '#10b981' }}>
                      <strong>Motivator:</strong> {p.key_motivator}
                    </div>
                  )}
                  {p.key_objection && (
                    <div style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '2px' }}>
                      <strong>Objection:</strong> {p.key_objection}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
