import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { normalizePersonaList } from '../utils/personaNormalizer';

const PersonaContext = createContext();

export function PersonaProvider({ children }) {
  const [personas, setPersonas] = useState([]);
  const [latestBatch, setLatestBatch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [productContext, setProductContext] = useState({
    product_description: 'A natural herbal soap designed for people with sensitive skin and made using organic ingredients.',
    target_audience: 'Age: 50-60, Location: India, Gender: Any, Lifestyle: Health-conscious',
    research_objective: 'Understand how many people prefer a different soap and why.',
  });

  const [validationResults, setValidationResults] = useState(null);
  const [insightResults, setInsightResults] = useState(null);
  const [adoptionScores, setAdoptionScores] = useState(null);
  const [qualityReport, setQualityReport] = useState(null);
  const [structuredMemories, setStructuredMemories] = useState({});

  const refreshPersonas = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/personas');
      const rawList = res.data || [];
      const normalized = normalizePersonaList(rawList);
      setPersonas(normalized);

      if (normalized.length > 0) {
        const latestP = normalized[0];
        if (latestP.product_description) {
          setProductContext((prev) => ({
            ...prev,
            product_description: latestP.product_description || prev.product_description,
            target_audience: latestP.target_audience || prev.target_audience,
            research_objective: latestP.research_objective || prev.research_objective,
          }));
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch stored personas.');
    } finally {
      setLoading(false);
    }
  };

  const updateLatestBatch = (batch, contextData) => {
    const normBatch = normalizePersonaList(batch);
    setLatestBatch(normBatch);

    if (contextData) {
      setProductContext(contextData);
    }
    setValidationResults(null);
    setInsightResults(null);
    setAdoptionScores(null);
    setQualityReport(null);
    refreshPersonas();
  };

  const updatePersonaMemory = (personaId, newMemory, newStructMem = null) => {
    setPersonas((prev) =>
      prev.map((p) =>
        p.id === personaId
          ? { ...p, memory_json: newMemory, structured_memory: newStructMem || p.structured_memory }
          : p
      )
    );
    setLatestBatch((prev) =>
      prev.map((p) =>
        p.id === personaId
          ? { ...p, memory_json: newMemory, structured_memory: newStructMem || p.structured_memory }
          : p
      )
    );
    if (newStructMem) {
      setStructuredMemories((prev) => ({ ...prev, [personaId]: newStructMem }));
    }
  };

  const deleteAllPersonas = async () => {
    try {
      await axios.delete('/api/personas');
      setPersonas([]);
      setLatestBatch([]);
      setValidationResults(null);
      setInsightResults(null);
      setAdoptionScores(null);
      setQualityReport(null);
      setStructuredMemories({});
    } catch (err) {
      setError('Failed to clear database personas.');
    }
  };

  useEffect(() => {
    refreshPersonas();
  }, []);

  const activePersonas = React.useMemo(() => {
    if (latestBatch && latestBatch.length > 0) return latestBatch;
    if (personas && personas.length > 0) {
      const latestProdDesc = personas[0].product_description;
      if (latestProdDesc) {
        const matched = personas.filter((p) => p.product_description === latestProdDesc);
        if (matched.length > 0) return matched;
      }
    }
    return personas;
  }, [latestBatch, personas]);

  return (
    <PersonaContext.Provider
      value={{
        personas,
        latestBatch,
        activePersonas,
        loading,
        error,
        productContext,
        setProductContext,
        validationResults,
        setValidationResults,
        insightResults,
        setInsightResults,
        adoptionScores,
        setAdoptionScores,
        qualityReport,
        setQualityReport,
        structuredMemories,
        refreshPersonas,
        updateLatestBatch,
        addPersonas: updateLatestBatch,
        updatePersonaMemory,
        deleteAllPersonas,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersonaContext() {
  return useContext(PersonaContext);
}
