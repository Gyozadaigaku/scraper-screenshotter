import { z } from 'zod'

export const PostValidator = z.object({
  searchQuery: z
    .string()
    .min(1, {
      message: '1文字以上で入力してください',
    })
    .max(64, {
      message: '64文字以下で入力してください',
    }),
})

export type PostCreationRequest = z.infer<typeof PostValidator>
