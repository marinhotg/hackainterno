import { useState } from 'react';
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

  return (
    <div style={{ backgroundColor: theme.palette.background.default, height: '100vh' }}>
      <CssBaseline />
      <AppBar position="sticky" sx={{ backgroundColor: theme.palette.background.default }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Wagmi + RainbowKit + Vite
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Emitir Atestado
          </Typography>
          <TextField
            label="Paciente"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            label="Data"
            fullWidth
            type="date"
            margin="normal"
            sx={{
              '& input': {
                  minHeight: '4em', 
                  display: 'flex',
              },
            }}
          />
          <TextField
            label="URL do Atestado"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary">
            Adicionar Atestado
          </Button>
        </Paper>
      </Container>
    </div>
  );
}
