import { z } from 'zod';

export const EditProfileFormSchema = z.object({
  companyName: z
    .string()
    .min(1, { message: '직업을 입력해주세요.' })
    .max(20, { message: '20자 이하로 입력해주세요.' })
    .optional(),

  image: z
    .instanceof(File)
    .refine(file => file.size > 0, {
      message: '이미지를 선택해주세요.',
    })
    .refine(
      file => file.size <= 20 * 1024 * 1024, // 5MB
      { message: '이미지 크기는 20MB 이하여야 합니다.' },
    )
    .refine(file => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type), {
      message: 'png, jpg, jpeg, webp 파일만 업로드 가능합니다.',
    })
    .optional(),
});

export type EditProfileFormType = z.infer<typeof EditProfileFormSchema>;
