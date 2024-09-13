export function isEndTimeGreaterThanTwoDays(endTime: string) {
  const twoDays = 2 * 24 * 60 * 60 * 1000;
  const endTimeDate = new Date(endTime).getTime();
  const now = new Date().getTime();

  return endTimeDate - now > twoDays;
}
