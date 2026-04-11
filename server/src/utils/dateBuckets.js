const getStartOfDay = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const getEndOfDay = () => {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
};

const getDateRange = (dateStr) => {
  const start = dateStr ? new Date(dateStr) : new Date();
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

module.exports = { getStartOfDay, getEndOfDay, getDayKey, getDateRange };
