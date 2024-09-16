import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react';
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
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';
import contractConfig from './contracts/contract-config.json'
import { Address, useAccount, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import SearchIcon from '@mui/icons-material/Search';
import LoadingButton from '@mui/lab/LoadingButton'

export function App() {
  const { isConnected, address } = useAccount();
  const theme = useTheme();
  const [patientName, setPatientName] = useState('');
  const [certificateDescription, setCertificateDescription] = useState('');
  const [certificateDate, setCertificateDate] = useState('');
  const [fileImg, setFileImg] = useState<File | null>(null);
  const [certificateHash, setcertificateHash] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [fileReady, setFileReady] = useState(false);   

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
        setcertificateHash(`${resFile.data.IpfsHash}`);
      } catch (error) {
        console.log('Error sending File to IPFS: ');
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (certificateHash) {
      certificateWrite.write({
        args: [patientName, certificateDescription, certificateHash],
      });
    }
  }, [certificateHash]);

  const handleSearch = async () => {
    try {
      const result = await certificateData.data;
      setSearchResult(result);
    } catch (error) {
      console.error('Error searching certificates:', error);
    }
  };

  const certificateWrite = useContractWrite({
    address: contractConfig.address as Address,
    abi: contractConfig.abi,
    functionName: 'addCertificate',
    onError(error) {
      console.log('Erro ao chamar a funcao')
      console.error(error)
    },
    onSuccess(data) {
      console.log('Deu certo!', data)
      setFileReady(true)
    },
  })

  const waitCertificate = useWaitForTransaction({ hash: certificateWrite.data?.hash })

  const certificateData = useContractRead({
    address: contractConfig.address as Address,
    abi: contractConfig.abi,
    functionName: 'getCertificateByIpfsHash',
    args: [searchTerm],
    watch: true
  })

  const wipeForms = () => {
    setPatientName('');
    setCertificateDescription('');
    setCertificateDate('');
    setFileImg(null);
  };

  useEffect(() => {
    if (!waitCertificate.isLoading && waitCertificate.isLoading !== undefined) {
      wipeForms();
    }
  }, [waitCertificate.isLoading]);
  

  return (
    <div style={{ backgroundColor: theme.palette.background.default, height: '100vh' }}>
      <CssBaseline />
      <AppBar position="sticky" sx={{ backgroundColor: 'primary' }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            TrustMed
          </Typography>
          <ConnectButton />
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {isConnected && (
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Emitir Atestado
            </Typography>
            <TextField
              label="Paciente"
              fullWidth
              sx={{ mb: 2 }}
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
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
              <LoadingButton loading={waitCertificate.isLoading} variant="contained" color="primary" type="submit">
                Adicionar Atestado
              </LoadingButton>
            </form>
            {certificateHash && fileReady && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Link para acessar o atestado:{' '}
                <Link href={`https://ipfs.io/ipfs/${certificateHash}`} target="_blank" rel="noopener">
                  https://ipfs.io/ipfs/{certificateHash}
                </Link>
              </Typography>
            )}
          </Paper>)}
      </Container>

      <Container sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom color="primary">
            Atestados
          </Typography>

          <TextField
            type="text"
            label="Pesquisar Atestados"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>),
            }}
          />
          {searchResult && (
            <Paper elevation={3} style={{ marginTop: '20px', padding: '15px' }}>
              <Typography variant="h5" gutterBottom color="primary">
                Resultados da busca:
              </Typography>
              <Typography dangerouslySetInnerHTML={{ __html: searchResult }} />
            </Paper>
          )}
        </Paper>
      </Container>
    </div>
  );
}
