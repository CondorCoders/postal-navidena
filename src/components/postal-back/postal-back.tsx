"use client";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import styles from "./postal-back.module.css";
import { PostalFormData } from "../postal-form/postal-form";
import { stamps } from "@/config/stamps";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../button/button";

interface PostalBackProps {
  className?: string;
  register: UseFormRegister<PostalFormData>;
  errors: FieldErrors<PostalFormData>;
}

export const PostalBack = ({
  className,
  register,
  errors,
}: PostalBackProps) => {
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.postalBack}>
        <div className={styles.content}>
          <div className={styles.namesContainer}>
            <div className={styles.names}>
              <div className={styles.inputGroup}>
                <label htmlFor="fromName">De:</label>
                <input
                  type="text"
                  {...register("fromName")}
                  className={styles.input}
                />
                {errors.fromName && <p>{errors.fromName.message}</p>}
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="toName">Para:</label>
                <input
                  type="text"
                  {...register("toName")}
                  className={styles.input}
                />
                {errors.toName && <p>{errors.toName.message}</p>}
              </div>
            </div>
            <div
              className={`${styles.stamp} ${
                selectedStamp && styles.transparent
              }`}
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
              {...register("message")}
              placeholder="Escribe tu mensaje aquí"
              className={styles.textarea}
            ></textarea>
            {errors.message && <p>{errors.message.message}</p>}
          </div>
        </div>
      </div>
      <div className={styles.stampsSection}>
        <h2 className={styles.subtitle}>Estampas</h2>
        <div className={styles.stampsContainer}>
          {Object.entries(stamps).map(([key, stamp]) => (
            <Button
              key={key}
              type="button"
              className={`${styles.stampButton} ${
                selectedStamp === key ? styles.stampSelected : ""
              }`}
              onClick={() => setSelectedStamp(key)}
            >
              <Image fill src={stamp.src} alt={stamp.alt} />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
