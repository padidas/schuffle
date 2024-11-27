import { z } from 'zod'

export const StudentSchema = z.object({
  id: z.number(),
  name: z.string(),
  level: z.number().min(1).max(3),
  courseId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const StudentArraySchema = z.array(StudentSchema)
export const StudentInsertSchema = StudentSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const StudentUpdateSchema = StudentInsertSchema.omit({ courseId: true }).partial()

export type Student = z.infer<typeof StudentSchema>
export type StudentArray = z.infer<typeof StudentArraySchema>

export const CourseSchema = z.object({
  id: z.number(),
  name: z.string()
})
export const CourseArraySchema = z.array(CourseSchema)
export const CourseInsertSchema = CourseSchema.omit({ id: true })

export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(60),
})

export type User = z.infer<typeof UserSchema>