export type AdminUser = {
  name: string;
  initials: string;
  email: string;
};

export const mockAdminUser: AdminUser = {
  name: "John Doe",
  initials: "JD",
  email: "john.doe@doot.com",
};

export function getAdminFirstName(user: AdminUser = mockAdminUser): string {
  return user.name.split(" ")[0] ?? user.name;
}

export function getTimeBasedGreeting(
  date: Date = new Date(),
  firstName: string = getAdminFirstName(),
): string {
  const hour = date.getHours();
  let period: string;
  if (hour < 12) period = "Good morning";
  else if (hour < 17) period = "Good afternoon";
  else period = "Good evening";
  return `${period}, ${firstName}`;
}
