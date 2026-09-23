import { normalizePersona, normalizePersonas } from './personaNormalizer';

export function parseAgeRange(ageRange) {
  if (typeof ageRange !== 'string') {
    return 0;
  }

  const match = ageRange.match(/(\d+)/g);
  if (!match) {
    return 0;
  }

  if (match.length === 1) {
    return Number(match[0]);
  }

  const [start, end] = match.map(Number);
  return Math.round((start + end) / 2);
}

export function parseScreenHours(screenTime) {
  if (typeof screenTime !== 'string') {
    return 0;
  }

  const match = screenTime.match(/(\d+)/g);
  if (!match) {
    return 0;
  }

  if (match.length === 1) {
    return Number(match[0]);
  }

  return Math.round((Number(match[0]) + Number(match[1])) / 2);
}

function countByKey(personas, key) {
  return personas.reduce((acc, persona) => {
    const value = persona[key] ?? 'Not specified';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function toChartData(valueMap) {
  return Object.entries(valueMap).map(([name, value]) => ({ name, value }));
}

function buildScreenTimeBuckets(personas) {
  const buckets = personas.reduce((acc, persona) => {
    const hours = parseScreenHours(persona.daily_screen_time);
    let bucket = 'Under 4 hrs';
    if (hours >= 8) {
      bucket = '8+ hrs';
    } else if (hours >= 6) {
      bucket = '6-8 hrs';
    } else if (hours >= 4) {
      bucket = '4-6 hrs';
    }
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});

  return toChartData(buckets);
}

function buildGamingWindow(personas) {
  const windows = personas.reduce((acc, persona) => {
    const text = `${persona.playing_frequency} ${persona.daily_screen_time}`.toLowerCase();
    let windowValue = 'Flexible';
    if (text.includes('very high') || text.includes('8+') || text.includes('6-8')) {
      windowValue = 'Late Night';
    } else if (text.includes('high') || text.includes('4-6')) {
      windowValue = 'Evening';
    } else if (text.includes('weekend') || text.includes('low')) {
      windowValue = 'Weekend';
    }
    acc[windowValue] = (acc[windowValue] || 0) + 1;
    return acc;
  }, {});

  return toChartData(windows);
}

function buildPersonalityDistribution(personas) {
  const buckets = personas.reduce((acc, persona) => {
    const value = persona.player_personality || 'Not specified';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  return toChartData(buckets);
}

function buildCompetitiveVsCasual(personas) {
  const buckets = personas.reduce((acc, persona) => {
    const text = `${persona.player_personality} ${persona.persona_label}`.toLowerCase();
    const bucket = text.includes('competitive') || text.includes('ranked') || text.includes('analytical') ? 'Competitive' : 'Casual';
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});

  return toChartData(buckets);
}

export function buildAnalytics(inputPersonas) {
  const personas = normalizePersonas(inputPersonas).map((persona) => normalizePersona(persona));

  const total = personas.length;
  const averageAge = total
    ? Math.round(personas.reduce((sum, persona) => sum + parseAgeRange(persona.age_range), 0) / total)
    : 0;
  const averageScreenTime = total
    ? (personas.reduce((sum, persona) => sum + parseScreenHours(persona.daily_screen_time), 0) / total).toFixed(1)
    : '0.0';

  const genreData = toChartData(countByKey(personas, 'favorite_genre'));
  const platformData = toChartData(countByKey(personas, 'preferred_platform'));
  const countryData = toChartData(countByKey(personas, 'country'));
  const spendingData = toChartData(countByKey(personas, 'spending_behaviour'));
  const experienceData = toChartData(countByKey(personas, 'gaming_experience'));
  const gamingWindowData = buildGamingWindow(personas);
  const personalityData = buildPersonalityDistribution(personas);
  const competitiveData = buildCompetitiveVsCasual(personas);
  const sessionLengthData = buildScreenTimeBuckets(personas);

  const topGenre = genreData.sort((a, b) => b.value - a.value)[0]?.name || 'Not available';
  const topPlatform = platformData.sort((a, b) => b.value - a.value)[0]?.name || 'Not available';

  return {
    personas,
    metrics: {
      totalPersonas: total,
      averageAge,
      topGenre,
      topPlatform,
      averageScreenTime,
    },
    charts: {
      genreData,
      platformData,
      countryData,
      spendingData,
      experienceData,
      gamingWindowData,
      personalityData,
      competitiveData,
      sessionLengthData,
    },
  };
}
