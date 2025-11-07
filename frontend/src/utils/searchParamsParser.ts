import { z } from 'zod';

/**
 * Parse searchParams using Zod schema for type-safe validation and coercion
 * @param searchParams - Promise of search params object
 * @param schema - Zod schema for validation and parsing
 * @returns Parsed and validated search params
 */
export async function parseSearchParams<T>(
  searchParams: Promise<Record<string, string | string[] | undefined>>,
  schema: z.ZodSchema<T>
): Promise<T> {
  const resolved = await searchParams;

  // Parse with Zod schema (throws on validation error)
  return schema.parse(resolved);
}
