export function normalizePersona(persona = {}) {
  let pJson = {};
  let profJson = {};
  try {
    if (persona?.persona_json) {
      pJson = typeof persona.persona_json === 'object' ? persona.persona_json : JSON.parse(persona.persona_json);
    }
  } catch (e) {}
  try {
    if (persona?.profile_json) {
      profJson = typeof persona.profile_json === 'object' ? persona.profile_json : JSON.parse(persona.profile_json);
    }
  } catch (e) {}

  const source = { ...profJson, ...pJson, ...(persona ?? {}) };

  const pick = (keys, fallback = 'Not specified') => {
    for (const key of keys) {
      const value = source[key];
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }
    return fallback;
  };

  let memJson = [];
  try {
    if (source?.memory_json) {
      memJson = typeof source.memory_json === 'string' ? JSON.parse(source.memory_json) : source.memory_json;
    }
  } catch (e) {}

  const name = pick(['name', 'player_name', 'playerName'], 'Unnamed Persona');
  const age = pick(['age', 'age_range', 'ageRange'], '35 yrs old');
  const occupation = pick(['occupation', 'jobTitle', 'profession'], 'Consumer');
  const personality = pick(['personality_traits', 'personality', 'player_personality'], 'Observant');
  const behaviour = pick(['behaviour', 'behavior', 'behavior_summary'], 'Selective consumer');
  const psychology = pick(['psychological_profile', 'psychology'], 'Values quality & safety');

  return {
    id: source.id ?? source._id ?? null,
    name,
    player_name: name,
    age,
    age_range: age,
    occupation,
    personality_traits: personality,
    player_personality: personality,
    behaviour,
    behavior_summary: behaviour,
    psychological_profile: psychology,
    avatar_seed: pick(['avatar_seed', 'avatarSeed', 'avatar'], `avatar-${name.toLowerCase().replace(/\s+/g, '-')}`),
    country: pick(['country', 'location'], 'United States'),
    gender: pick(['gender'], 'Any'),
    product_description: pick(['product_description', 'productDescription'], ''),
    target_audience: pick(['target_audience', 'targetAudience'], ''),
    research_objective: pick(['research_objective', 'researchObjective'], ''),
    profile_json: source.profile_json ?? source.profileJson ?? null,
    persona_json: source.persona_json ?? source.personaJson ?? null,
    memory_json: Array.isArray(memJson) ? memJson : [],
  };
}

export function normalizePersonas(input) {
  if (Array.isArray(input)) {
    return input.map((persona) => normalizePersona(persona));
  }

  if (Array.isArray(input?.personas)) {
    return input.personas.map((persona) => normalizePersona(persona));
  }

  if (Array.isArray(input?.items)) {
    return input.items.map((persona) => normalizePersona(persona));
  }

  if (Array.isArray(input?.data)) {
    return input.data.map((persona) => normalizePersona(persona));
  }

  if (Array.isArray(input?.results)) {
    return input.results.map((persona) => normalizePersona(persona));
  }

  return [];
}

export const normalizePersonaList = normalizePersonas;


