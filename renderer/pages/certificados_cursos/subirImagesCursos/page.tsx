"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useImageUploader } from "../../../databasesCursos/C_ImageUploaderDB";
import { IoIosExit } from "react-icons/io";
import LogoComponent from "../../../components/cursosComponents/C_LogoComponent";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { guardarImagenes } = useImageUploader();
  const [enabledInputs, setEnabledInputs] = useState<boolean[]>([
    true,
    true,
    true,
  ]); // Cambiado a true
  const [files, setFiles] = useState<Array<File | null>>([null, null, null]);


  const handleLogout = () => {
    // Eliminar la información de inicio de sesión del almacenamiento local
    sessionStorage.removeItem("isLoggedInCursos");
  };

  const handleCheckboxChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEnabledInputs = [...enabledInputs];
      newEnabledInputs[index] = e.target.checked;
      setEnabledInputs(newEnabledInputs);
    };

  const handleFileChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = [...files];
        newFiles[index] = e.target.files[0];
        setFiles(newFiles);
      }
    };

  const isGuardarButtonEnabled =
    enabledInputs.filter((enabled, index) => enabled).length ===
      files.filter((file, index) => file !== null && enabledInputs[index])
        .length && enabledInputs.some((enabled) => enabled);

  const handleGuardarImagenes = () => {
    const filesToSave = files
      .map((file, index) => {
        if (enabledInputs[index] && file) {
          let nombre;
          if (index === 0) {
            nombre = "imgCertiDigital";
          } else if (index === 1) {
            nombre = "imgCertiPhisyc";
          } else if (index === 2) {
            nombre = "imgCertiOnly";
          }
          return { file, nombre };
        }
        return null;
      })
      .filter(Boolean);

    console.log("Imágenes seleccionadas para guardar:", filesToSave);
    guardarImagenes(filesToSave);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      {/* Logo de la empresa en la esquina superior izquierda */}
      <div className="absolute top-0 left-0 m-4">
        <LogoComponent />
      </div>
      {/* Botón del icono en la esquina superior derecha */}
      <Link href="/certificados_cursos/selectTypesCursos/page">
        <IoIosExit
          onClick={handleLogout}

          className="w-12 h-12 absolute top-0 right-0 m-4 cursor-pointer text-[#ef4444] hover:text-[#fc4444]"
          size={24}
        />
      </Link>

      <h1 className="text-4xl font-bold tracking-tight text-gray-500 sm:text-5xl md:text-6xl p-6 mb-8">
        <span className="block">
          Certificados para
          <span className=" text-transparent bg-clip-text bg-gradient-to-tr to-cyan-500 from-blue-600">
            {" "}
            CURSOS
          </span>
        </span>
      </h1>
      <div className="flex flex-row">
        {[
          { text: "Certificado Digital", key: 0 },
          { text: "Certificado Físco", key: 1 },
          { text: "Certificado Firma-Empresa", key: 2 },
        ].map(({ text, key }) => (
          <div key={key} className="mr-10 flex">
            <div className="flex items-end">
              <input
                className="checkbox checkbox-info checkbox-lg mb-2 mr-1"
                type="checkbox"
                checked={enabledInputs[key]}
                onChange={handleCheckboxChange(key)}
              />
            </div>
            <label className="form-control w-full max-w-xs">
              <p className="text-md font-bold">{text}</p>
              <p className="text-sm mb-1">
                Elige un archivo con las dimensiones: 4677x3307
              </p>
              <input
                className="file-input w-full max-w-xs file-input-info"
                type="file"
                onChange={handleFileChange(key)}
                accept="image/*"
                disabled={!enabledInputs[key]}
              />
              {files[key] && (
                <img
                  src={
                    files[key] !== null
                      ? URL.createObjectURL(files[key] as Blob)
                      : ""
                  }
                  alt={`Preview ${key}`}
                  className="w-max"
                />
              )}
            </label>
          </div>
        ))}
      </div>
      <Link
        href="/certificados_cursos/selectTypesCursos/page"
        passHref
        legacyBehavior
      >
        <button
          className={`btn btn-info btn-lg mt-8  ${
            !isGuardarButtonEnabled ? "cursor-not-allowed opacity-90 border-transparent" : ""
          }`}
          onClick={handleGuardarImagenes}
          disabled={!isGuardarButtonEnabled}
        >
          Guardar Imágenes
        </button>
      </Link>
    </main>
  );
}
