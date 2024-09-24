import Link from 'next/link'
import React from 'react'
import { FaFastBackward } from "react-icons/fa";

const RoutesDigital = () => {
  return (
    <main className="bg-[#001D51] min-h-screen pt-20">
      <div className='flex justify-center gap-10 pt-10 mb-10'>
        <img src="/ecomas.png" alt='ecomas' width={150} height={100}className='pt-5'/>
        <img src="/cimade.png" alt='ecomas' width={150} height={100}className='pt-5'/>
        <img src="/binex.png" alt='ecomas' width={150} height={100}className='pt-5'/>
        <img src="/promas.png" alt='ecomas' width={150} height={100}className='pt-5'/>
        <img src="/sayan.png" alt='ecomas' width={150} height={100}className='pt-5'/>
        <img src="/rizo.png" alt='ecomas' width={150} height={100}className='pt-5'/>
      </div>
      <div className='flex justify-center items-center mt-5 gap-6 p-12 bg-[#0060ff]/50'>
        <h1 className='text-5xl font-extrabold text-gray-300'>
          Generación de<span className='text-6xl bg-gradient-to-r text-transparent bg-clip-text from-fuchsia-600 via-violet-600 to-pink-500 animate-gradient'> Modulares Digitales</span>
          <p className='text-2xl text-center'>Selecciona la empresa correspondiente</p>
        </h1>
      </div>
      <div className='flex justify-center items-center mt-28'>
      <div className="grid grid-cols-2 gap-96">
        <div className='uppercase font-extrabold text-3xl text-gray-300'>
          <Link href="/moduleExcel/moduleExcelDigital/ecomasExcel/page" className="text-center">
            <div className="bg-gray-300 py-5 px-20 rounded-md text-center mb-20 hover:scale-110 duration-300 text-gray-300 cursor-pointer bg-gradient-to-r from-[#0740ED] via-violet-800 to-pink-800 animate-gradient">
              Ecomás
            </div>
          </Link>
          <Link href="/moduleExcel/moduleExcelDigital/cimadeExcel/page" className="text-center">
            <div className="bg-gray-300 py-5 px-20 rounded-md text-center mb-20 hover:scale-110 duration-300 text-gray-300 cursor-pointer bg-gradient-to-r from-[#0740ED] via-violet-800 to-pink-800 animate-gradient">
              Cimade
            </div>
          </Link>
          <Link href="/moduleExcel/moduleExcelDigital/binexExcel/page" className="text-center">
            <div className="bg-gray-300 py-5 px-20 rounded-md text-center hover:scale-110 duration-300 text-gray-300 cursor-pointer bg-gradient-to-r from-[#0740ED] via-violet-800 to-pink-800 animate-gradient">
                Binex
            </div>
          </Link>
        </div>

        <div className='uppercase font-extrabold text-3xl text-gray-100'>
          <Link href="/moduleExcel/moduleExcelDigital/promasExcel/page" className="">
            <div className="bg-gray-300 py-5 px-20 rounded-md text-center mb-20 hover:scale-110 duration-300 text-gray-300 cursor-pointer bg-gradient-to-r from-[#0740ED] via-violet-800 to-pink-800 animate-gradient">
              Promás
            </div>
          </Link>
          <Link href="/moduleExcel/moduleExcelDigital/sayanExcel/page" className="">
            <div className="bg-gray-300 py-5 px-20 rounded-md text-center mb-20 hover:scale-110 duration-300 text-gray-300 cursor-pointer bg-gradient-to-r from-[#0740ED] via-violet-800 to-pink-800 animate-gradient">
              Sayan
            </div>
          </Link>
          <Link href="/moduleExcel/moduleExcelDigital/rizoExcel/page" className="">
            <div className="bg-gray-300 py-5 px-20 rounded-md text-center hover:scale-110 duration-300 text-gray-300 cursor-pointer bg-gradient-to-r from-[#0740ED] via-violet-800 to-pink-800 animate-gradient">
              Rizo
            </div>
          </Link>
        </div>
      </div>
      </div>
      <div className="flex justify-center p-10 font-mono">
        <button onClick={() => window.history.back()} className="flex items-center px-10 py-3 text-white border-2 rounded-xl hover:scale-110 duration-300">
          <FaFastBackward className='mr-2 text-3xl'/>
        </button>
      </div>
    </main>
  )
}

export default RoutesDigital;
