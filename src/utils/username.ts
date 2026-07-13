const USERNAME_REGEX = /^[a-z0-9_]{3,}$/;

export function buildUsernameSuggestions(fullName: string): string[] {
  const cleaned = fullName
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim();

  if (!cleaned) return [];

  const parts = cleaned.split(/\s+/).filter(Boolean);
  const [first, ...rest] = parts;
  const last = rest[rest.length - 1];

  if (!first || first.length < 2) return [];

  const candidates = last
    ? [`${first}${last}`, `${first}_${last}`, `${first}${last[0]}`]
    : [first, `${first}_official`, `${first}${first.length + 21}`];

  const suggestions = candidates.filter((candidate) =>
    USERNAME_REGEX.test(candidate),
  );

  return Array.from(new Set(suggestions)).slice(0, 3);
}
