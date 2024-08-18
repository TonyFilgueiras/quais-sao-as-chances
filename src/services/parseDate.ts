export default function parseDate(dateString: string): Date {
  const [dayMonthYear, time] = dateString.split(" ");
  const [day, month, year] = dayMonthYear.split("/").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const fullYear = year < 100 ? 2000 + year : year;
  return new Date(fullYear, month - 1, day, hours, minutes);
}