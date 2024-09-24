"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const CheckboxExample: React.FC = () => {
  // Mapping object for original names to modified names
  const nameMappings: { [key: string]: string } = {
    ecomas: "Ecomás",
    promas: "Promás",
    binex: "Binex",
    cimade: "Cimade",
    rizo: "Rizo",
    sayan: "Sayan",
  };

  // Estado local para almacenar el nombre del checkbox seleccionado
  const [selectedCompanyCursos, setselectedCompanyCursos] = useState<
    string | null
  >(null);

  // Cargar el estado inicial desde el localStorage al inicio
  useEffect(() => {
    const storedCheckbox = localStorage.getItem("selectedCompanyCursos");
    if (storedCheckbox) {
      setselectedCompanyCursos(storedCheckbox);
    }
  }, []);

  // Función para manejar el cambio de estado cuando se selecciona un checkbox
  const handleCheckboxChange = (name: string) => {
    setselectedCompanyCursos(name);
    localStorage.setItem("selectedCompanyCursos", name);
  };

  // Esta función se llamará antes de que la página se cierre
  const limpiarLocalStorage = () => {
    sessionStorage.removeItem("selectedFilePathCursos");
  };

  return (
    <main className="relative flex flex-col items-center justify-center h-screen">
      {/* Botón del icono en la esquina superior derecha */}
      <h1 className="text-4xl font-bold tracking-tight text-gray-300 sm:text-5xl md:text-6xl p-6 mb-8">
        <span className="block">
          Certificados para{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-tr to-cyan-500 from-blue-600">
            {" "}
            CURSOS
          </span>
        </span>
      </h1>
      <h2 className="text-xl mb-4">
        Por favor seleccione la empresa para la cual se van a generar
        certificados:{" "}
      </h2>
      <div className="flex flex-row">
        {["ecomas", "promas", "binex", "cimade", "rizo", "sayan"].map(
          (name, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 text-gray-800 font-semibold mr-4 p-4 rounded-xl"
            >
              <div className="mr-2">{nameMappings[name]}</div>
              <div className="flex items-end">
                <input
                  className="checkbox checkbox-info checkbox-lg  mr-1"
                  type="checkbox"
                  onChange={() => handleCheckboxChange(name)}
                  checked={selectedCompanyCursos === name}
                />
              </div>
            </div>
          )
        )}
      </div>
      <div className="flex flex-row">
        <Link href="/certificados_cursos/selectTypesCursos/page" passHref>
          <button
            className={` mr-4 btn btn-info  btn-lg mt-8 ${
              !selectedCompanyCursos
                ? "disabled:opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!selectedCompanyCursos}
          >
            Ir a generar Certificados
          </button>
        </Link>
        <Link href="/home" passHref>
          <button
            className=" btn btn-error btn-outline  btn-lg mt-8"
            onClick={limpiarLocalStorage}
          >
            Salir
          </button>
        </Link>
      </div>
    </main>
  );
};

export default CheckboxExample;
