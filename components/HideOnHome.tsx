"use client";
import { usePathname } from "next/navigation";
export default function HideOnHome({ children }: { children: React.ReactNode }) {
  return usePathname() === "/" ? null : <>{children}</>;
}
