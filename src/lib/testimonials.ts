import { api } from "@/lib/api";

export interface Testimonial {
  id: string;
  studentName: string;
  studentClass: string | null;
  body: string;
  rating: number;
  avatarUrl: string | null;
  createdAt: string;
}

export const testimonialApi = {
  list: () => api.get<{ testimonials: Testimonial[] }>("/testimonials"),
};
