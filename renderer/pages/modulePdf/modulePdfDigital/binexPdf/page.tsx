"use client";
import React, { useEffect, useState } from 'react';
import { openDatabase } from '../../../../components/modulos/moduleDigital/binex/database/index';
import jsPDF from 'jspdf';
import Modal from '../../../../components/modulos/share/Modal';
import { PiCertificateBold } from "react-icons/pi";
import { FiChevronsLeft } from 'react-icons/fi';
import { MdAttachEmail, MdPictureAsPdf } from "react-icons/md";
import { RiDeleteBin5Line } from 'react-icons/ri';
import { PacmanLoader, PulseLoader } from 'react-spinners';
import convertImageToPDF from '../../../../components/modulos/utils/pfdUtils';
import { render } from '@react-email/render';
import BinexTemplate from '../../../../components/modulos/templates/TemplateBinex';
import nodemailer from 'nodemailer';

const ImageExport = () => {
  const [imageGroups, setImageGroups] = useState<{ name: string, images: File[] }[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<{ name: string, images: File[] } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [conversionInProgress, setConversionInProgress] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState('Guardar');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sendButtonState, setSendButtonState] = useState<{ [groupName: string]: "initial" | "sending" | "sent" }>({});
  const [allEmailsSent, setAllEmailsSent] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [emailData, setEmailData] = useState<string | null>(null);
  const [actividadAcademicaData, setActividadAcademicaData] = useState<string | null>(null);
  const [dataString, setDataString] = useState<any[]>([]);
  const [editableEmail, setEditableEmail] = useState<{ [groupName: string]: { email: string, isEditing: boolean } }>({});
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);

  useEffect(() => {
    const getImagesFromDB = async () => {
      try {
        const db = await openDatabase();
        const transaction = db.transaction(['ImagesBinex'], 'readonly');
        const objectStore = transaction.objectStore('ImagesBinex');
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
      const transaction = db.transaction(['ImagesBinex'], 'readwrite');
      const objectStore = transaction.objectStore('ImagesBinex');
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

  useEffect(() => {
    const getEmailData = sessionStorage.getItem('emailData');
    setEmailData(getEmailData);
    const getActividadAcademicaData = sessionStorage.getItem('actividadAcademicaData');
    setActividadAcademicaData(getActividadAcademicaData);
    if (getActividadAcademicaData) {
      setDataString(JSON.parse(getActividadAcademicaData));
    }
  }, []);

  const getEmailForGroup = (groupName: string) => {
    if (emailData) {
      const emailDataArray = JSON.parse(emailData);
      const groupData = emailDataArray.find((group: { nombre: string }) => group.nombre === groupName);
      if (groupData) {
        console.log(`Correo asignado para ${groupName}: ${groupData.email}`);
        return groupData.email
      } else {
        console.log(`No se encontraron datos para el grupo ${groupName}`);
      }
    } else {
      console.log("No hay datos guardados en sessionStorage");
    }
  };
imageGroups.forEach(group => getEmailForGroup(group.name));

const convertToPDFAndEmail = async (group: { name: string, images: File[] }) => {
  try {
    setSendButtonState((prevState) => ({
      ...prevState,
      [group.name]: 'sending'
    }));
    const pdfs: string[] = [];
    for (const image of group.images) {
      const pdf = new jsPDF({
        orientation: 'landscape'
      });
      const reader = new FileReader();
      const promise = new Promise((resolve) => {
        reader.onload = () => {
          const imgData = reader.result as string;
          pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
          resolve(undefined);
        };
      });
      reader.readAsDataURL(image);
      await promise;
      const pdfBase64 = pdf.output('datauristring').split(',')[1];
      pdfs.push(pdfBase64);
    }
    const emailContent = render(<BinexTemplate groupName={group.name} dataString={dataString}/>)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'binexeducacion@gmail.com',
        pass: 'vkomtvrdkpkxhvci',
      }
    });
    const mailOptions = {
      from: 'binexeducacion@gmail.com',
      to: getEmailForGroup(group.name),
      subject: 'CERTIFICADOS MODULARES',
      html: emailContent,
      attachments: pdfs.map((pdfBase64, index) => ({
        filename: `${group.name}_${index}.pdf`,
        content: pdfBase64,
        encoding: 'base64',
      })),
    }
    await transporter.sendMail(mailOptions)
    setSendButtonState(prevState => ({
      ...prevState,
      [group.name]: 'sent'
    }));
  } catch (error) {
    console.error('Error al enviar el PDF por correo:', error);
    alert('Error al enviar el PDF por correo');
    setSendButtonState(prevState => ({
      ...prevState,
      [group.name]: 'initial'
    }));
  }
};

const sendEmailToAllGroups = async () => {
  try {
    for (const group of imageGroups) {
      await convertToPDFAndEmail(group);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setAllEmailsSent(true);
  } catch (error) {
    console.error('Error al enviar correos electrónicos:', error);
    alert('Error al enviar correos electrónicos');
  }
};

  const handleEditEmailChange = (groupName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableEmail((prevEditableEmail) => ({
      ...prevEditableEmail,
      [groupName]: {
        email: e.target.value,
        isEditing: true
      }
    }));
  };

  const handleCancelEditEmail = (groupName: string) => {
    setEditableEmail((prevEditableEmail) => {
      const updatedEditableEmail = { ...prevEditableEmail };
      delete updatedEditableEmail[groupName];
      return updatedEditableEmail;
    });
    setIsEditingEmail(false);
  };

  const handleEditEmailSave = (groupName: string) => {
    setIsEditingEmail(false);
    const editedEmail = editableEmail[groupName]?.email;
    if (editedEmail) {
      setEmailData((prevEmailData) => {
        const emailDataArray = prevEmailData ? JSON.parse(prevEmailData) : [];
        const updatedEmailDataArray = emailDataArray.map((group: { nombre: string, email: string }) => {
          if (group.nombre === groupName) {
            return {
              ...group,
              email: editedEmail
            };
          }
          return group;
        });
        sessionStorage.setItem('emailData', JSON.stringify(updatedEmailDataArray));
        return JSON.stringify(updatedEmailDataArray);
      });
      setEditableEmail((prevEditableEmail) => ({
        ...prevEditableEmail,
        [groupName]: {
          email: editedEmail,
          isEditing: false
        }
      }));
    }
  };

  return (
    <div className="bg-[#2878B7]/30 min-h-screen pb-1">
      <div className='ml-10'>
        <img
          src="/binex.png"
          alt='binex'
          width={250}
          height={200}
          className='pt-5'/>
      </div>
      <div className='flex justify-center items-center mt-5 gap-6 p-12 bg-[#2878B7]'>
        <h1 className='text-6xl font-extrabold text-gray-200'>Lista de módulos generados</h1>
        <PiCertificateBold className='text-7xl text-gray-200'/>
      </div>

      <div className='mx-auto justify-center p-5 font-mono text-2xl ml-60 mr-60 mt-5'>
  <div className='flex justify-between'>
    <div className="flex gap-5">
      <button onClick={() => window.history.back()} className="inline-flex items-center px-8 bg-[#2878B7] text-white rounded-xl hover:scale-110 duration-300">
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
    </div>
    {/* Contenedor para los botones a la derecha */}
    <div className="flex gap-5">
      <div className='text-white items-center px-8 bg-green-600 rounded-xl hover:scale-110 duration-300'>
        <button
          onClick={sendEmailToAllGroups}
          disabled={allEmailsSent} // Deshabilitar el botón si todos los correos electrónicos ya se han enviado
          className={`uppercase inline-flex items-center pt-4 ${allEmailsSent ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <MdAttachEmail className='mr-2 text-4xl' />
          {allEmailsSent ? 'Módulos Enviados' : 'Enviar'}
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
              <h3 className='flex justify-between w-[550px] border-4 border-[#2878B7] text-gray-200 p-4 mt-5 items-center rounded-xl font-bold'>{group.name}
                <span className="text-sm text-gray-400 ml-1">
                  ({group.images.length} módul{group.images.length !== 0 ? 'os' : ''})
                </span>
              </h3>
              <button onClick={() => openModal(group)} className='w-40 p-4 mt-5 bg-[#2878B7] text-gray-200 rounded-xl font-mono hover:scale-110 duration-300'>Ver módulos</button>

              {editableEmail[group.name] ? (
                <div className='w-[450px] border-4 border-green-600 text-gray-200 rounded-xl mt-5 p-4 flex items-center'>
                  <input
                    type="text"
                    className="bg-transparent text-white w-full focus:outline-none"
                    value={editableEmail[group.name].email || ''}
                    onChange={(e) => handleEditEmailChange(group.name, e)}
                  />
                  <div className="flex gap-2 ml-2">
                    <button onClick={() => handleEditEmailSave(group.name)} className="text-sm text-green-500">
                      {editableEmail[group.name].isEditing ? 'Guardar' : 'Editado'}
                    </button>
                    <button onClick={() => handleCancelEditEmail(group.name)} className="text-sm text-red-400 rounded-sm">Cancel</button>
                  </div>
                </div>
                ) : (
                  <div className='flex justify-between w-[450px] border-4 border-green-600 text-gray-200 rounded-xl mt-5 p-4 font-semibold'>
                    <span>{getEmailForGroup(group.name)}</span>
                        <button onClick={() => setEditableEmail((prevEditableEmail) => ({
                          ...prevEditableEmail,
                          [group.name]: {
                            email: getEmailForGroup(group.name),
                            isEditing: true
                          }
                        }))} className='text-sm text-gray-300'>
                          Editar
                        </button>
                  </div>
                )
              }

              <button
                onClick={() => convertToPDFAndEmail(group)}
                disabled={sendButtonState[group.name] === 'sending' || sendButtonState[group.name] === 'sent'}
                className={`relative bg-${sendButtonState[group.name] === 'sent' ? 'red' : 'green'}-600 text-gray-200 p-4 mt-5 rounded-xl hover:scale-110 duration-300 font-mono`}>
                {sendButtonState[group.name] === 'sending' ? (
                  <div className='flex items-center'>
                    <span className="mr-2">Enviando</span>
                    <PulseLoader color="#fff" size={6} />
                  </div>
                ) : (sendButtonState[group.name] === 'sent' ? 'Enviado' : 'Enviar')}
              </button>

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
                    className={`text-gray-200 mr-3 border-2 border-[#2878B7] hover:bg-[#2878B7] px-3 py-1 rounded-xl uppercase font-extrabold text-xl hover:scale-125 duration-300${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    &#60;
                  </button>
                  <div className="pagination flex font-extrabold">
                    {currentGroup.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`page-btn ${index === currentImageIndex ? 'bg-gray-300 text-[#2878B7] rounded-xl' : 'bg-[#2878B7] text-gray-200 hover:scale-125 duration-300 hover:bg-slate-200 hover:text-[#2878B7]'} px-4 py-2 rounded-xl`}>
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNextImage}
                    className={`text-gray-200 ml-3 border-2 border-[#2878B7] hover:bg-[#2878B7] px-3 py-1 rounded-xl uppercase font-extrabold text-xl hover:scale-125 duration-300${currentImageIndex === currentGroup.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
      <PacmanLoader color="#2878B7" size={80} className='w-60 text-gray-400'/>
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