/** Returns the current time + `days`. */
export function addDays(days: number) {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return result;
}
