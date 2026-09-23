import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { usePersonaContext } from '../context/PersonaContext';

export default function PersonaInterview() {
  const { personas, latestBatch, productContext, deleteAllPersonas, updatePersonaMemory, structuredMemories } = usePersonaContext();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialScope = searchParams.get('filter') === 'all' ? 'all' : (latestBatch.length > 0 ? 'latest' : 'all');
  const [filterScope, setFilterScope] = useState(initialScope);

  const activePersonaList = filterScope === 'latest' && latestBatch.length > 0 ? latestBatch : personas;

  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-select persona based on URL parameter or active list
  useEffect(() => {
    const targetPersonaId = searchParams.get('personaId') ? parseInt(searchParams.get('personaId'), 10) : null;
    if (targetPersonaId && personas.some((p) => p.id === targetPersonaId)) {
      setSelectedId(targetPersonaId);
      if (latestBatch.some((p) => p.id === targetPersonaId)) {
        setFilterScope('latest');
      } else {
        setFilterScope('all');
      }
    } else if (activePersonaList.length > 0) {
      const exists = activePersonaList.some((p) => p.id === selectedId);
      if (!exists) {
        setSelectedId(activePersonaList[0].id || 1);
      }
    }
  }, [activePersonaList, location.search]);

  const activePersona = activePersonaList.find((p) => p.id === selectedId) || activePersonaList[0];

  const [structuredMem, setStructuredMem] = useState(null);

  // Sync persona memory context into messages array when persona selection changes
  useEffect(() => {
    if (activePersona) {
      let memory = activePersona.memory_json || [];
      if (typeof memory === 'string') {
        try {
          memory = JSON.parse(memory);
        } catch (e) {
          memory = [];
        }
      }
      setMessages(memory);
      setStructuredMem(
        activePersona.structured_memory ||
        (structuredMemories && activePersona.id ? structuredMemories[activePersona.id] : null) ||
        null
      );
    }
  }, [selectedId, activePersona?.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activePersona) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setError('');

    const tempMessages = [...messages, { role: 'user', content: userText }];
    setMessages(tempMessages);
    setLoading(true);

    try {
      const targetId = activePersona.id || 1;
      const res = await axios.post(`/api/personas/${targetId}/interview`, {
        message: userText,
        product_description: productContext.product_description,
        research_objective: productContext.research_objective,
      });

      const updatedMem = res.data.updated_memory || tempMessages;
      const newStruct = res.data.structured_memory || null;

      setMessages(updatedMem);
      if (newStruct) {
        setStructuredMem(newStruct);
      }
      updatePersonaMemory(targetId, updatedMem, newStruct);
    } catch (err) {
      setError(err.response?.data?.detail || 'Interview response generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleClearMemory = async () => {
    if (!activePersona) return;
    try {
      const targetId = activePersona.id || 1;
      await axios.delete(`/api/personas/${targetId}/memory`);
      setMessages([]);
      updatePersonaMemory(targetId, []);
    } catch (err) {
      setError('Failed to clear persona memory.');
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm('Delete all stored personas from the database and start fresh?')) {
      await deleteAllPersonas();
      setMessages([]);
      setSelectedId(null);
    }
  };

  if (personas.length === 0) {
    return (
      <div className="page-stack">
        <section className="card empty-state">
          <h3>No Personas Available for Interview</h3>
          <p className="muted">Generate product personas first to conduct qualitative user interviews.</p>
          <a className="primary-button" href="/generate">Generate Personas</a>
        </section>
      </div>
    );
  }

  const pName = activePersona?.name || activePersona?.player_name || 'Participant';

  return (
    <div className="page-stack">
      {/* Header */}
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Qualitative Research Studio</p>
          <h2>Product User Research Interview</h2>
          <p className="muted">
            Conduct multi-turn qualitative interviews with synthetic personas. The AI acts strictly as the research participant, maintaining consistent psychological traits and conversation history.
          </p>
        </div>
      </section>

      {/* Scope Filter Switcher */}
      <section className="card filter-scope-bar">
        <div className="filter-scope-row">
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
              🗄️ All Database Personas ({personas.length})
            </button>
          </div>

          <button type="button" className="danger-text-btn" onClick={handleClearAllData}>
            🗑️ Clear All Stored Data
          </button>
        </div>
      </section>

      <div className="interview-layout">
        {/* Left Column: Persona Profile & Identity */}
        <aside className="interview-sidebar card">
          <label className="filter-field">
            <span>Select Participant ({activePersonaList.length} shown)</span>
            <select
              value={selectedId || ''}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              {activePersonaList.map((p) => {
                const name = p.name || p.player_name;
                return (
                  <option key={p.id || name} value={p.id}>
                    {name} ({p.occupation})
                  </option>
                );
              })}
            </select>
          </label>

          {activePersona && (
            <div className="persona-profile-badge" style={{ marginTop: '14px' }}>
              <div className="avatar-header">
                <div className="avatar-circle">{pName.charAt(0)}</div>
                <div>
                  <h3>{pName}</h3>
                  <span className="badge-tag">{activePersona.occupation}</span>
                </div>
              </div>

              <div className="profile-details-grid">
                <div className="detail-item">
                  <small>Age & Location</small>
                  <strong>{activePersona.age || activePersona.age_range} • {activePersona.country}</strong>
                </div>
                <div className="detail-item">
                  <small>Personality Traits</small>
                  <strong>{activePersona.personality_traits || activePersona.player_personality}</strong>
                </div>
                <div className="detail-item">
                  <small>Behaviour</small>
                  <strong>{activePersona.behaviour || activePersona.behavior_summary}</strong>
                </div>
                <div className="detail-item">
                  <small>Psychological Profile</small>
                  <strong>{activePersona.psychological_profile}</strong>
                </div>
              </div>

              {structuredMem && (
                <div className="structured-memory-card" style={{ marginTop: '14px', background: 'rgba(0, 255, 135, 0.03)', border: '1px solid rgba(0, 255, 135, 0.2)', padding: '12px', borderRadius: '10px' }}>
                  <small style={{ color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🧠 Active Persona Memory</small>
                  
                  <div style={{ marginTop: '6px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div><strong>Brand Loyalty:</strong> <span className="chip" style={{ fontSize: '0.7rem' }}>{structuredMem.brand_loyalty || 'Moderate'}</span></div>
                    <div><strong>Price Sensitivity:</strong> <span className="chip" style={{ fontSize: '0.7rem' }}>{structuredMem.price_sensitivity || 'Moderate'}</span></div>
                    
                    {structuredMem.stated_preferences?.length > 0 && (
                      <div style={{ marginTop: '4px' }}>
                        <strong style={{ color: '#d4d4d8' }}>Stated Preferences:</strong>
                        <ul style={{ paddingLeft: '14px', margin: '2px 0 0', color: 'var(--color-text-muted)' }}>
                          {structuredMem.stated_preferences.map((pref, i) => (
                            <li key={i}>{pref}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {structuredMem.product_concerns?.length > 0 && (
                      <div style={{ marginTop: '4px' }}>
                        <strong style={{ color: '#fbbf24' }}>Main Concerns:</strong>
                        <ul style={{ paddingLeft: '14px', margin: '2px 0 0', color: '#fbbf24' }}>
                          {structuredMem.product_concerns.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button className="secondary-button clear-mem-btn" onClick={handleClearMemory} style={{ marginTop: '16px', width: '100%' }}>
                Reset Conversation Memory
              </button>
            </div>
          )}

        </aside>

        {/* Right Column: Multi-Turn Conversation Window */}
        <main className="interview-chat-container card">
          <div className="chat-header">
            <div>
              <h3>Interviewing {pName}</h3>
              <small className="muted">Multi-turn dynamic memory active • {messages.length} turns</small>
            </div>
          </div>

          <div className="messages-body">
            {messages.length === 0 ? (
              <div className="empty-chat-state">
                <p>💬 Ask <strong>{pName}</strong> a question about their habits, product concerns, or willingness to switch.</p>
                <small className="muted">Example questions:</small>
                <div className="prompt-suggestions" style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button className="suggestion-pill" onClick={() => setInputMessage("What do you think about this product description?")}>
                    "What do you think about this product description?"
                  </button>
                  <button className="suggestion-pill" onClick={() => setInputMessage("What would make you switch from the brand you currently use?")}>
                    "What would make you switch from the brand you currently use?"
                  </button>
                  <button className="suggestion-pill" onClick={() => setInputMessage("What is your biggest concern or objection regarding this product?")}>
                    "What is your biggest concern or objection regarding this product?"
                  </button>
                </div>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} className={`chat-bubble ${m.role === 'user' ? 'user-bubble' : 'persona-bubble'}`}>
                  {m.role === 'assistant' && (
                    <div className="bubble-header">
                      <strong>{pName}</strong>
                      <span className="mini-tag">{activePersona?.occupation}</span>
                    </div>
                  )}
                  <p>{m.content}</p>
                </div>
              ))
            )}
            {loading && (
              <div className="chat-bubble persona-bubble typing-indicator">
                <p><em>{pName} is typing a response...</em></p>
              </div>
            )}
          </div>

          {error && <p className="error">{error}</p>}

          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder={`Ask ${pName} a question... (e.g. "Would you switch to this product?")`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="primary-button" disabled={loading || !inputMessage.trim()}>
              Send Message
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

