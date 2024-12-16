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

export const sanitizeInput = (searchTerm: string) => {
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

export const formatNumber = (value: string, isInt?: boolean) => {
  const numericValue = isInt
    ? value.replace(/[^0-9]/g, "")
    : value.replace(/[^0-9.]/g, "");

  if (!isInt) {
    const parts = numericValue.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const parseNumberInput = (formattedNumber: string) => {
  const cleaned = formattedNumber.replace(/[^0-9.-]+/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const MAX_FILE_SIZE = 5_000_000;

interface Motto {
  title: string;
  description: string;
}

export const MOTTOS: Motto[] = [
  {
    title: "Tepat Waktu",
    description:
      "Produksi molor dan tidak tepat waktu? Itu tidak terjadi pada Tirai.id. Kami sangat berkomitmen pada waktu.",
  },
  {
    title: "Tepat Ukuran",
    description:
      "Kami membuat tirai dengan ukuran yang tepat, tidak terlalu tinggi atau terlalu rendah. Tidak kurang ataupun tidak terlalu banyak.",
  },
  {
    title: "Tepat Selera",
    description:
      "Menyediakan berbagai pilihan model dan jenis bahan dengan kualitas terbaik untuk memenuhi kebutuhan anda.",
  },
];
