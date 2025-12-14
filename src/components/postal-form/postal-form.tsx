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
import { Navigation } from "./navigation/navigation";

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
  theme: z.string().min(1, "El tema es obligatorio"),
  stamp: z.string().min(1, "El sello es obligatorio"),
});

export type PostalFormData = z.infer<typeof PostalFormSchema>;

export const PostalForm = () => {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isVertical, setIsVertical] = useState(false);
  const [flip, setFlip] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<PostalFormData>({
    resolver: zodResolver(PostalFormSchema),
    defaultValues: {
      theme: "red",
    },
  });

  const handlePostalSubmit = (data: PostalFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("fromName", data.fromName);
      formData.append("toName", data.toName);
      formData.append("message", data.message);
      formData.append("file", data.file);
      formData.append("theme", data.theme);
      formData.append("stamp", data.stamp);

      try {
        const response = await createPostal(formData);

        console.log("Postal created with response:", response);
      } catch (error) {
        console.error("Error creating postal:", error);
      }
    });
  };

  console.log(step);

  return (
    <form onSubmit={handleSubmit(handlePostalSubmit)} className={styles.form}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>
          {step === 1
            ? "Hora de decorar tu postal"
            : step === 2
            ? "Escribe tu mensaje"
            : "Revisa y envía tu postal"}
        </h1>
      </div>

      <div className={styles.builderContainer}>
        <PostalBuilder
          flip={flip}
          className={step === 1 ? styles.visible : styles.hidden}
          setValue={setValue}
          errors={errors}
          onVerticalChange={setIsVertical}
        />

        <PostalBack
          flip={flip}
          register={register}
          errors={errors}
          className={step === 2 ? styles.visible : styles.hidden}
          isVertical={isVertical}
          setValue={setValue}
        />
      </div>
      <Navigation
        step={step}
        setStep={setStep}
        isPending={isPending}
        trigger={trigger}
        setFlip={setFlip}
      />
    </form>
  );
};
