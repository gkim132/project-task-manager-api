import * as yup from "yup";

export const taskValidation = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .max(100, "Title must be at most 100 characters"),
  description: yup
    .string()
    .max(500, "Description must be at most 500 characters"),
  status: yup.string().oneOf(["pending", "in-progress", "completed"])
});
