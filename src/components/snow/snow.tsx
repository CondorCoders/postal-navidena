"use client";
import { useTheme } from "@/context/theme-context";
import styles from "./snow.module.css";

export const Snow = () => {
  const { backgroundTheme } = useTheme();
  return (
    backgroundTheme === "snow" && (
      <div className={styles.initialSnow}>
        {Array.from({ length: 50 }).map((_, index) => (
          <div key={crypto.randomUUID()} className={styles.snow}>
            &#10052;
          </div>
        ))}
      </div>
    )
  );
};
