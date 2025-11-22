import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(12),
});

export const sortingSchema = z.object({
  sort: z.string().default('productName'),
  direction: z.enum(['asc', 'desc']).default('asc'),
});

export const shopSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(12),
  sort: z.string().default('productName'),
  direction: z.enum(['asc', 'desc']).default('asc'),
  categoryId: z.preprocess((val) => {
    if (val === '' || val === 'null' || val === undefined) {
      return undefined;
    }
    return val;
  }, z.string().nullable().optional()),
});

export const historySearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(5),
});
