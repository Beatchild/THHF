import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export const PostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  coverImage: z.string().optional(),
  layoutStyle: z.enum(['standard', 'parallax']).default('parallax'),
  excerpt: z.string().min(5, "Excerpt must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  status: z.enum(['draft', 'published']),
  category: z.string().default('News'),
  author: z.object({
    id: z.string(),
  }),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  readingTime: z.number().default(0),
  claps: z.number().default(0),
});

export type Category = z.infer<typeof CategorySchema>;
export type Post = z.infer<typeof PostSchema> & {
  createdAt?: any;
  updatedAt?: any;
  publishedAt?: any;
};
