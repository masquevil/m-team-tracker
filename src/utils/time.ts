export function isEndTimeGreaterThanTwoDays(endTime: string) {
  const twoDays = 2 * 24 * 60 * 60 * 1000;
  const endTimeDate = new Date(endTime).getTime();
  const now = new Date().getTime();

  return endTimeDate - now > twoDays;
}

export function isEndTimeGreaterThanOneDays(endTime: string | null) {
  const twoDays = 18 * 60 * 60 * 1000;
  const endTimeDate = new Date(endTime).getTime();
  const now = new Date().getTime();

  return endTime === null || endTimeDate - now > twoDays;
}
