import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GeneratorForm from '../components/GeneratorForm';
import PersonaCard from '../components/PersonaCard';
import { usePersonaContext } from '../context/PersonaContext';

const initialForm = {
  product_description: 'A natural herbal soap designed for people with sensitive skin and made using organic ingredients.',
  target_audience: 'Age: 50–60, Location: India, Gender: Any, Lifestyle: Health-conscious',
  research_objective: 'Understand how many people prefer a different soap, key purchase drivers, and willingness to switch.',
  number_of_personas: 4,
};

const quickPresets = [
  {
    label: '🌿 Natural Organic Soap',
    form: {
      product_description: 'A natural herbal soap designed for people with sensitive skin and made using organic botanical ingredients.',
      target_audience: 'Age: 50–60, Location: India, Gender: Any, Lifestyle: Health-conscious',
      research_objective: 'Understand how many people prefer a different soap, key purchase factors, and reasons for rejection.',
      number_of_personas: 4,
    },
  },
  {
    label: '💻 B2B SaaS Productivity Tool',
    form: {
      product_description: 'An AI-powered time-tracking and automated invoicing platform for freelance agencies and remote teams.',
      target_audience: 'Age: 28–45, Location: Global/Remote, Role: Agency Founders & Freelancers',
      research_objective: 'Determine whether users would switch from manual spreadsheets and identify top feature objections.',
      number_of_personas: 4,
    },
  },
  {
    label: '🛵 Electric Urban Scooter',
    form: {
      product_description: 'A lightweight foldable electric scooter with 40km battery range designed for city commuters.',
      target_audience: 'Age: 22–38, Location: Metropolitan Cities, Lifestyle: Daily Eco Commuter',
      research_objective: 'Identify safety concerns, range anxiety factors, and price sensitivity thresholds.',
      number_of_personas: 4,
    },
  },
  {
    label: '📱 AI Health & Meal Planner',
    form: {
      product_description: 'A mobile app that generates personalized weekly grocery lists and 15-minute healthy recipes using AI.',
      target_audience: 'Age: 30–48, Location: Suburbs, Lifestyle: Busy parents & working professionals',
      research_objective: 'Evaluate monthly subscription willingness ($9.99/mo) and major drop-off reasons.',
      number_of_personas: 4,
    },
  },
];

export default function GeneratePersona() {
  const { productContext, setProductContext, updateLatestBatch } = usePersonaContext();
  const [form, setForm] = useState({
    product_description: productContext.product_description || initialForm.product_description,
    target_audience: productContext.target_audience || initialForm.target_audience,
    research_objective: productContext.research_objective || initialForm.research_objective,
    number_of_personas: 4,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedBatch, setGeneratedBatch] = useState([]);
  const navigate = useNavigate();

  const isFormValid = useMemo(() => {
    return Boolean(form.product_description?.trim() && form.target_audience?.trim() && form.research_objective?.trim());
  }, [form]);

  const generateWithForm = async (targetForm) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/generate-personas', {
        product_description: targetForm.product_description.trim(),
        target_audience: targetForm.target_audience.trim(),
        research_objective: targetForm.research_objective.trim(),
        number_of_personas: Number(targetForm.number_of_personas),
      });
      const contextObj = {
        product_description: targetForm.product_description.trim(),
        target_audience: targetForm.target_audience.trim(),
        research_objective: targetForm.research_objective.trim(),
      };
      setProductContext(contextObj);
      updateLatestBatch(response.data, contextObj);
      setGeneratedBatch(response.data);
    } catch (err) {
      console.error('Generation error:', err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : (err.message || 'Unable to generate personas right now. Check backend LLM API setup.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isFormValid) {
      setError('Please complete the product description, target audience, and research objective fields.');
      return;
    }
    generateWithForm(form);
  };

  const handleQuickPreset = (presetForm) => {
    setForm(presetForm);
    generateWithForm(presetForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="page-stack">
      {/* Header Banner */}
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Persona Generation Studio</p>
          <h2>Generate Product Research Personas</h2>
          <p className="muted">Enter your product details and research objective to generate realistic synthetic participants powered by LLM.</p>
        </div>
      </section>

      {/* 1-Click Quick Generation Presets */}
      <section className="card presets-card">
        <div className="preset-header">
          <h3>⚡ Quick Start Research Templates</h3>
          <p className="muted">Select a template to auto-fill criteria and generate 4 synthetic research personas immediately.</p>
        </div>
        <div className="quick-presets-row">
          {quickPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="quick-preset-button"
              onClick={() => handleQuickPreset(preset.form)}
              disabled={loading}
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Generator Form */}
      <section className="card form-panel-card">
        <h3>Product Research Criteria</h3>
        <GeneratorForm form={form} onChange={handleChange} onSubmit={handleSubmit} loading={loading} />
        {error ? <p className="error" style={{ marginTop: '12px' }}>{error}</p> : null}
      </section>

      {/* Generated Results Batch Preview */}
      {loading ? (
        <section className="card loading-state">
          <div className="skeleton" />
          <div className="skeleton short" />
          <div className="skeleton" />
          <p className="muted text-center" style={{ marginTop: '12px' }}>
            LLM is synthesizing realistic, diverse research personas tailored to your research objective...
          </p>
        </section>
      ) : generatedBatch.length > 0 ? (
        <section className="card results-preview-card">
          <div className="results-header-row">
            <div>
              <h3>🎉 Successfully Generated {generatedBatch.length} Research Personas</h3>
              <p className="muted">Your new synthetic research participants are ready for testing.</p>
            </div>
            <div className="results-actions" style={{ display: 'flex', gap: '8px' }}>
              <button className="primary-button" onClick={() => navigate('/validation')}>
                ⚡ Validate Product
              </button>
              <button className="secondary-button" onClick={() => navigate('/interview')}>
                💬 Interview Personas
              </button>
              <button className="secondary-button" onClick={() => navigate('/survey')}>
                📊 Run Survey
              </button>
            </div>
          </div>

          <div className="persona-grid margin-top">
            {generatedBatch.map((persona) => (
              <PersonaCard key={(persona.name || persona.player_name) + persona.avatar_seed} persona={persona} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

