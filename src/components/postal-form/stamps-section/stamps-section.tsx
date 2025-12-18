"use client";

import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { PostalFormData } from "../postal-form";
import { Button } from "@/components/button/button";
import { stamps } from "@/config/stamps";
import Image from "next/image";
import styles from "./stamps-section.module.css";
import { useState } from "react";

interface StampsSectionProps {
  className?: string;
  errors: FieldErrors<PostalFormData>;
  setValue: UseFormSetValue<PostalFormData>;
  onStampSelect?: (stampKey: string | null) => void;
}

export const StampsSection = ({
  className,
  errors,
  setValue,
  onStampSelect,
}: StampsSectionProps) => {
  const stampsKeys = Object.keys(stamps);
  const [stampsVisible, setStampsVisible] = useState(stampsKeys);
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    const matchedStamps = stampsKeys.filter((key) =>
      key.toLowerCase().includes(query)
    );
    setStampsVisible(matchedStamps.length > 0 ? matchedStamps : stampsKeys);
  };

  const selectStamp = (key: string) => {
    setSelectedStamp(key);
    setValue("stamp", key, { shouldValidate: true, shouldDirty: true });
    onStampSelect?.(key);
  };

  return (
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
  );
};
