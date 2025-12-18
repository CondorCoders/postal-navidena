"use client";

import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { PostalFormData } from "../postal-form";
import { Button } from "@/components/button/button";
import { SVGButton } from "@/components/svg-icons";
import { stickers } from "@/config/stickers";
import Image from "next/image";
import styles from "./edit-container.module.css";
import {
  ThemeType,
  BackgroundThemeType,
} from "@/components/postal-front/postal-front.types";

const themes: ThemeType[] = ["red", "green", "wood"];
const backgroundThemes: BackgroundThemeType[] = [
  "classic",
  "snow",
  "diamond",
  "diagonal",
];

interface EditContainerProps {
  className?: string;
  errors: FieldErrors<PostalFormData>;
  fileRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imageSrc: string | null;
  currentTheme: ThemeType;
  handleTheme: (theme: ThemeType) => void;
  backgroundTheme: BackgroundThemeType;
  setBackgroundTheme: (theme: BackgroundThemeType) => void;
  setValue: UseFormSetValue<PostalFormData>;
  addSticker: (stickerSrc: string) => void;
}

export const EditContainer = ({
  className,
  errors,
  fileRef,
  handleFileChange,
  imageSrc,
  currentTheme,
  handleTheme,
  backgroundTheme,
  setBackgroundTheme,
  setValue,
  addSticker,
}: EditContainerProps) => {
  return (
    <div className={`${styles.editContainer} ${className}`}>
      {errors.file && <p className={styles.error}>{errors.file.message}</p>}
      <div className={styles.settingsContainer}>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className={styles.input}
          onChange={handleFileChange}
        />
        <Button
          type="button"
          onClick={() => {
            fileRef.current?.click();
          }}
          className={`${!imageSrc ? styles.uploadButton : styles.changeButton}`}
        >
          {imageSrc ? "Cambiar" : "Subir"} Imagen
        </Button>
      </div>
      <div className={styles.settingsContainer}>
        <div className={styles.themeSelector}>
          <h2 className={`${styles.subtitle} srOnly`}>Selecciona un tema:</h2>
          {themes.map((theme) => (
            <Button
              key={theme}
              data-theme={theme}
              type="button"
              className={`${styles.themeButton} ${
                theme === currentTheme && styles.themeSelected
              }`}
              onClick={() => handleTheme(theme)}
            />
          ))}
        </div>
        <div className={styles.themeSelector}>
          <h2 className={`${styles.subtitle} srOnly`}>
            Selecciona un tipo de fondo:
          </h2>
          {backgroundThemes.map((bTheme) => (
            <SVGButton
              key={bTheme}
              svgName={bTheme}
              type="button"
              onClick={() => {
                setBackgroundTheme(bTheme);
                setValue("backgroundTheme", bTheme);
              }}
              active={bTheme === backgroundTheme}
            />
          ))}
        </div>
      </div>

      {imageSrc && (
        <div className={styles.stickersContainer}>
          <h2 className={`${styles.subtitle} srOnly`}>Stickers</h2>
          <div className={styles.stickersSelector}>
            {Object.entries(stickers).map(([key, sticker]) => (
              <Button
                key={key}
                type="button"
                className={styles.sticker}
                onClick={() =>
                  addSticker((sticker as { src: string; alt: string }).src)
                }
              >
                <Image
                  fill
                  src={(sticker as { src: string; alt: string }).src}
                  alt={(sticker as { src: string; alt: string }).alt}
                  className={styles.stickerImage}
                />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
