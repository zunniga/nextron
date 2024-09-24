import React, { useState } from 'react';

export function ImageMagnifier({
    src,

    magnifierHeight = 100,
    magnifierWidth = 100,
    zoomLevel = 0.5
}: {
    src: string;
    alt: string;
    magnifierHeight?: number;
    magnifierWidth?: number;
    zoomLevel?: number;
}) {
    const [[x, y], setXY] = useState([0, 0]);
    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
    const [showMagnifier, setShowMagnifier] = useState(false);

    return (
        <div
            className="image-container w-3/4"
            style={{
                position: "relative",
                textAlign: "center",
            }}
        >
            <img
                src={src}
                className="image-content"
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
                    width: `${magnifierWidth}px`,
                    top: `calc(${y * 100}% - ${magnifierHeight / 2}px)`,
                    left: `calc(${x * 100}% - ${magnifierWidth / 2}px)`,
                    opacity: "1",
                    border: "1px solid lightgray",
                    backgroundColor: "white",
                    backgroundImage: `url('${src}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                    backgroundPositionX: `${-x * imgWidth * zoomLevel + magnifierWidth / 2}px`,
                    backgroundPositionY: `${-y * imgHeight * zoomLevel + magnifierHeight / 2}px`,
                    borderRadius: "50%", // Hacer la lupa circular
                    boxShadow: "0 0 8px rgba(0, 0, 0, 0.6)" // Añadir una sombra para resaltar la lupa
                }}
            ></div>
        </div>
    );
}
