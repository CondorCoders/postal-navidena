"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import styles from "./postal-form.module.css";
import { useState, useTransition } from "react";
import { createPostal } from "@/actions/postal";
import { useTheme } from "@/context/theme-context";
import { PostalBuilder } from "../postal-builder/postal-builder";
import { Button } from "../button/button";
import { PostalBack } from "../postal-back/postal-back";

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

export type PostalFormData = z.infer<typeof PostalFormSchema>;

export const PostalForm = () => {
  const [step, setStep] = useState(1);
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
      <h1 className={styles.title}>
        {step === 1
          ? "Decora tu postal"
          : step === 2
          ? "Escribe tu mensaje"
          : "Revisa y envía tu postal"}
      </h1>
      <PostalBuilder
        className={step === 1 ? styles.visible : styles.hidden}
        setValue={setValue}
        erros={errors}
      />

      <PostalBack
        register={register}
        errors={errors}
        className={step === 2 ? styles.visible : styles.hidden}
      />

      <div className={styles.buttonsContainer}>
        <div className={styles.buttonGroup}>
          {step > 1 && (
            <Button type="button" onClick={() => setStep(step - 1)}>
              Anterior
            </Button>
          )}
          {step < 3 && (
            <Button type="button" onClick={() => setStep(step + 1)}>
              Siguiente
            </Button>
          )}
          {step === 3 && (
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creando..." : "Crear Postal"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
