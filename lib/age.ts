export function getAgeText(birthDate: Date, now: Date = new Date()): string {
  const thisYearBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  let years = now.getFullYear() - birthDate.getFullYear();
  if (now < thisYearBirthday) {
    years -= 1;
  }

  const lastBirthday = new Date(thisYearBirthday);
  if (now < lastBirthday) {
    lastBirthday.setFullYear(lastBirthday.getFullYear() - 1);
  }

  const daysSinceBirthday =
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(lastBirthday.getFullYear(), lastBirthday.getMonth(), lastBirthday.getDate())) /
    86_400_000;

  return `${years} years, ${daysSinceBirthday} days old`;
}
