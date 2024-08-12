import { Button } from '@mui/material';
import React, { useState, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const WebcamCapture = ({ setImage }) => {
  const webcamRef = useRef(null);
  
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc); // Aquí enviamos la imagen capturada al componente padre
  }, [webcamRef, setImage]);

  return (
    //<div style={{ textAlign: 'center' }}>
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="30%"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={capture}>
          <CameraAltIcon />
      </Button>
    </>
    //</div>
  );
};

export default WebcamCapture;
