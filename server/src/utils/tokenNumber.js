const generateTokenNumber = (departmentPrefix, currentCount) => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const paddedCount = String(currentCount + 1).padStart(3, "0");
  return `${departmentPrefix.toUpperCase().substring(0, 3)}-${dateStr}-${paddedCount}`;
};

module.exports = { generateTokenNumber };
