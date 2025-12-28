function extractStudentProfile(query) {
  const lowerQuery = query.toLowerCase();

  const roles = [
    "doctor", "engineer", "lawyer", "ias", "ips", "teacher", "scientist", "chartered accountant", "actor", "pilot",
    "fashion designer", "police", "businessman", "manager", "chef", "architect", "pharmacist", "dentist"
  ];
  const mediums = {
    tamil: ["tamil medium", "tamil"],
    english: ["english medium", "english"],
    hindi: ["hindi medium", "hindi"],
  };
  const financialMap = {
    low: ["poor", "no money", "low income", "can't afford", "financially weak"],
    middle: ["middle class", "moderate income", "average income"],
    high: ["rich", "wealthy", "privileged", "high income"]
  };
  const performanceMap = {
    poor: ["poor student", "failed", "weak", "low marks"],
    average: ["average student", "average", "sometimes pass"],
    topper: ["topper", "rank holder", "bright", "smart", "90%"]
  };

  const extracted = {
    role: null,
    medium: null,
    financial: null,
    performance: null
  };

  // Extract Role
  for (const role of roles) {
    if (lowerQuery.includes(role)) {
      extracted.role = role;
      break;
    }
  }

  // Medium
  for (const [medium, keywords] of Object.entries(mediums)) {
    for (const word of keywords) {
      if (lowerQuery.includes(word)) {
        extracted.medium = medium;
        break;
      }
    }
    if (extracted.medium) break;
  }

  // Financial
  for (const [level, keywords] of Object.entries(financialMap)) {
    for (const word of keywords) {
      if (lowerQuery.includes(word)) {
        extracted.financial = level;
        break;
      }
    }
    if (extracted.financial) break;
  }

  // Academic Performance
  for (const [level, keywords] of Object.entries(performanceMap)) {
    for (const word of keywords) {
      if (lowerQuery.includes(word)) {
        extracted.performance = level;
        break;
      }
    }
    if (extracted.performance) break;
  }

  return extracted;
}
