"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import styles from "./postal-form.module.css";
import { useState, useTransition, useRef } from "react";
import { createPostal } from "@/actions/postal";
import { PostalFront } from "../postal-front/postal-front";
import { PostalBack } from "../postal-back/postal-back";
import { Navigation } from "./navigation/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@/context/theme-context";
import {
  ThemeType,
  BackgroundThemeType,
} from "../postal-front/postal-front.types";
import { EditContainer } from "./edit-container/edit-container";
import { StampsSection } from "./stamps-section/stamps-section";

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
  backgroundTheme: z.string().optional(),
  stamp: z
    .string({ error: "El sello es obligatorio" })
    .min(1, "El sello es obligatorio"),
});

export type PostalFormData = z.infer<typeof PostalFormSchema>;

export const PostalForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isVertical, setIsVertical] = useState(false);
  const [flip, setFlip] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const builderAddStickerRef = useRef<((stickerSrc: string) => void) | null>(
    null
  );
  const {
    setTheme,
    theme: currentTheme,
    setBackgroundTheme,
    backgroundTheme,
  } = useTheme();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<PostalFormData>({
    resolver: zodResolver(PostalFormSchema),
    mode: "onChange",
    defaultValues: {
      theme: "red",
      stamp: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const vertical = img.height > img.width;
          setIsVertical(vertical);
        };
        img.src = e?.target?.result as string;
        setImageSrc(e?.target?.result as string);
        setValue("file", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTheme = (theme: ThemeType) => {
    setTheme(theme);
    setValue("theme", theme);
  };

  const addSticker = (stickerSrc: string) => {
    if (builderAddStickerRef.current) {
      builderAddStickerRef.current(stickerSrc);
    }
  };

  const handlePostalSubmit = (data: PostalFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("fromName", data.fromName);
      formData.append("toName", data.toName);
      formData.append("message", data.message);
      formData.append("file", data.file);
      formData.append("theme", data.theme);
      formData.append("stamp", data.stamp);
      formData.append("backgroundTheme", data.backgroundTheme || "");

      try {
        const response = await createPostal(formData);

        if (response?.slug) {
          router.push(`/postal/${response.slug}`);
        }
      } catch (error) {
        console.error("Error creating postal:", error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handlePostalSubmit)} className={styles.form}>
      <div className={styles.titleContainer}>
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
        <h1 className={styles.title}>
          {step === 1
            ? "Hora de decorar tu postal"
            : step === 2
            ? "Escribe tu mensaje"
            : "Revisa y envía tu postal"}
        </h1>
      </div>

      <div className={styles.builderContainer}>
        <div
          className={`${styles.container} ${isVertical ? styles.vertical : ""}`}
        >
          <PostalFront
            flip={flip}
            className={step === 1 ? styles.visible : styles.hidden}
            setValue={setValue}
            errors={errors}
            onVerticalChange={setIsVertical}
            readonly={step === 3}
            setFlip={setFlip}
            imageSrc={imageSrc}
            isVertical={isVertical}
            onAddSticker={(fn) => {
              builderAddStickerRef.current = fn;
            }}
          />

          <PostalBack
            flip={flip}
            register={register}
            errors={errors}
            className={step === 2 ? styles.visible : styles.hidden}
            isVertical={isVertical}
            setValue={setValue}
            readonly={step === 3}
            setFlip={setFlip}
            selectedStamp={selectedStamp}
          />
        </div>
        <EditContainer
          className={step !== 1 ? styles.hidden : styles.visible}
          errors={errors}
          fileRef={fileRef}
          handleFileChange={handleFileChange}
          imageSrc={imageSrc}
          currentTheme={(currentTheme || "red") as ThemeType}
          handleTheme={handleTheme}
          backgroundTheme={
            (backgroundTheme || "classic") as BackgroundThemeType
          }
          setBackgroundTheme={setBackgroundTheme}
          setValue={setValue}
          addSticker={addSticker}
        />
        <StampsSection
          className={step === 2 ? styles.visible : styles.hidden}
          errors={errors}
          setValue={setValue}
          onStampSelect={setSelectedStamp}
        />
        {step === 3 && (
          <p className={styles.flipInstruction}>
            Da click en la postal para voltearla
          </p>
        )}
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
