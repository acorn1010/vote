import { z } from 'zod';

/** Maximum number of poll options allowed to be included. */
export const POLL_OPTIONS_MAX = 5;

const createPollOptionInput = z.object({
  text: z.string().min(1).max(2_048),
});

export const createPostInput = z.object({
  topicId: z
    .string()
    .min(1)
    .max(255)
    .regex(/[a-zA-Z0-9_-]/),
  /** A title of the poll (e.g. "What's your favorite flavor?") */
  title: z.string().min(1).max(255),

  /** An optional description (e.g. "My toothpaste smells like feet.") */
  description: z.optional(z.string()),
  type: z.enum(['MULTIPLE_CHOICE', 'IMAGE_POLL']),

  /** All of the poll options (e.g. "Strawberry", "Chocolate", "Vanilla"). */
  options: z.array(createPollOptionInput).min(2).max(POLL_OPTIONS_MAX),
});

export type CreatePostInputSchema = z.TypeOf<typeof createPostInput>;
