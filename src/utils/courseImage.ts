import { Course } from "@/types";

/**
 * Resolves a course thumbnail URL.
 * If the URL is empty or points to the deprecated, broken dummyjson CDN paths,
 * it returns a stable, unique, high-quality image from Lorem Picsum seeded by the course ID.
 */
export function getCourseThumbnail(course: Course): string {
  if (
    !course.thumbnail ||
    course.thumbnail.includes("dummyjson.com/product-images/")
  ) {
    return `https://picsum.photos/seed/lms-course-${course.id}/600/400`;
  }
  return course.thumbnail;
}
