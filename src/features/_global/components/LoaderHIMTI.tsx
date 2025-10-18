import React, { useEffect, useState } from 'react';
import LogoHIMTILoader from "@core/assets/loader/HIMTI.svg";

const LoaderHIMTI: React.FC = () => {
  const [svgUrl, setSvgUrl] = useState('');

  useEffect(() => {
    const randomString = new Date().getTime();
    setSvgUrl(`${LogoHIMTILoader}?nocache=${randomString}`);
  }, []);

  return (
    <div className='w-full flex justify-center items-center min-h-screen bg-white'>
      <div className='max-w-3xl px-8 w-full'>
        {svgUrl && <img className='w-full h-full' src={svgUrl} alt="Loading..." />}
      </div>
    </div>
  );
};

export default LoaderHIMTI;
