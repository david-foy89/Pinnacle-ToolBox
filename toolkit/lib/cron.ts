const CUSTOM_ALIASES: Record<string, string> = {
  "@weekdays": "0 0 * * 1-5",
  "@weekends": "0 0 * * 0,6",
};

export function normalizeCronExpression(expression: string): string {
  const trimmed = expression.trim();
  return CUSTOM_ALIASES[trimmed] ?? trimmed;
}
