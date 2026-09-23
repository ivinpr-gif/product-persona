import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PersonaCard({ persona }) {
  const navigate = useNavigate();
  const personaName = persona.name || persona.player_name || 'Participant';
  const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(persona.avatar_seed || personaName)}`;
  const flags = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Canada': '🇨🇦',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Japan': '🇯🇵',
    'India': '🇮🇳',
    'Brazil': '🇧🇷',
    'South Korea': '🇰🇷',
    'Australia': '🇦🇺',
  };

  const firstName = personaName.split(' ')[0];

  return (
    <article className="persona-card">
      <div className="persona-card__header">
        <img className="persona-avatar" src={avatarUrl} alt={personaName} />
        <div>
          <h3>{personaName}</h3>
          <p className="persona-label">{persona.occupation || 'Research Participant'}</p>
        </div>
      </div>

      <div className="persona-badges">
        <span className="chip">{flags[persona.country] || '🌍'} {persona.country || 'Global'}</span>
        <span className="chip">{persona.age || persona.age_range || '35 yrs old'}</span>
        <span className="chip">{persona.gender || 'Any'}</span>
      </div>

      <div className="persona-details">
        <div className="detail-row">
          <strong>Occupation:</strong>
          <span>{persona.occupation}</span>
        </div>
        <div className="detail-row">
          <strong>Personality Traits:</strong>
          <span>{persona.personality_traits || persona.player_personality}</span>
        </div>
        <div className="detail-row">
          <strong>Behaviour:</strong>
          <span>{persona.behaviour || persona.behavior_summary}</span>
        </div>
        <div className="detail-row">
          <strong>Psychological Profile:</strong>
          <span>{persona.psychological_profile}</span>
        </div>
      </div>

      <div className="persona-card__actions" style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
        <button 
          className="secondary-button" 
          style={{ flex: 1, justifyContent: 'center', gap: '6px' }}
          onClick={() => navigate(`/interview?personaId=${persona.id || 1}`)}
        >
          💬 Interview {firstName}
        </button>
        <button 
          className="secondary-button" 
          style={{ flex: 1, justifyContent: 'center', gap: '6px' }}
          onClick={() => navigate(`/validation`)}
        >
          ⚡ Validate
        </button>
      </div>
    </article>
  );
}

