import { Contrast } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';
import { light } from '@mui/material/styles/createPalette';

const defaultTheme = createTheme({
  palette: {
    primary: { 
      main: '#204051',
      contrastText: '#E7DFD5',
    },
   
    background: {
      paper: '#E7DFD5',
      default: '#84A9AC',
      
    }
  },
});

export default defaultTheme;