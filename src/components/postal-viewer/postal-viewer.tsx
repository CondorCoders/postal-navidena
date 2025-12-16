"use client";

import { useTheme } from "@/context/theme-context";
import { Postal } from "@/types/postal.types";
import { useEffect, useState } from "react";
import styles from "./postal-viewer.module.css";
import Image from "next/image";
import { stamps } from "@/config/stamps";
import { Button } from "../button/button";
import Link from "next/link";

interface PostalViewerProps {
  postal: Postal;
  postalUrl?: string;
}

export const PostalViewer = ({ postal }: PostalViewerProps) => {
  const { setBackgroundTheme, setTheme } = useTheme();
  const [flip, setFlip] = useState(false);
  const [copied, setCopied] = useState(false);

  const postalUrl = `${window?.location.origin}/mixtape/${postal.slug}`;

  useEffect(() => {
    setTheme(postal.theme);
    if (postal.backgroundTheme) {
      setBackgroundTheme(postal.backgroundTheme);
    }
  }, [postal, setBackgroundTheme, setTheme]);

  const handleCopy = () => {
    navigator.clipboard.writeText(postalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.postalViewer}>
      <div className={styles.postalViewerContent}>
        <div className={styles.header}>
          <Image src="/logo.png" alt="Logo" width={50} height={50} />

          <h1>Tienes correo</h1>
        </div>
        <div className={styles.postalContainer} onClick={() => setFlip(!flip)}>
          <div className={styles.postalWrapper}>
            <div
              className={`${styles.postalInner} ${flip ? styles.flip : ""} `}
            >
              <div className={styles.front}>
                <Image
                  src={postal.imageUrl}
                  fill
                  alt="Postal Image"
                  className={styles.postalImage}
                />
              </div>
              <div className={styles.back}>
                <div className={styles.namesAndStamp}>
                  <div className={styles.names}>
                    <h2 className={styles.name}>
                      <span className={styles.label}>De:</span>
                      <span className={styles.underline}>
                        {postal.fromName}
                      </span>
                    </h2>
                    <h2 className={styles.name}>
                      <span className={styles.label}>Para:</span>
                      <span className={styles.underline}>{postal.toName}</span>
                    </h2>
                  </div>
                  <Image
                    src={stamps[postal.stamp].src}
                    alt={stamps[postal.stamp].alt}
                    width={100}
                    height={100}
                    className={styles.stampImage}
                  />
                </div>

                <p className={styles.message}>{postal.message}</p>
              </div>
            </div>
          </div>
        </div>
        <p className={styles.instruction}>
          Haz clic en la postal para voltearla
        </p>
        <div className={styles.footer}>
          <div className={styles.copyContainer} onClick={handleCopy}>
            <span className={styles.copyText}>{postalUrl}</span>
            <Button className={styles.copyButton}>Copiar</Button>
            {copied && <span className={styles.copiedText}>Copiado!</span>}
          </div>
          <Link href="/" className={styles.createPostalLink}>
            Crea tu postal
          </Link>
        </div>
      </div>

      <div className={styles.credit}>
        Hecho con ❤️ por{" "}
        <Link
          href="https://github.com/CondorCoders"
          target="_blank"
          className={styles.createPostalLink}
        >
          CondorCoders
        </Link>
      </div>
    </div>
  );
};
