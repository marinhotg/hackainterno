import { ConnectButton } from '@rainbow-me/rainbowkit'
import { AppBar, Toolbar, Typography, CssBaseline, useTheme } from '@mui/material'

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
          <ConnectButton />
        </Toolbar>
      </AppBar>  
    </div>
  )
}
