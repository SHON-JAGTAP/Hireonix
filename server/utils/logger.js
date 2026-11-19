const levels = new Set(['debug', 'info', 'warn', 'error']);

export const log = (level, message, context = {}) => {
  const normalizedLevel = levels.has(level) ? level : 'info';
  const entry = {
    timestamp: new Date().toISOString(),
    level: normalizedLevel,
    service: 'hireonix-server',
    message,
    ...context,
  };

  const output = JSON.stringify(entry);
  if (normalizedLevel === 'error') {
    console.error(output);
  } else if (normalizedLevel === 'warn') {
    console.warn(output);
  } else {
    console.log(output);
  }
};
