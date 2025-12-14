"use client";

import { Button } from "@/components/button/button";
import styles from "./navigation.module.css";
import { UseFormTrigger } from "react-hook-form";
import { PostalFormData } from "../postal-form";

interface NavigationProps {
  step: number;
  setStep: (step: number) => void;
  setFlip: (flip: boolean) => void;
  isPending: boolean;
  trigger: UseFormTrigger<PostalFormData>;
}

const validations: Record<number, (keyof PostalFormData)[]> = {
  1: ["file", "theme"] as (keyof PostalFormData)[],
  2: ["fromName", "toName", "message", "stamp"] as (keyof PostalFormData)[],
};

export const Navigation = ({
  step,
  setStep,
  isPending,
  trigger,
  setFlip,
}: NavigationProps) => {
  const handleNavigation = async (direction: "next" | "previous") => {
    if (direction === "previous") {
      const prevStep = step - 1;

      setStep(prevStep);
      if (prevStep === 2) {
        setFlip(true);
        return;
      }
      setFlip(false);
      return;
    }

    const valid = await trigger(validations[step]);
    if (!valid) return;

    const nextStep = step + 1;

    setStep(nextStep);

    if (nextStep === 3) {
      setFlip(false);
      return;
    }
    setFlip(true);
  };

  return (
    <div className={styles.buttonsContainer}>
      <div className={styles.buttonGroup}>
        {step > 1 && (
          <Button type="button" onClick={() => handleNavigation("previous")}>
            Anterior
          </Button>
        )}
        {step < 3 && (
          <Button type="button" onClick={() => handleNavigation("next")}>
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
  );
};
