import React from "react"
import Link from "next/link"
import { BiLogOut } from "react-icons/bi"


const Page = () => {
  return (
    <div
      className=" flex flex-col items-center justify-center h-screen bg-cover bg-gradient-to-b from-[#000] via-[#000] to-[#0b0466] "
      /* style={{ backgroundImage: "url('/Images/logos/background.jpg')" }}  */
    >
      <div className="">
      <Link href="/home">
        <BiLogOut
          color="#ffff"
          className="w-12 h-12 absolute top-0 left-0 m-4 cursor-pointer text-gray-500"
          size={24}
        />
      </Link>
        <div className="flex items-center space-x-4">
          <div className="text-8xl font-sarpanch text-white font-extrabold -mt-20 mb-1">
            Emisión de Diplomados
          </div>
          <img
            src="/images/logos_main/graduate7.png"
            alt="icono"
            className="w-24 h-auto float-animation -mt-12"
          />
        </div>

        <div
          className="mt-12 grid lg:grid-cols-3 md:grid-cols-2 gap-4 lg:gap-14  p-10 rounded-xl overflow-auto"
          data-wow-duration="1s"
          data-wow-delay=".3s"
        >
          <div>
            <Link
              href={"/graduates_main/graduate_ecomas/routess/page"}
              className="mb-4"
            >
              <div className="text-4xl bg-transparent font-bold border text-center border-white rounded-lg p-8 hover:bg-gradient-to-l from-[#006fee] to-[#001d51] hover:text-slate-200 hover:animate-none cursor-pointer">
                Ecomás
              </div>
            </Link>
          </div>

          <div>
            <Link
              href={"/graduates_main/graduate_binex/routess/page"}
              className="mb-4"
            >
              <div className="text-4xl bg-transparent font-bold border text-center border-white rounded-lg p-8 hover:bg-gradient-to-l from-[#00dbb8] to-[#0079bb] hover:text-slate-200 hover:animate-none cursor-pointer">
                Binex
              </div>
            </Link>
          </div>
          <div>
            <Link
              href={"/graduates_main/graduate_cimade/routess/page"}
              className="mb-4"
            >
              <div className="text-4xl bg-transparent font-bold border text-center border-white rounded-lg p-8 hover:bg-gradient-to-l from-[#006eb0] to-[#ff00d4] hover:text-slate-200 hover:animate-none cursor-pointer">
                Cimade
              </div>
            </Link>
          </div>
          <div>
            <Link
              href={"/graduates_main/graduate_rizo/routess/page"}
              className="mb-4"
            >
              <div className="text-4xl bg-transparent font-bold border text-center border-white rounded-lg p-8 hover:bg-gradient-to-l from-[#6d0083] to-[#dabb0f] hover:text-slate-200 hover:animate-none cursor-pointer">
                Rizo
              </div>
            </Link>
          </div>
          <div>
            <Link
              href={"/graduates_main/graduate_promas/routess/page"}
              className="mb-4"
            >
              <div className="text-4xl bg-transparent font-bold border text-center border-white rounded-lg p-8 hover:bg-gradient-to-l from-[#680080] to-[#7c3aed] hover:text-slate-200 hover:animate-none cursor-pointer">
                Promás
              </div>
            </Link>
          </div>
          <div>
            <Link
              href={"/graduates_main/graduate_sayan/routess/page"}
              className="mb-4"
            >
              <div className="text-4xl bg-transparent font-bold border text-center border-white rounded-lg p-8 hover:bg-gradient-to-l from-[#0d617b] to-[#12a9be] hover:text-slate-200 hover:animate-none cursor-pointer">
                Sayán
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
