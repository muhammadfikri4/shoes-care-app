export function omitObject<T extends Record<string, unknown>>(
  obj: T,
  key: string
): Omit<T, string> {
  const { [key]: _, ...rest } = obj;
  _;
  return rest;
}
