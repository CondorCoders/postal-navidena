import { useTheme } from "@/context/theme-context";
import { useRef, useState } from "react";
import styles from "./postal-builder.module.css";
import { ThemeType } from "./postal-builder.types";
import { Button } from "../button/button";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { PostalFormData } from "../postal-form/postal-form";

const themes: ThemeType[] = ["red", "green", "wood"];

interface PostalBuilderProps {
  className?: string;
  setValue: UseFormSetValue<PostalFormData>;
  erros: FieldErrors<PostalFormData>;
}

export const PostalBuilder = ({
  className,
  setValue,
  erros,
}: PostalBuilderProps) => {
  const { setTheme } = useTheme();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e?.target?.result as string);
        setValue("file", file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.postalContainer}>
        <div className={styles.postal}>
          {imageSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageSrc} alt="Postal" className={styles.postalImage} />
          )}
        </div>
        <div
          className={` ${
            imageSrc ? styles.imageUploaded : styles.uploadButton
          }`}
        >
          <Button
            type="button"
            onClick={() => {
              fileRef.current?.click();
            }}
          >
            {imageSrc ? "Cambiar" : "Subir"} Imagen
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={styles.input}
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className={styles.themeContainer}>
        <h2 className={styles.subtitle}>Selecciona un tema:</h2>
        <div className={styles.themeSelector}>
          {themes.map((theme) => (
            <Button type="button" key={theme} onClick={() => setTheme(theme)}>
              {theme}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
