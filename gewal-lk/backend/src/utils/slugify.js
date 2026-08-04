export const slugify = (value) => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export const buildUniqueSlug = (value) => {
  const base = slugify(value) || "property";
  const suffix = Math.random().toString(36).slice(2, 8);

  return `${base}-${suffix}`;
};
