"use client";

import { useTheme } from "@/context/theme-context";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./postal-front.module.css";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { PostalFormData } from "../postal-form/postal-form";
import { PostalWrapper } from "../postal-wrapper/postal-wrapper";
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

interface PostalFrontProps {
  className?: string;
  flip: boolean;
  setFlip: (flip: boolean) => void;
  setValue: UseFormSetValue<PostalFormData>;
  errors: FieldErrors<PostalFormData>;
  onVerticalChange?: (isVertical: boolean) => void;
  readonly?: boolean;
  imageSrc?: string | null;
  isVertical?: boolean;
  onAddSticker?: (fn: (stickerSrc: string) => void) => void;
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
        onTap={readonly ? undefined : onSelect}
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
          onTap={readonly ? undefined : () => deleteSticker(id!)}
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

export const PostalFront = ({
  setValue,
  flip,
  setFlip,
  readonly,
  imageSrc = null,
  isVertical = false,
  onAddSticker,
}: PostalFrontProps) => {
  useTheme();
  const postalRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [canvaSize, setCanvaSize] = useState({ width: 300, height: 200 });
  const [canvaStickers, setCanvaStickers] = useState<KonvaImageNode[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(
    null
  );

  const addSticker = useCallback(
    (stickerSrc: string) => {
      const newStickerId = crypto.randomUUID();
      setCanvaStickers((prevStickers) => [
        ...prevStickers,
        {
          id: newStickerId,
          src: stickerSrc,
          x: canvaSize.width / 2 - 50,
          y: canvaSize.height / 2 - 50,
          width: 100,
          height: 100,
        },
      ]);
      setSelectedStickerId(newStickerId);
    },
    [canvaSize]
  );

  // Expose addSticker function to parent via callback
  useEffect(() => {
    if (onAddSticker) {
      onAddSticker(addSticker);
    }
  }, [onAddSticker, addSticker]);

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
      } catch {
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
    <PostalWrapper
      flip={flip}
      readonly={readonly}
      onFlip={handlePostalFlip}
      className={`${styles.postalFrontContainer} ${flip ? styles.flipped : ""}`}
      innerRef={postalRef}
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
    </PostalWrapper>
  );
};
