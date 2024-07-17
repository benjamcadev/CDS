import Button from '@mui/material/Button';

const ButtonMui = ({ name, handleOpen }) => {
  return (
    <Button 
      className="!bg-gray-800 !font-bold" // Tailwind CSS classes
      sx={{ color: 'white' , height: '60px' }} // MUI sx prop
      onClick={handleOpen}
    >
      {name}
    </Button>
  );
}

export default ButtonMui;