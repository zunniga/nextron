'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirige a la página especificada cuando el componente se monta
    router.push('/certificados_cursos/cert_digital/page');
  }, [router]);

  return (
    <main className="w-full h-[100vh] flex justify-center items-center">
      <p>:)</p>
    </main>
  );
}
