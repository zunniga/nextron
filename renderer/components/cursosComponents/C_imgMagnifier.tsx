import React, { useState } from "react";

const ImageMagnifier = ({
  src,
  alt,
  magnifierHeight = 100,
  magnifieWidth = 100,
  zoomLevel = 1.5,
}: {
  src: string;
  alt: string;
  magnifierHeight?: number;
  magnifieWidth?: number;
  zoomLevel?: number;
}) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  return (
    <div
      className="image-container w-[68%]" // Nuevo contenedor para la imagen
      style={{
        position: "relative",
        textAlign: "center", // Centrar horizontalmente
      }}
    >
      <img
        src={src}
        alt={alt} // Se agrega el atributo alt para accesibilidad
        className="image-content" // Nuevo estilo para la imagen
        onMouseEnter={(e) => {
          const elem = e.currentTarget;
          const { width, height } = elem.getBoundingClientRect();
          setSize([width, height]);
          setShowMagnifier(true);
        }}
        onMouseMove={(e) => {
          const elem = e.currentTarget;
          const { width, height, top, left } = elem.getBoundingClientRect();
          const x = (e.pageX - left - window.pageXOffset) / width;
          const y = (e.pageY - top - window.pageYOffset) / height;
          setXY([x, y]);
        }}
        onMouseLeave={() => {
          setShowMagnifier(false);
        }}
      />

      <div
        style={{
          display: showMagnifier ? "" : "none",
          position: "absolute",
          pointerEvents: "none",
          height: `${magnifierHeight}px`,
          width: `${magnifieWidth}px`,
          top: `calc(${y * 100}% - ${magnifierHeight / 2}px)`,
          left: `calc(${x * 100}% - ${magnifieWidth / 2}px)`,
          opacity: "1",
          border: "1px solid lightgray",
          backgroundColor: "white",
          backgroundImage: `url('${src}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${imgWidth * zoomLevel}px ${
            imgHeight * zoomLevel
          }px`,
          backgroundPositionX: `${
            -x * imgWidth * zoomLevel + magnifieWidth / 2
          }px`,
          backgroundPositionY: `${
            -y * imgHeight * zoomLevel + magnifierHeight / 2
          }px`,
        }}
      ></div>
    </div>
  );
};

export default ImageMagnifier;
