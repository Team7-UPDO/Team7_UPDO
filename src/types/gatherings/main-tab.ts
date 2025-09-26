// src/types/gathering/main-tab.ts

import { z } from "zod";

export const MainTabSchema = z.enum(["성장", "네트워킹"]);
export type MainTab = z.infer<typeof MainTabSchema>;
