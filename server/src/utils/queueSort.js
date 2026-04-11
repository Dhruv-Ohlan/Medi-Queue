const { URGENCY_LEVELS } = require("../config/constants");

/**
 * Sorts tokens based on urgency level and then registration time.
 * Urgency Priority: Emergency > Priority > Routine
 */
const sortTokensByPriority = (tokens) => {
  const priorityMap = {
    [URGENCY_LEVELS.EMERGENCY]: 1,
    [URGENCY_LEVELS.PRIORITY]: 2,
    [URGENCY_LEVELS.ROUTINE]: 3,
  };

  return [...tokens].sort((a, b) => {
    // First, compare urgency priority
    const priorityA = priorityMap[a.urgencyLevel] || 99;
    const priorityB = priorityMap[b.urgencyLevel] || 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // If same urgency, compare arrival time (registeredAt)
    return new Date(a.registeredAt) - new Date(b.registeredAt);
  });
};

module.exports = {
  sortTokensByPriority,
};
