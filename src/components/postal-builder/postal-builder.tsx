"use client";

import { useTheme } from "@/context/theme-context";
import { useEffect, useRef, useState } from "react";
import styles from "./postal-builder.module.css";
import { ThemeType, BackgroundThemeType } from "./postal-builder.types";
import { Button } from "../button/button";
import { SVGButton } from "../svg-icons";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { PostalFormData } from "../postal-form/postal-form";
import { stickers } from "@/config/stickers";
import Image from "next/image";
import {
  Layer,
  Stage,
  Image as KonvaImage,
  Transformer,
  Group,
  Circle,
  Text,
} from "react-konva";
import useImage from "use-image";
import Konva from "konva";

const themes: ThemeType[] = ["red", "green", "wood"];
const backgroundThemes: BackgroundThemeType[] = [
  "classic",
  "snow",
  "diamond",
  "diagonal",
];

interface PostalBuilderProps {
  className?: string;
  flip: boolean;
  setFlip: (flip: boolean) => void;
  setValue: UseFormSetValue<PostalFormData>;
  errors: FieldErrors<PostalFormData>;
  onVerticalChange?: (isVertical: boolean) => void;
  readonly?: boolean;
}

interface KonvaImageNode {
  id: string;
  src: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface LayerImageProps extends Konva.GroupConfig {
  src: string;
  isSelected: boolean;
  onSelect: () => void;
  updateSticker: (newAttrs: KonvaImageNode) => void;
  deleteSticker: (stickerId: string) => void;
  readonly?: boolean;
  hideUI?: boolean;
}
const LayerImage = ({
  id,
  src,
  onSelect,
  isSelected,
  updateSticker,
  deleteSticker,
  readonly,
  hideUI,
  ...rest
}: LayerImageProps) => {
  const [image] = useImage(src, "anonymous");
  const groupRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected) {
      trRef.current?.nodes([groupRef.current!]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group
        ref={groupRef}
        {...rest}
        onClick={readonly ? undefined : onSelect}
        onDragStart={readonly ? undefined : onSelect}
        onDragEnd={
          readonly
            ? undefined
            : (e) => {
                updateSticker({
                  ...rest,
                  id: id!,
                  src,
                  x: e.target.x(),
                  y: e.target.y(),
                });
              }
        }
        onTransformEnd={
          readonly
            ? undefined
            : () => {
                const node = groupRef.current;
                if (node) {
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();

                  node.scaleX(1);
                  node.scaleY(1);

                  updateSticker({
                    id: id!,
                    src,
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(5, node.width() * scaleX),
                    height: Math.max(5, node.height() * scaleY),
                  });
                }
              }
        }
      >
        <KonvaImage image={image} width={rest.width} height={rest.height} />
        <Group
          x={rest.width}
          y={-10}
          visible={isSelected && !readonly && !hideUI}
          onClick={readonly ? undefined : () => deleteSticker(id!)}
        >
          <Circle radius={10} fill="black" />
          <Text text="X" fill="white" offsetX={4} offsetY={5} />
        </Group>
      </Group>
      {isSelected && !readonly && !hideUI && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            // limitar redimensionamiento
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

interface BackgroundImageProps extends Omit<Konva.ImageConfig, "image"> {
  src: string;
}

const BackgroundImage = ({
  src,
  width,
  height,
  ...rest
}: BackgroundImageProps) => {
  const [image] = useImage(src, "anonymous");

  if (!image || !width || !height) {
    return (
      <KonvaImage
        {...rest}
        image={image}
        id="base"
        width={width}
        height={height}
      />
    );
  }

  // Calcular dimensiones para comportamiento object-fit: cover
  const imageAspect = image.width / image.height;
  const containerAspect = width / height;

  let renderWidth = width;
  let renderHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageAspect > containerAspect) {
    // La imagen es más ancha que el contenedor
    renderWidth = height * imageAspect;
    offsetX = (width - renderWidth) / 2;
  } else {
    // La imagen es más alta que el contenedor
    renderHeight = width / imageAspect;
    offsetY = (height - renderHeight) / 2;
  }

  return (
    <KonvaImage
      {...rest}
      image={image}
      id="base"
      x={offsetX}
      y={offsetY}
      width={renderWidth}
      height={renderHeight}
    />
  );
};

export const PostalBuilder = ({
  className,
  setValue,
  errors,
  onVerticalChange,
  flip,
  setFlip,
  readonly,
}: PostalBuilderProps) => {
  const {
    setTheme,
    theme: currentTheme,
    setBackgroundTheme,
    backgroundTheme,
  } = useTheme();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const postalRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [canvaSize, setCanvaSize] = useState({ width: 300, height: 200 });
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isVertical, setIsVertical] = useState(false);
  const [canvaStickers, setCanvaStickers] = useState<KonvaImageNode[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(
    null
  );

  const addSticker = (stickerSrc: string) => {
    setCanvaStickers((prevStickers) => [
      ...prevStickers,
      {
        id: crypto.randomUUID(),
        src: stickerSrc,
        x: canvaSize.width / 2 - 50,
        y: canvaSize.height / 2 - 50,
        width: 100,
        height: 100,
      },
    ]);
  };
  const updateSticker = (sticker: KonvaImageNode) => {
    setCanvaStickers((prevStickers) =>
      prevStickers.map((st) =>
        st.id === sticker.id ? { ...st, ...sticker } : st
      )
    );
  };
  const deleteSticker = (stickerId: string) => {
    setCanvaStickers((prevStickers) =>
      prevStickers.filter((st) => st.id !== stickerId)
    );
  };
  const checkDeselect = (
    e: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>
  ) => {
    const clickedOnEmpty = e.target.attrs.id === "base";
    if (clickedOnEmpty) {
      setSelectedStickerId(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const vertical = img.height > img.width;
          setIsVertical(vertical);
          onVerticalChange?.(vertical);
        };
        img.src = e?.target?.result as string;
        setImageSrc(e?.target?.result as string);
        setValue("file", file);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const updateCanvasSize = () => {
      if (postalRef.current) {
        setCanvaSize({
          width: postalRef.current.clientWidth,
          height: postalRef.current.clientHeight,
        });
      }
    };

    updateCanvasSize();

    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [isVertical]);

  const handleTheme = (theme: ThemeType) => {
    setTheme(theme);
    setValue("theme", theme);
  };

  const handlePostalFlip = () => {
    setFlip(!flip);
  };

  // Convert a dataURL to a Blob for creating a File
  const dataURLToBlob = (dataURL: string) => {
    const parts = dataURL.split(",");
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  useEffect(() => {
    if (readonly) return;
    if (!flip) return;
    if (!imageSrc) return;

    const stage = stageRef.current;
    if (!stage) return;

    let cancelled = false;
    const exportImage = async () => {
      setIsExporting(true);
      setSelectedStickerId(null);
      await new Promise((r) => setTimeout(r, 0));
      await new Promise((r) => requestAnimationFrame(() => r(undefined)));
      stage.getLayers().forEach((l) => l.batchDraw());
      if (cancelled) return;
      try {
        const dataURL = stage.toDataURL({ pixelRatio: 2 });
        const blob = dataURLToBlob(dataURL);
        const file = new File([blob], "postal.png", { type: blob.type });
        setValue("file", file, { shouldValidate: true, shouldDirty: true });
      } catch (e) {
        // ignorar errores
      } finally {
        if (!cancelled) setIsExporting(false);
      }
    };
    exportImage();

    return () => {
      cancelled = true;
    };
  }, [flip, imageSrc, readonly, setValue]);

  return (
    <div
      className={`${styles.container}`}
      onClick={readonly ? handlePostalFlip : undefined}
    >
      <div
        className={`${styles.postalWrapper} ${readonly ? styles.readonly : ""}`}
      >
        <div
          ref={postalRef}
          className={`${styles.postalInner} ${flip ? styles.flip : ""} `}
        >
          <div
            className={`${styles.postal} ${
              isVertical ? styles.postalVertical : ""
            } `}
          >
            <Stage
              width={canvaSize.width}
              height={canvaSize.height}
              ref={stageRef}
              onMouseDown={readonly ? undefined : checkDeselect}
              onTouchStart={readonly ? undefined : checkDeselect}
            >
              <Layer>
                {imageSrc && (
                  <BackgroundImage
                    src={imageSrc}
                    width={canvaSize.width}
                    height={canvaSize.height}
                  />
                )}
              </Layer>
              <Layer>
                {!!canvaStickers.length &&
                  canvaStickers.map((sticker) => (
                    <LayerImage
                      key={sticker.id}
                      id={sticker.id}
                      onSelect={() => setSelectedStickerId(sticker.id)}
                      isSelected={selectedStickerId === sticker.id}
                      deleteSticker={deleteSticker}
                      updateSticker={updateSticker}
                      src={sticker.src}
                      x={sticker.x}
                      y={sticker.y}
                      width={sticker.width || 100}
                      height={sticker.height || 100}
                      draggable={!readonly}
                      readonly={readonly}
                      hideUI={isExporting}
                    />
                  ))}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
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
            className={`${
              !imageSrc ? styles.uploadButton : styles.changeButton
            }`}
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
                  onClick={() => addSticker(sticker.src)}
                >
                  <Image
                    fill
                    src={sticker.src}
                    alt={sticker.alt}
                    className={styles.stickerImage}
                  />
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
