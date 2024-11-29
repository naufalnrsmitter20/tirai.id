import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

export const formatDate = (date: Date) => {
  return `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const sanitizeSearchTerm = (searchTerm: string) => {
  let sanitized = searchTerm.trim();

  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  sanitized = sanitized.replace(/[\u0000-\u001F\u007F]/g, "");

  return sanitized;
};
