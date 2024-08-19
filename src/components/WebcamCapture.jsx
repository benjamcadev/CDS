import { Button } from '@mui/material';
import React, { useState, useEffect, useCallback, useRef } from "react";
import Webcam from 'react-webcam';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const WebcamCapture = ({ setImage }) => {

  const [deviceId, setDeviceId] = useState(null);
  const webcamRef = useRef(null);
  
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [setImage]);

  const handleDevices = useCallback(
    (mediaDevices) => {
      const videoDevices = mediaDevices.filter(({ kind }) => kind === "videoinput");
      
      // Buscar el dispositivo que tiene el label deseado
      const rearCamera = videoDevices.find(device => device.label.includes('Rear Integrated Webcam'));

      if (rearCamera) {
        setDeviceId(rearCamera.deviceId);
      } else if (videoDevices.length > 0) {
        // Si no encuentra la cámara trasera, usar el primer dispositivo
        setDeviceId(videoDevices[0].deviceId);
      }
    },
    []
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  return (
    //<div style={{ textAlign: 'center' }}>
    <>
    { deviceId ? (
      <Webcam
        audio={false}
        ref={webcamRef}
        videoConstraints={{ 
          deviceId: deviceId,
          width: 1280,
          height: 720
        }}
        screenshotFormat="image/webp"
        forceScreenshotSourceSize = {true}
        screenshotQuality={1}
        
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
