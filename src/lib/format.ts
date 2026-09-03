export function formatUserName(user: { first_name: string; last_name: string }): string {
  return `${user.first_name} ${user.last_name}`.trim();
}
