import { Button } from '@mui/material';
import React, { useState, useEffect, useCallback, useRef } from "react";
import Webcam from 'react-webcam';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const WebcamCapture = ({ setImage }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [devices, setDevices] = useState([]);

  const handleDevices = useCallback(
    mediaDevices =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );
  const webcamRef = useRef(null);
  
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc); // Aquí enviamos la imagen capturada al componente padre
  }, [webcamRef, setImage]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  useEffect(() => {
    // Filtrar para seleccionar la cámara trasera
    const backCamera = devices.find((device) =>
      device.label.toLowerCase().includes("back")
    );

    if (backCamera) {
      setDeviceId(backCamera.deviceId);
    } else if (devices.length > 0) {
      // Si no se encuentra una cámara con "back", selecciona el primer dispositivo
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
