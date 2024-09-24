"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useImageUploader } from "../../../../components/graduates/Ecomas/ImageEcomasDB";
import { BiLogOut } from "react-icons/bi";

export default function Home() {
  const { guardarImagenes } = useImageUploader();
  const [enabledInputs, setEnabledInputs] = useState<boolean[]>([true, true]); // Cambiado a true
  const [files, setFiles] = useState<Array<File | null>>([null, null]);

  useEffect(() => {
    // Verificar si el usuario está autenticado
  }, []);


  const handleCheckboxChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEnabledInputs = [...enabledInputs];
      newEnabledInputs[index] = e.target.checked;
      setEnabledInputs(newEnabledInputs);
    };

  const handleFileChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
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
    <main className="bg-[#001d51] flex flex-col items-center justify-center h-screen">
      {/* Botón del icono en la esquina superior derecha */}
      <Link href="/graduates_main/graduate_ecomas/routess/page">
        <BiLogOut
          color="#ffff"
          className="w-12 h-12 absolute top-0 left-0 m-4 cursor-pointer text-gray-500"
          size={24}
        />
      </Link>

      <h1 className="text-4xl font-extralight tracking-tight text-slate-200 sm:text-5xl md:text-6xl p-6 mb-8">
        <span className="block">MÓDELO DE DIPLOMA PARA MODIFICAR</span>
      </h1>
      <div className="flex flex-row">
        {[0, 1].map((index) => (
          <div key={index} className="mr-10 flex">
            <div className="flex items-end">
              <input
                className="checkbox checkbox-warning checkbox-lg mb-2 mr-1"
                type="checkbox"
                checked={enabledInputs[index]}
                onChange={handleCheckboxChange(index)}
              />
            </div>

            <label className="form-control w-full max-w-xs">
              <div className="label bg-[#006fee] rounded-xl">
                <span className="uppercase label-text text-gray-100">
                  Carga el reverso y anverso del diplomado
                </span>
              </div>
              <input
                className="  file-input-bordered w-full max-w-xs rounded-lg"
                type="file"
                onChange={handleFileChange(index)}
                accept="image/*"
                disabled={!enabledInputs[index]}
              />
              {files[index] !== null && files[index] !== undefined && (
                <img
                  src={URL.createObjectURL(files[index] as Blob)}
                  alt={`Preview ${index}`}
                  className="w-max "
                />
              )}
            </label>
          </div>
        ))}
      </div>
      <Link href="/graduates_main/graduate_ecomas/routess/page" passHref legacyBehavior>
        <button
          className={`btn text-white bg-gradient-to-b from-[#006fee] to-[#001d51] btn-lg mt-8  ${
            !isGuardarButtonEnabled ? "cursor-not-allowed opacity-90" : ""
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
