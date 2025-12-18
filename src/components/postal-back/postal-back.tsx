"use client";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import styles from "./postal-back.module.css";
import { PostalFormData } from "../postal-form/postal-form";
import { stamps } from "@/config/stamps";
import Image from "next/image";
import { useState } from "react";
import { PostalWrapper } from "../postal-wrapper/postal-wrapper";

interface PostalBackProps {
  className?: string;
  register: UseFormRegister<PostalFormData>;
  errors: FieldErrors<PostalFormData>;
  isVertical?: boolean;
  setFlip: (flip: boolean) => void;
  setValue: UseFormSetValue<PostalFormData>;
  flip?: boolean;
  readonly?: boolean;
  selectedStamp?: string | null;
}

export const PostalBack = ({
  register,
  errors,
  isVertical = false,
  flip,
  readonly,
  setFlip,
  selectedStamp = null,
}: PostalBackProps) => {
  const [messageLength, setMessageLength] = useState(0);

  const handlePostalFlip = () => {
    setFlip(!flip);
  };

  return (
    <PostalWrapper
      flip={flip || false}
      readonly={readonly}
      onFlip={handlePostalFlip}
      className={`${styles.postalBackContainer} ${flip ? styles.flipped : ""}`}
    >
      <div
        className={`${styles.postalBack} ${
          isVertical ? styles.postalBackVertical : ""
        } `}
      >
        <div className={styles.content}>
          <div className={styles.names}>
            <div className={styles.inputContainer}>
              <div className={styles.inputGroup}>
                <label htmlFor="fromName">De:</label>
                <input
                  type="text"
                  {...register("fromName")}
                  className={styles.input}
                  readOnly={readonly}
                />
              </div>

              {errors.fromName && (
                <p className={styles.error}>{errors.fromName.message}</p>
              )}
            </div>
            <div className={styles.inputContainer}>
              <div className={styles.inputGroup}>
                <label htmlFor="toName">Para:</label>
                <input
                  type="text"
                  {...register("toName")}
                  className={styles.input}
                  readOnly={readonly}
                />
              </div>
              {errors.toName && (
                <p className={styles.error}>{errors.toName.message}</p>
              )}
            </div>
          </div>
          <div
            className={`${styles.stamp} ${selectedStamp && styles.transparent}`}
          >
            {selectedStamp && (
              <Image
                fill
                src={stamps[selectedStamp].src}
                alt={stamps[selectedStamp].alt}
              />
            )}
          </div>
        </div>

        <div className={styles.messageInput}>
          <label htmlFor="message">Mensaje:</label>
          <textarea
            {...(() => {
              const { onChange, ...rest } = register("message");
              return {
                ...rest,
                onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setMessageLength(e.target.value.length);
                  onChange(e);
                },
              };
            })()}
            placeholder="Escribe tu mensaje aquí"
            className={styles.textarea}
            maxLength={125}
            readOnly={readonly}
          ></textarea>
          {!readonly && (
            <div className={styles.characterCount}>{messageLength}/125</div>
          )}
          {errors.message && (
            <p className={styles.error}>{errors.message.message}</p>
          )}
        </div>
      </div>
    </PostalWrapper>
  );
};
