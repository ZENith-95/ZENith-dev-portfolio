"use client";

import { generateReactHelpers } from "@uploadthing/react/hooks";
import type { UploadRouter } from "@/lib/uploadthing";

export const { useUploadThing } = generateReactHelpers<UploadRouter>();
