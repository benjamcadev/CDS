import { useRef } from 'react';

//LIBRERIA DE FIRMA
import SignatureCanvas from 'react-signature-canvas';

//COMPONENTE MUI 
import DeleteIcon from '@mui/icons-material/Delete';


export const FirmasEntrada = ({ idTicket, datos, setDatos, responsables, awaitSignature, oldSignature, setOldSignature }) => {

    //REFERENCIAS A LAS FIRMAS
    const sigCanvas = useRef({});
    const sigCanvas2 = useRef({});
   
    console.log(datos);

    // FUNCIONES DE LAS FIRMAS
    const saveSign1 = () => {
        setDatos({ ...datos, firmaSolicitante: sigCanvas.current.getTrimmedCanvas().toDataURL("image/png") });
        setOldSignature({...oldSignature, signatureRetira: false});
    }

    const clearSign1 = (e) => {
        e.preventDefault();
        sigCanvas.current.clear();
        setDatos({ ...datos, firmaSolicitante: '', fechaCierre: '' });
    }

    const saveSign2 = () => {
        setDatos({ ...datos, firmaBodega: sigCanvas2.current.getTrimmedCanvas().toDataURL("image/png") });
        setOldSignature({...oldSignature, signatureBodega: false});
    }

    const clearSign2 = (e) => {
        e.preventDefault();
        sigCanvas2.current.clear();
        setDatos({ ...datos, firmaBodega: '' });
    }

    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-2">
            {datos.tipoTicket !== 'Compra' && (
                <div className="mb-5">
                    <p className="block text-gray-700 uppercase font-bold">
                        FIRMA QUIEN REINTEGRA MATERIAL
                    </p>
                    <p className='block text-gray-700 uppercase '>
                        {datos.responsableRetira}
                    </p>

                    {/* SI EXISTE UNA FIRMA VA RENDERIZAR UN IMG O CANVAS, EN CASO QUE NO EXISTA FIRMA RENDERIZA COMPONENTE PARA FIRMAR */}
                    {datos.firmaSolicitante !== '' && idTicket ?
                        <img className=' border-4 border-gray-950' width={300} height={200} src={datos.firmaSolicitante} />
                        :
                        <>
                            <SignatureCanvas
                                penColor='blue'
                                ref={sigCanvas}
                                onEnd={() => saveSign1()}
                                canvasProps={{ className: 'sigCanvas border-4 border-gray-950', width: 300, height: 200 }}
                            />
                            <button
                                className="bg-blue-500 p-2 text-xs h-10 mt-4  text-white uppercase font-bold hover:bg-blue-700 cursor-pointer transition-all rounded"
                                onClick={clearSign1}
                            >
                                <DeleteIcon />
                            </button>
                        </>
                    }
                </div>
            )}
            
            <div className="mb-5">
                <p className="block text-gray-700 uppercase font-bold">
                    FIRMA RESPONSABLE BODEGA
                </p>

                <p className='block text-gray-700 uppercase '>
                    {responsables.map(function (responsable) {
                        if (responsable.id === datos.responsableEntrega) {
                            return responsable.label;
                        }
                        return null;
                    })}
                </p>

                {datos.firmaBodega !== '' && idTicket ?
                    <img className=' border-4 border-gray-950' width={300} height={200} src={datos.firmaBodega} />
                    :
                    <>
                        <SignatureCanvas
                            penColor='blue'
                            ref={sigCanvas2}
                            onEnd={() => saveSign2()}
                            canvasProps={{ className: 'sigCanvas border-4 border-gray-950', width: 300, height: 200 }}
                        />
                        <button
                            className="bg-blue-500 p-2 text-xs h-10 mt-4  text-white uppercase font-bold hover:bg-blue-700 cursor-pointer transition-all rounded"
                            onClick={clearSign2}
                        >
                            <DeleteIcon />
                        </button>
                    </>
                }
            </div>
        </div>
    );
};