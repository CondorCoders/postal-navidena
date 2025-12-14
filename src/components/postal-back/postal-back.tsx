"use client";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
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
  isVertical?: boolean;
  setFlip: (flip: boolean) => void;
  setValue: UseFormSetValue<PostalFormData>;
  flip?: boolean;
  readonly?: boolean;
}

export const PostalBack = ({
  className,
  register,
  errors,
  isVertical = false,
  setValue,
  flip,
  readonly,
  setFlip,
}: PostalBackProps) => {
  const stampsKeys = Object.keys(stamps);
  const [stampsVisible, setStampsVisible] = useState(stampsKeys);
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const [messageLength, setMessageLength] = useState(0);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    const matchedStamps = stampsKeys.filter((key) =>
      key.toLowerCase().includes(query)
    );
    setStampsVisible(matchedStamps.length > 0 ? matchedStamps : stampsKeys);
  };

  const selectStamp = (key: string) => {
    setSelectedStamp(key);
    setValue("stamp", key);
  };

  const handlePostalFlip = () => {
    setFlip(!flip);
  };

  return (
    <div
      className={`${styles.container} `}
      onClick={readonly ? handlePostalFlip : undefined}
    >
      <div
        className={`${styles.postalWrapper} ${readonly ? styles.readonly : ""}`}
      >
        <div className={`${styles.postalInner} ${flip ? styles.flip : ""} `}>
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
                maxLength={125}
                onChange={(e) => setMessageLength(e.target.value.length)}
                readOnly={readonly}
              ></textarea>
              <div className={styles.characterCount}>{messageLength}/125</div>
              {errors.message && (
                <p className={styles.error}>{errors.message.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.stampsSection} ${className}`}>
        <h2 className={`${styles.subtitle} srOnly`}>Estampas</h2>
        <input
          type="text"
          placeholder="Buscar estampa..."
          className={styles.searchInput}
          onChange={handleSearch}
        />
        <div className={styles.stampsContainer}>
          {stampsVisible.map((key) => (
            <Button
              key={key}
              type="button"
              className={`${styles.stampButton} ${
                selectedStamp === key ? styles.stampSelected : ""
              }`}
              onClick={() => selectStamp(key)}
            >
              <Image fill src={stamps[key].src} alt={stamps[key].alt} />
            </Button>
          ))}
        </div>
        {errors.stamp && <p className={styles.error}>{errors.stamp.message}</p>}
      </div>
    </div>
  );
};
