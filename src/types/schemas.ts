import { z } from 'zod'

export const StudentSchema = z.object({
  id: z.number(),
  name: z.string(),
  level: z.number().min(1).max(3),
  courseId: z.number()
})

export const StudentArraySchema = z.array(StudentSchema)

export type Student = z.infer<typeof StudentSchema>
export type StudentArray = z.infer<typeof StudentArraySchema>
