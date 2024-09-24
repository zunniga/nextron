"use client";
import React, { useEffect, useState } from 'react';
import { openDatabase } from '../../../../components/modulos/modulePhysical/promas/database/index';
import Modal from '../../../../components/modulos/share/Modal';
import { PiCertificateBold } from "react-icons/pi";
import { FiChevronsLeft } from 'react-icons/fi';
import { MdPictureAsPdf } from "react-icons/md";
import { RiDeleteBin5Line } from 'react-icons/ri';
import { PacmanLoader } from 'react-spinners';
import convertImageToPDF from '../../../../components/modulos/utils/pdfPhysical';

const ImageExport = () => {
  const [imageGroups, setImageGroups] = useState<{ name: string, images: File[] }[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<{ name: string, images: File[] } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [conversionInProgress, setConversionInProgress] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState('Guardar');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const getImagesFromDB = async () => {
      try {
        const db = await openDatabase();
        const transaction = db.transaction(['ImagesPhysical'], 'readonly');
        const objectStore = transaction.objectStore('ImagesPhysical');
        const storedImages: File[] = [];
        const cursorRequest = objectStore.openCursor();
        cursorRequest.onsuccess = function(event) {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            storedImages.push(cursor.value);
            cursor.continue();
          } else {
            const groupedImages = storedImages.reduce((groups: { [name: string]: File[] }, image: File) => {
              const nameParts = image.name.split('_');
              const name = nameParts[0];
              if (!groups[name]) {
                groups[name] = [];
              }
              groups[name].push(image);
              return groups;
            }, {});
            const imageGroupsArray = Object.keys(groupedImages).map(name => ({
              name,
              images: groupedImages[name]
            }));
            setImageGroups(imageGroupsArray);
          }
        };
      } catch (error) {
        console.error('Error al abrir la base de datos:', error);
      }
    };
    getImagesFromDB();
  }, []);

  const convertGroupToPDF = async (group: { name: string, images: File[] }) => {
    setConversionInProgress(true);
    for (let i = 0; i < group.images.length; i++) {
      await convertImageToPDF(group.images[i], group.name, i);
    }
    if (!saveSuccess) {
      setSaveSuccess(true);
      alert(`Guardado con éxito '${group.name}'`);
    }
  };

  const convertAllToPDF = async () => {
    setConversionInProgress(true);
    for (const group of imageGroups) {
      await convertGroupToPDF(group);
    }
    setConversionInProgress(false);
    setSaveButtonText('Guardado');
    if (!saveSuccess) {
      setSaveSuccess(true);
      alert(`Guardado con éxito`);
    }
  };

  const openModal = (group: { name: string, images: File[] }) => {
    setCurrentGroup(group);
    setCurrentImageIndex(0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentGroup(null);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentGroup!.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + currentGroup!.images.length) % currentGroup!.images.length);
  };

  const deleteImagesFromDB = async () => {
    try {
      setShowSpinner(true);
      const db = await openDatabase();
      const transaction = db.transaction(['ImagesPhysical'], 'readwrite');
      const objectStore = transaction.objectStore('ImagesPhysical');
      const clearRequest = objectStore.clear();
      clearRequest.onsuccess = () => {
        setImageGroups([]);
        setShowSpinner(true);
        console.log('Imágenes eliminadas correctamente.');
      };
    } catch (error) {
      console.error('Error al eliminar las imágenes:', error);
      setShowSpinner(false);
    }
  };

  return (
    <div className="bg-[#001D51] min-h-screen pb-1">
      <div className='ml-10'>
        <img
          src="/promas.png"
          alt='promas'
          width={250}
          height={200}
          className='pt-5'/>
      </div>
      <div className='flex justify-center items-center mt-5 gap-6 p-12 bg-[#B20076]'>
        <h1 className='text-6xl font-extrabold text-gray-200'>Lista de módulos generados</h1>
        <PiCertificateBold className='text-7xl text-gray-200'/>
      </div>
      <div className='mx-auto justify-center p-5 font-mono text-2xl ml-60 mr-60 mt-5'>
        <div className='flex justify-center'>
          <div className="flex gap-5">
            <button onClick={() => window.history.back()} className="inline-flex items-center px-8 bg-[#CF0072] text-white rounded-xl hover:scale-110 duration-300">
              <FiChevronsLeft className='mr-2 text-5xl' />
              <h1 className='uppercase' >Atrás</h1>
            </button>
            <div className=" px-6 bg-red-500 items-center text-white rounded-xl hover:scale-110 duration-300">
              <button
                onClick={() => convertAllToPDF()}
                disabled={conversionInProgress || saveButtonText === 'Guardado'}
                className='uppercase inline-flex items-center pt-3'>
                {conversionInProgress ? 'Guardando...' : saveButtonText}
                <MdPictureAsPdf className="ml-2 text-4xl" />
              </button>
            </div>
            <button onClick={deleteImagesFromDB} className='inline-flex items-center text-white p-4 bg-red-600 rounded-xl hover:scale-110 duration-300'>
              <h1 className='uppercase'>Limpiar</h1>
              <RiDeleteBin5Line className='ml-2 text-4xl' />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto mt- mb-20 items-center">
        <div className=''>
        {imageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className='flex justify-center'>
            <div className='gap-10 inline-flex items-center text-xl'>
              <h3 className='flex justify-between w-[1000px] border-4 border-[#FD4660] text-gray-200 p-4 mt-5 items-center rounded-xl font-bold'>{group.name}
                <span className="text-sm text-gray-400 ml-1">
                  ({group.images.length} módul{group.images.length !== 0 ? 'os' : ''})
                </span>
              </h3>
              <button onClick={() => openModal(group)} className='w-40 p-4 mt-5 bg-[#B20076] text-gray-200 rounded-xl font-mono hover:scale-110 duration-300'>Ver módulos</button>

            </div>
            <div className="image-grid mb-8">
              {group.images.map((image, index) => (
                <div key={index} className="image-item">
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>
          {currentGroup && (
            <Modal onClose={closeModal}>
              <div className='flex justify-center'>
                <div className="modal-buttons inline-flex mb-5">
                  <button
                    onClick={handlePrevImage}
                    className={`text-gray-200 mr-3 border-2 border-[#CF0072] hover:bg-[#CF0072] px-3 py-1 rounded-xl uppercase font-extrabold text-xl hover:scale-125 duration-300${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    &#60;
                  </button>
                  <div className="pagination flex font-extrabold">
                    {currentGroup.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`page-btn ${index === currentImageIndex ? 'bg-gray-300 text-[#CF0072] rounded-xl' : 'bg-[#CF0072] text-gray-200 hover:scale-125 duration-300 hover:bg-slate-200 hover:text-[#CF0072]'} px-4 py-2 rounded-xl`}>
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNextImage}
                    className={`text-gray-200 ml-3 border-2 border-[#CF0072] hover:bg-[#CF0072] px-3 py-1 rounded-xl uppercase font-extrabold text-xl hover:scale-125 duration-300${currentImageIndex === currentGroup.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    &#62;
                  </button>
                </div>
              </div>
              <img
                src={URL.createObjectURL(currentGroup.images[currentImageIndex])}
                alt={`Image ${currentImageIndex}`}
                style={{ width: '297mm', height: '210mm' }}/>
            </Modal>
          )}
          {showSpinner && (
            <div className="flex justify-center items-center mt-32">
              <button onClick={() => window.history.back()} className="text-center">
                <PacmanLoader color="#CF0072" size={80} className='w-60 text-gray-400'/>
                <h1 className='underline mt-5 text-gray-400 font-mono text-2xl'>
                  Volver a generar modulares
                </h1>
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default ImageExport;