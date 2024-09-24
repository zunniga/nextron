"use client"
import React, { useState, ChangeEvent, useEffect } from 'react';
import ImageUploader from '../../../../components/modulos/moduleDigital/ecomas/ImageFrom';
import Link from 'next/link';
import { RiFileExcel2Line } from "react-icons/ri";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { PulseLoader } from "react-spinners";
import { ipcRenderer } from'electron';
import extractExcelData from '../../../../components/modulos/utils/excelUtils';
import { ExcelData } from '../../../../components/modulos/interface/interface';

const ExcelDataFrom = () => {
  const [numModules, setNumModules] = useState(1);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [excelFiles, setExcelFiles] = useState<File[]>(Array(numModules).fill(null));
  const [imagesAndExcel, setImagesAndExcel] = useState<{ image: File | null; imageId: number | null; excelData:ExcelData | null }[]>([]);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [excelLoaded, setExcelLoaded] = useState(false);
  const [nextButtonText, setNextButtonText] = useState("Siguiente");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleModuleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedNumModules = parseInt(event.target.value);
    setNumModules(selectedNumModules);
    setImageFiles(prevFiles => prevFiles.slice(0, selectedNumModules));
    setExcelFiles(prevFiles => prevFiles.slice(0, selectedNumModules));
    setExcelData(null);
  };

  const handleExcelFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const eventFiles = event.target.files;
    if (eventFiles && eventFiles.length > 0) {
      const newExcelFiles = Array.from(eventFiles).slice(0, numModules);
      setExcelFiles(newExcelFiles);
      const filePath = eventFiles[0].path;
      ipcRenderer.send('saveExcelFilePath', filePath);
      sessionStorage.setItem('excelFilePath', filePath);
      console.log('Folder pathhhhhhhhhhhhhhhhhhh:', filePath);
      const updatedImagesAndExcel = newExcelFiles.map((file, index) => {
        //console.log(`Excel file ${file.name} is related to imageId ${index}`);
        return {
        imageId: index,
        image: index < imageFiles.length ? imageFiles[index] : null,
        excelData: null,
        }
      });
      setImagesAndExcel(updatedImagesAndExcel);
      setExcelLoaded(true);
      setButtonDisabled(true); // Desactivar el botón cuando se cargan nuevos archivos excel
      setNextButtonText("Dibujando");
    }
  };

  useEffect(() => {
    const updateImagesAndExcel = async () => {
      const updatedImagesAndExcel = await Promise.all(excelFiles.map(async (file, index) => ({
        imageId: index < imageFiles.length ? index : null,
        image: index < imageFiles.length ? imageFiles[index] : null,
        excelData: await extractExcelData(file),
      })));
      setImagesAndExcel(updatedImagesAndExcel);
     // Habilitar el botón y cambiar el texto después de 20 segundos
     setTimeout(() => {
      setNextButtonText("Siguiente");
      setButtonDisabled(false);
    }, 15000);
  };
  if (excelFiles.length > 0) {
    updateImagesAndExcel();
  }
  }, [excelFiles, imageFiles]);

  const excelFilesCount = excelFiles.filter(file => file !== null).length;

  return (
    <section className='bg-[#001D51] min-h-screen pb-20'>
      <div className='flex ml-10'>
      <img
        src="/ecomas.png"
        alt='ecomas'
        width={250}
        height={200}
        className='mt-5'/>
      </div>
      <div className='flex justify-center items-center mt-5 gap-6 p-8 bg-[#0060ff]'>
        <h1 className='text-5xl font-extrabold text-white'>Número de módulos</h1>
        <div className='text-gray-500 items-center'>
          <div className='relative'>
            <select {...{ required: true }} name='country' className="bg-gray-100 border-2 border-gray-300 text-gray-500 text-4xl rounded-lg ps-5 p-1 font-bold" onChange={handleModuleChange}>
              {[...Array(15)].map((_, index) => (
                <option key={index} value={index + 1}>{String(index + 1).padStart(2, '0')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className='flex justify-between'>
      <div className="p-10 ml-40 font-mono text-3xl hover:scale-110 duration-300">
        <button onClick={() => window.history.back()} className="flex items-center bg-[#0060ff]/70 px-16 py-3 text-white rounded-xl uppercase">
        <FiChevronsLeft className='mr-2 text-5xl' /> {/* Icono a la izquierda */}
          Atrás
        </button>
      </div>
      <Link href="/modulePdf/modulePdfDigital/ecomasPdf/page" className={`flex p-10 font-mono ${!excelLoaded ? 'pointer-events-none' : ''}`}>
          <button className={`bg-[#0060ff]/70 px-10 py-3 text-white rounded-xl uppercase text-3xl mb-10 mt-10 mr-48 hover:scale-110 duration-300 ${!excelLoaded || buttonDisabled ? 'opacity-50' : ''}`} disabled={buttonDisabled}>
            <span className="flex items-center justify-center">
              {nextButtonText === "Siguiente" ? (
                <>
                  <span>{nextButtonText}</span>
                  <FiChevronsRight className="ml-2 text-5xl" /> {/* Icono FiChevronsRight a la derecha */}
                </>
              ) : (
                <>
                  <span>Dibujando</span>
                  <PulseLoader color="#ffff" size={10} className="ml-2 font-extrabold" /> {/* Icono ClockLoader a la derecha */}
                </>
              )}
            </span>
          </button>
        </Link>
      </div>
      <div className='max-w-[1500px] mx-auto grid grid-cols-2 p-4 border-4 border-[#007aff] rounded-2xl'>
        <div className=''>
          <div className='image-container relative'>
          </div>
          {imagesAndExcel.length > 0 && (
            <div>
              <ImageUploader
                numModules={numModules}
                excelData={imagesAndExcel.map(item => item.excelData).filter(excelData => excelData !== null) as ExcelData[]}
              />
            </div>
          )}
          </div>
        <div className=''>
          <div className='inline-flex justify-center items-center mb-10 p-4 font-bold text-2xl bg-green-600/80 w-full text-white rounded-e-xl'>
            <RiFileExcel2Line className='text-4xl mr-2'/>
            <h1>Cargar archivos excel ({numModules})</h1>
          </div>
          <div className='flex relative border-b-4 border-green-600 mb-10 text-white font-mono justify-center'>
          <input type="file" accept=".xlsx, .xlsm, .xls" onChange={handleExcelFileChange} multiple
            className='p-4 mb-10 rounded-xl bg-green-600/80 cursor-pointer hover:scale-110 duration-300' />
          </div>
          {excelFiles.map((file, index) => (
            <div key={index} className='mb-4'>
              {file && (
                <div className='inline-flex font-bold w-full rounded-lg border-2 border-green-600'>
                  <p className='py-3 w-full ml-2 text-gray-200'>{file.name}</p>
                </div>
              )}
            </div>
          ))}
          {/* <p>Archivos de excel mostrados: {excelFilesCount}</p> */}
        </div>


      </div>
    </section>
  );
};

export default ExcelDataFrom;