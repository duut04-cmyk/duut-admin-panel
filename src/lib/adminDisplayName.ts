export type AdminAccountDisplay = {
  name: string;
  email: string;
};

export function getAdminFirstName(user: AdminAccountDisplay): string {
  const trimmed = user.name.trim();
  if (trimmed.length === 0) {
    const local = user.email.split("@")[0]?.trim();
    return local && local.length > 0 ? local : "Admin";
  }
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

export function getTimeBasedGreeting(
  date: Date = new Date(),
  firstName: string,
): string {
  const hour = date.getHours();
  let period: string;
  if (hour < 12) period = "Good morning";
  else if (hour < 17) period = "Good afternoon";
  else period = "Good evening";
  return `${period}, ${firstName}`;
}
