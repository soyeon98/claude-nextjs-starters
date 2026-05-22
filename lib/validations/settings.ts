import { z } from "zod"

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "이름은 2자 이상이어야 합니다.")
    .max(50, "이름은 50자 이하여야 합니다."),
  email: z.string().email("올바른 이메일 주소를 입력해주세요."),
  bio: z.string().max(200, "소개는 200자 이하여야 합니다.").optional(),
})

export const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  notificationFrequency: z.enum(["realtime", "daily", "weekly"]),
})

export const securitySchema = z
  .object({
    currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요."),
    newPassword: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "영문 대소문자와 숫자를 포함해야 합니다."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  })

export type ProfileFormValues = z.infer<typeof profileSchema>
export type NotificationFormValues = z.infer<typeof notificationSchema>
export type SecurityFormValues = z.infer<typeof securitySchema>
