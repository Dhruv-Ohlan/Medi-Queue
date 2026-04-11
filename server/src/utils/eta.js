/**
 * Simple ETA calculation heuristic.
 * Estimate wait time in minutes based on queue position and average consult duration.
 */
const calculateETA = (position, avgConsultTime = 12) => {
  if (position <= 0) return 0;
  
  // Basic heuristic: each person in front takes avgConsultTime
  // Position 1 means 0 minutes (you're next) or 1 minute.
  // Let's say position 1 means you wait for the current person if someone is called,
  // or you are indeed next.
  
  return position * avgConsultTime;
};

module.exports = {
  calculateETA,
};
