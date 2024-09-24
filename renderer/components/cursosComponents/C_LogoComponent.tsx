import React, { useEffect, useState } from "react";

const logoUrls: { [key: string]: string } = {
  ecomas: "/logosCursos/ecomas_logo.png",
  promas: "/logosCursos/promas_logo.png",
  binex: "/logosCursos/binex_logo.png",
  cimade: "/logosCursos/cimade_logo.png",
  rizo: "/logosCursos/rizo_logo.png",
  sayan: "/logosCursos/sayan_logo.png",
};

const LogoComponent = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  useEffect(() => {
    const storedCompany: string | null = localStorage.getItem(
      "selectedCompanyCursos"
    );
    if (storedCompany) {
      setSelectedCompany(storedCompany);
    }
  }, []);

  return (
    <div className="mt-2 ml-2" >
      {selectedCompany && (
        <img
          src={logoUrls[selectedCompany]}
          alt={`${selectedCompany} Logo`}
          style={{ width: "200px", height: "auto" }}
        />
      )}
    </div>
  );
};

export default LogoComponent;
