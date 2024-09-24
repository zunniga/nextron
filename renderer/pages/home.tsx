import Head from 'next/head';
import Link from 'next/link';
import React, { ReactNode } from "react";

interface DrawOutlineButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}


function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Sistema de emisión de certificados</title>
      </Head>
      <section className="relative flex flex-col items-center justify-center h-screen">
      {/* Video de fondo */}
      <img
        src="/imagesCursos/bg_cert.jpg"
        alt="imgBg"
        className="absolute w-full h-full object-cover blur-sm"
      />
      <h4 className='absolute bottom-2 right-2'>v. 1.0.2</h4>
      {/* Gradiente encima de la img */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-transparent to-blue-600 opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black opacity-50"></div>
      <div className="absolute w-[50%] inset-0 gradient-01" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <h1
              className="text-5xl md:text-7xl font-extrabold leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out"
            >
              Bienvenido al sistema de emisión de{" "}
              <span className="text-transparent bg-clip-text  gradient-text">
                Certificados
              </span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="p-4 text-2xl mb-8">
                Genera certificados de manera rápida y sencilla. Selecciona el
                tipo de certificado que necesitas a continuación.
              </p>
              <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
                <div className="mr-8">
                  <Link href="/route_main/page" legacyBehavior>
                    <DrawOutlineButton>Diplomados</DrawOutlineButton>
                  </Link>
                </div>
                <div className="mr-8">
                  <Link href="/certificados_cursos/page" legacyBehavior>
                    <DrawOutlineButton>Cursos</DrawOutlineButton>
                  </Link>
                </div>
                <div>
                  <Link href="/routeModules/page" legacyBehavior>
                    <DrawOutlineButton>Modulares</DrawOutlineButton>
                  </Link>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </React.Fragment>
  );
}
const DrawOutlineButton: React.FC<DrawOutlineButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className=" bg-gradient-to-r from-blue-500 to-red-500 text-white px-6 py-4 text-2xl rounded font-medium focus:ring ring-black ring-opacity-10 buttonAnimated element-to-rotate group relative   transition-all duration-300 hover:scale-125"
    >
      <span>{children}</span>

      {/* TOP */}
      <span className="absolute left-0 top-0 h-[2px] w-0 bg-white transition-all duration-100 group-hover:w-full" />

      {/* RIGHT */}
      <span className="absolute right-0 top-0 h-0 w-[2px] bg-white transition-all delay-100 duration-100 group-hover:h-full" />

      {/* BOTTOM */}
      <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-white transition-all delay-200 duration-100 group-hover:w-full" />

      {/* LEFT */}
      <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-white transition-all delay-300 duration-100 group-hover:h-full" />
    </button>
  );
};


export default Home;
