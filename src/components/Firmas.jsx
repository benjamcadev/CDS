import { useRef, useState } from 'react'

//LIBRERIA DE FIRMA
import SignatureCanvas from 'react-signature-canvas'

export default function Firmas({ datos, setDatos }) {

    //REFERENCIAS A LAS FIRMAS
    const sigCanvas = useRef({});
    const sigCanvas2 = useRef({});


    // FUNCIONES DE LAS FIRMAS
    const saveSign1 = () => {
        setDatos({...datos, firmaSolicitante: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")})
        console.log(sigCanvas.current.isEmpty()) 
    }

    const clearSign1 = (e) => {
        e.preventDefault()
        sigCanvas.current.clear();
    }

    const saveSign2 = () => {
        setDatos({...datos, firmaBodega: sigCanvas2.current.getTrimmedCanvas().toDataURL("image/png")})

    }

    const clearSign2 = (e) => {
        e.preventDefault()
        sigCanvas2.current.clear();
    }

    return (

        <div className="grid sm:grid-cols-1 md:grid-cols-2">
            <div className="mb-5">
                <p className="block text-gray-700 uppercase font-bold">
                    FIRMA QUIEN RETIRA
                </p>
                <p className='block text-gray-700 uppercase '>
                    {datos.responsableRetira}
                </p>


                <SignatureCanvas
                    penColor='blue'
                    ref={sigCanvas}
                    onEnd={() => saveSign1()}
                    canvasProps={{ className: 'sigCanvas border-4 border-gray-950', width: 300, height: 200, }}
                />


                {/* <button
                    className="bg-blue-500 p-3 text-xs h-10 mt-4 text-white uppercase font-bold hover:bg-blue-700 cursor-pointer transition-all rounded"
                    onClick={saveSign1}
                >
                    Guardar
                </button> */}

                <button
                    className="bg-blue-500 p-3 text-xs h-10 mt-4  text-white uppercase font-bold hover:bg-blue-700 cursor-pointer transition-all rounded"
                    onClick={clearSign1}
                >
                    Limpiar
                </button>
            </div>

            <div className="mb-5 ">
                <p className="block text-gray-700 uppercase font-bold">
                    FIRMA RESPONSABLE BODEGA
                </p>

                <p className='block text-gray-700 uppercase '>
                    {datos.responsableEntrega}
                </p>

                <SignatureCanvas
                    penColor='blue'
                    ref={sigCanvas2}
                    onEnd={() => saveSign2()}
                    canvasProps={{ className: 'sigCanvas border-4 border-gray-950', width: 300, height: 200, }}
                />

                {/* <button
                    className="bg-blue-500 p-3 text-xs h-10 mt-4 text-white uppercase font-bold hover:bg-blue-700 cursor-pointer transition-all rounded"
                    onClick={saveSign2}
                >
                    Guardar
                </button> */}

                <button
                    className="bg-blue-500 p-3 text-xs h-10 mt-4  text-white uppercase font-bold hover:bg-blue-700 cursor-pointer transition-all rounded"
                    onClick={clearSign2}
                >
                    Limpiar
                </button>

            </div>

        </div>






    )
}
