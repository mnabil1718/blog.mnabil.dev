export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSlug(text: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text);
}
