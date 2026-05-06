"use client";

import { useQuery } from "@tanstack/react-query";
import { testimonialApi } from "@/lib/testimonials";

const TEN_MINUTES = 10 * 60 * 1000;

export const testimonialKeys = {
  all: ["testimonials"] as const,
  list: () => [...testimonialKeys.all, "list"] as const,
};

export function useTestimonials() {
  return useQuery({
    queryKey: testimonialKeys.list(),
    queryFn: () => testimonialApi.list(),
    staleTime: TEN_MINUTES,
    select: (data) => data.testimonials,
  });
}
