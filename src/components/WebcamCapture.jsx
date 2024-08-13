import { Button } from '@mui/material';
import React, { useState, useEffect, useCallback, useRef } from "react";
import Webcam from 'react-webcam';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const WebcamCapture = ({ setImage }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [devices, setDevices] = useState([]);
  
  const webcamRef = useRef(null);
  
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc); // Aquí enviamos la imagen capturada al componente padre
  }, [webcamRef, setImage]);

  const handleDevices = useCallback(
    (mediaDevices) => {
      const videoDevices = mediaDevices.filter(({ kind }) => kind === "videoinput");
      setDevices(videoDevices);
      console.log("Available video devices:", videoDevices); // Imprime en la consola los dispositivos de video
    },
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  useEffect(() => {
    if (devices.length > 0) {
      // Aquí selecciona el primer dispositivo, puedes cambiarlo después de ver los nombres
      setDeviceId(devices[0].deviceId);
    }
  }, [devices]);

  return (
    //<div style={{ textAlign: 'center' }}>
    <>
    { deviceId ? (
      <Webcam
        audio={false}
        ref={webcamRef}
        videoConstraints={{ deviceId: deviceId }}
        screenshotFormat="image/jpeg"
        width="100%"
      />
    ) : (
      <p>No se encontró una cámara</p>
    )}
      <Button
        variant="contained"
        color="primary"
        onClick={capture}
        >
          <CameraAltIcon />
      </Button>
    </>
    //</div>
  );
};

export default WebcamCapture;
