"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import styles from "./postal-form.module.css";
import { useTransition } from "react";
import { createPostal } from "@/actions/postal";

const PostalFormSchema = z.object({
  fromName: z.string().min(1, "El nombre del remitente es obligatorio"),
  toName: z.string().min(1, "El nombre del destinatario es obligatorio"),
  message: z
    .string()
    .min(1, "El mensaje es obligatorio")
    .max(500, "El mensaje no puede exceder los 500 caracteres"),
  file: z
    .instanceof(File, { error: "La imagen es obligatoria" })
    .refine((file) => file !== undefined, "La imagen es obligatoria")
    .refine(
      (file) => file && file.size <= 5 * 1024 * 1024,
      "El tamaño de la imagen no puede exceder los 5MB"
    )
    .refine(
      (file) =>
        file && ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      "Solo se permiten imágenes JPEG, PNG o GIF"
    ),
});

type PostalFormData = z.infer<typeof PostalFormSchema>;

export const PostalForm = () => {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostalFormData>({
    resolver: zodResolver(PostalFormSchema),
  });

  const handlePostalSubmit = (data: PostalFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("fromName", data.fromName);
      formData.append("toName", data.toName);
      formData.append("message", data.message);
      formData.append("file", data.file);

      try {
        const response = await createPostal(formData);

        console.log("Postal created with response:", response);
      } catch (error) {
        console.error("Error creating postal:", error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handlePostalSubmit)} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="fromName">De:</label>
        <input type="text" {...register("fromName")} />
        {errors.fromName && <p>{errors.fromName.message}</p>}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="toName">Para:</label>
        <input type="text" {...register("toName")} />
        {errors.toName && <p>{errors.toName.message}</p>}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="message">Mensaje:</label>
        <textarea {...register("message")}></textarea>
        {errors.message && <p>{errors.message.message}</p>}
      </div>
      <div>
        <label htmlFor="image">Imagen:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : undefined;
            if (file) setValue("file", file);
          }}
        />
        {errors.file && <p>{errors.file.message}</p>}
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? "Creando..." : "Crear Postal"}
      </button>
    </form>
  );
};
