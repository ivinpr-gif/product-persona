import React, { useMemo, useState } from 'react';
import { usePersonaContext } from '../context/PersonaContext';
import PersonaCard from '../components/PersonaCard';
import { normalizePersona } from '../utils/personaNormalizer';

const PAGE_SIZE = 9;

export default function Personas() {
  const { personas } = usePersonaContext();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ country: '', occupation: '', gender: '' });
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState(null);

  const availableOptions = useMemo(() => {
    const countries = [...new Set(personas.map((persona) => persona.country).filter(Boolean))];
    const occupations = [...new Set(personas.map((persona) => persona.occupation).filter(Boolean))];
    const genders = [...new Set(personas.map((persona) => persona.gender).filter(Boolean))];
    return { countries, occupations, genders };
  }, [personas]);

  const filteredPersonas = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const results = personas.filter((persona) => {
      const pName = persona.name || persona.player_name;
      const matchesQuery = !normalizedQuery || [pName, persona.country, persona.occupation, persona.personality_traits, persona.behaviour].some((value) => String(value).toLowerCase().includes(normalizedQuery));
      const matchesCountry = !filters.country || persona.country === filters.country;
      const matchesOccupation = !filters.occupation || persona.occupation === filters.occupation;
      const matchesGender = !filters.gender || persona.gender === filters.gender;
      return matchesQuery && matchesCountry && matchesOccupation && matchesGender;
    });

    results.sort((left, right) => {
      const nameL = String(left.name || left.player_name);
      const nameR = String(right.name || right.player_name);
      switch (sortBy) {
        case 'age-desc':
          return Number(right.age?.match(/\d+/g)?.[0] || 0) - Number(left.age?.match(/\d+/g)?.[0] || 0);
        case 'age-asc':
          return Number(left.age?.match(/\d+/g)?.[0] || 0) - Number(right.age?.match(/\d+/g)?.[0] || 0);
        case 'name':
        default:
          return nameL.localeCompare(nameR);
      }
    });

    return results;
  }, [filters, personas, query, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredPersonas.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedPersonas = filteredPersonas.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  React.useEffect(() => {
    setPage(1);
  }, [query, filters.country, filters.occupation, filters.gender, sortBy]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ country: '', occupation: '', gender: '' });
    setQuery('');
    setSortBy('name');
  };

  if (personas.length === 0) {
    return (
      <div className="page-stack">
        <section className="card empty-state">
          <h3>No research personas generated yet.</h3>
          <p className="muted">Specify your product description and research objective to generate synthetic participants.</p>
          <a className="primary-button" href="/generate">Generate Your First Personas</a>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="card filters-panel">
        <div className="filters-row">
          <label className="filter-field">
            <span>Search Personas</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, trait, or occupation..." />
          </label>
          <label className="filter-field">
            <span>Sort By</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="name">Name A-Z</option>
              <option value="age-asc">Age Low-High</option>
              <option value="age-desc">Age High-Low</option>
            </select>
          </label>
        </div>
        <div className="filters-row">
          <label className="filter-field">
            <span>Country</span>
            <select name="country" value={filters.country} onChange={handleFilterChange}>
              <option value="">All</option>
              {availableOptions.countries.map((country) => <option key={country} value={country}>{country}</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span>Occupation</span>
            <select name="occupation" value={filters.occupation} onChange={handleFilterChange}>
              <option value="">All</option>
              {availableOptions.occupations.map((occ) => <option key={occ} value={occ}>{occ}</option>)}
            </select>
          </label>
        </div>
        <button className="secondary-button" onClick={clearFilters}>Clear Filters</button>
      </section>

      <section className="persona-grid">
        {pagedPersonas.map((persona) => (
          <PersonaCard key={persona.id ?? `${persona.name}-${persona.avatar_seed}`} persona={normalizePersona(persona)} />
        ))}
      </section>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={safePage === 1}>Previous</button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button key={pageNumber} className={pageNumber === safePage ? 'page-number active' : 'page-number'} onClick={() => setPage(pageNumber)}>{pageNumber}</button>
          ))}
          <button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={safePage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
}

