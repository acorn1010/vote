import { z } from "zod";

const createPollOptionInput = z.object({
    srcUri: z.string().nullish(),
    text: z.string().nullish(),
});

const createPostInput = z.object({
    title: z.string().min(1),
    description: z.string().nullish(),
    type: z.enum(["MULTIPLE_CHOICE", "IMAGE_POLL"]),
});

type CreatePostInputSchema = z.TypeOf<typeof createPostInput>;

export { createPollOptionInput, createPostInput };
export type { CreatePostInputSchema };

