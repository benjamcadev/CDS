{/* import React from 'react'

export default function Meteors({ number }) {
    return [...new Array(number || 20).fill(true)].map((el, idx) => (
        <span
          key={idx}
          className="meteor animate-meteor-effect absolute  h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]"
          style={{
            // top: Math.floor(Math.random() * (0 - -400) + -400) + 'px',
            top: 0,
            left: Math.floor(Math.random() * (400 - -400) + -400) + 'px',
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + 's',
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + 's',
          }}
        ></span>
      ))
}
*/}

import  { useEffect, useState } from 'react';

export default function Meteors({ number }) {
  // dimensiones de la ventana del navegador para que los meteoros se muevan en toda la pantalla
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  // actualiza las dimensiones de la ventana del navegador
  useEffect(() => {
    // actualiza las dimensiones de la ventana del navegador
    const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    // escucha el evento resize de la ventana del navegador
    window.addEventListener('resize', handleResize);
    // devuelve una función que elimina el evento resize de la ventana del navegador
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // retorna los meteoros
  return (
  <div className="meteors-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: -1 }}>
    {[...new Array(number || 20).fill(true)].map((el, idx) => (
      <span
        key={idx}
        className="meteor animate-meteor-effect absolute h-0.5 w-0.5 rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]"
        style={{
          // se calcula la posición de cada meteoro de forma aleatoria
            top: Math.floor(Math.random() * dimensions.height) + 'px',
            // se calcula la posición de cada meteoro de forma aleatoria
            left: Math.floor(Math.random() * dimensions.width) + 'px',
            // se calcula el retraso de la animación de cada meteoro de forma aleatoria
            animationDelay: `${Math.random() * (0.8 - 0.2) + 0.2}s`,
            // se calcula la duración de la animación de cada meteoro de forma aleatoria
            animationDuration: `${Math.floor(Math.random() * (10 - 2) + 2)}s`,
        }}
      ></span>
    ))}
  </div>
  );
}