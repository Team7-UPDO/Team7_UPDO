// src/schemas/authsSchema.ts

import { z } from "zod";

// 공통 정규식
const nameRegex = /^[가-힣a-zA-Z0-9]+$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]+$/;

// 로그인 폼
export const LoginFormSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  password: z.string()
    .min(8, { message: "8글자 이상 입력해주세요." })
    .max(20, { message: "20자 이하로 입력해주세요." })
    .regex(passwordRegex, "영문, 숫자 조합 필수, 특수문자는 선택사항입니다."),
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;

// 회원가입 폼
export const JoinFormSchema = z.object({
  name: z.string()
    .regex(nameRegex, "한글, 영문, 숫자만 입력 가능합니다.")
    .min(2, { message: "2글자 이상 입력해주세요." })
    .max(10, { message: "10자 이하로 입력해주세요." }),

  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),

  companyName: z.string()
    .regex(nameRegex, "한글, 영문, 숫자만 입력 가능합니다.")
    .min(1, { message: "회사명을 입력해주세요." })
    .max(20, { message: "20자 이하로 입력해주세요." }),

  password: z.string()
    .min(8, { message: "8글자 이상 입력해주세요." })
    .max(20, { message: "20자 이하로 입력해주세요." })
    .regex(passwordRegex, "영문, 숫자 조합 필수, 특수문자는 선택사항입니다."),

  passwordConfirm: z.string(),
}).refine(data => data.password === data.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["passwordConfirm"],
});

export type JoinFormType = z.infer<typeof JoinFormSchema>;
