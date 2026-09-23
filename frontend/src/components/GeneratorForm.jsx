import React from 'react';

export default function GeneratorForm({ form, onChange, onSubmit, loading }) {
  return (
    <form className="generator-form" onSubmit={onSubmit}>
      <div className="form-grid-stacked">
        <label className="form-field full-width">
          <span className="field-label-header">
            <strong>Product Description</strong>
            <small className="muted">Describe the product, key ingredients, features, or positioning.</small>
          </span>
          <textarea
            name="product_description"
            rows={3}
            placeholder="e.g. A natural herbal soap designed for people with sensitive skin and made using organic ingredients."
            value={form.product_description || ''}
            onChange={onChange}
            required
          />
        </label>

        <label className="form-field full-width">
          <span className="field-label-header">
            <strong>Target Audience</strong>
            <small className="muted">Specify demographic ranges, geographic region, income level, or lifestyle.</small>
          </span>
          <textarea
            name="target_audience"
            rows={2}
            placeholder="e.g. Age: 50–60, Location: India, Gender: Any, Lifestyle: Health-conscious"
            value={form.target_audience || ''}
            onChange={onChange}
            required
          />
        </label>

        <label className="form-field full-width">
          <span className="field-label-header">
            <strong>Research Objective</strong>
            <small className="muted">Define what key questions or behaviors you want to test and learn.</small>
          </span>
          <textarea
            name="research_objective"
            rows={2}
            placeholder="e.g. Understand how many people prefer a different soap, key purchase factors, and willingness to switch."
            value={form.research_objective || ''}
            onChange={onChange}
            required
          />
        </label>

        <div className="form-field-row">
          <label className="form-field inline-field">
            <span>Number of Personas to Generate</span>
            <input
              type="number"
              min="1"
              max="20"
              name="number_of_personas"
              value={form.number_of_personas || 4}
              onChange={onChange}
            />
          </label>
        </div>
      </div>

      <button type="submit" className="primary-button submit-generate-btn" disabled={loading} style={{ marginTop: '16px' }}>
        {loading ? '⚡ Synthesizing Realistic Product Personas...' : `🚀 Generate ${form.number_of_personas || 4} Research Personas`}
      </button>
    </form>
  );
}

