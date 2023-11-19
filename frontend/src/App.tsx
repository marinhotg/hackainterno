import { useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  useTheme,
  Container,
  Paper,
  TextField,
  Button,
} from '@mui/material';

export function App() {
  const theme = useTheme();
  const [patientName, setPatientName] = useState('');
  const [certificateDescription, setCertificateDescription] = useState('');
  const [certificateDate, setCertificateDate] = useState('');
  const [fileImg, setFileImg] = useState<File | null>(null);

  const sendFileToIPFS = async (e: React.FormEvent) => {
    e.preventDefault();

    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append('file', fileImg);

        const resFile = await axios({
          method: 'post',
          url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
          data: formData,
          headers: {
            'pinata_api_key': '14a3acc6d1ea9b622ce5',
            'pinata_secret_api_key': '27b299567068aa16c86ae9225c6a87146da14f5e87a4fc710d8b159d350586a5',
            'Content-Type': 'multipart/form-data',
          },
        });

        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        console.log(ImgHash);

      } catch (error) {
        console.log('Error sending File to IPFS: ');
        console.error(error);
      }
    }
  };

  return (
    <div style={{ backgroundColor: theme.palette.background.default, height: '100vh' }}>
      <CssBaseline />
      <AppBar position="sticky" sx={{ backgroundColor: 'primary' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Wagmi + RainbowKit + Vite
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom color="primary">
            Emitir Atestado
          </Typography>
          <TextField
            label="Paciente"
            fullWidth
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={4}
            value={certificateDescription}
            onChange={(e) => setCertificateDescription(e.target.value)}
          />
          <TextField
            label="Data"
            fullWidth
            type="date"
            sx={{
              '& input': {
                minHeight: '4em',
                display: 'flex',
              },
            }}
            value={certificateDate}
            onChange={(e) => setCertificateDate(e.target.value)}
          />
          <form onSubmit={sendFileToIPFS}>
            <label>
              Selecione o arquivo do atestado:
              <input type="file" onChange={(e) => setFileImg(e.target.files?.[0] || null)} required />
            </label>
            <br />
            <Button variant="contained" color="primary" type="submit">
              Adicionar Atestado
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
