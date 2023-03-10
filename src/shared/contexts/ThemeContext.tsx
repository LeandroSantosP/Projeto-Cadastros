import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DarkTheme, LightTheme } from '../themes/';
import { ThemeProvider } from '@mui/material';
import { Box } from "@mui/system";

interface IThemeContextProps {
   themeName: 'light' | 'dark'
   toggleTheme: () => void;
}

export const useAppThemeContext = () => {
   return useContext(ThemeContext);
}

const ThemeContext = createContext({} as IThemeContextProps);

interface AppThemeProviderProps {
   children: React.ReactNode
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
   const [themeName, setThemeName] = useState<'light' | 'dark'>('light');

   const toggleTheme = useCallback(() => {
      setThemeName(oldTheme => oldTheme === 'light' ? 'dark' : 'light');
   }, [])
   
   const theme = useMemo(() => {
      if(themeName === 'light') return LightTheme

      return DarkTheme;
   }, [themeName]);

   
   

   return (
      <ThemeContext.Provider value={{ themeName, toggleTheme }}>
         <ThemeProvider theme={theme}>
            <Box width='100vw' height='100vh' bgcolor={theme.palette.background.default}>
               {children}
            </Box>
         </ThemeProvider>
      </ThemeContext.Provider>
   )

}
