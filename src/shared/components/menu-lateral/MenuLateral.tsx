import { Avatar, Button, Divider, Drawer, ListItemButton, ListItemText, Typography, useTheme } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from "@mui/system";
import React from "react";

import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import { IDrawerOptions, useAppThemeContext, useAuthContext, useDrawerContext } from "../../contexts";
import { GiBedLamp } from 'react-icons/gi'
import { BiLogOut } from 'react-icons/bi'


interface IDrawerProviderProps {
   children: React.ReactNode
};

interface IListItemLinkProps {
   label: string;
   icon: React.ReactNode;
   to: string;
   onClick: (() => void) | undefined;
};

const ListItemLink: React.FC<IListItemLinkProps> = ({ to, icon, label, onClick }) => {
   const navigate = useNavigate();
   
   const resolvePath = useResolvedPath(to);
   const match = useMatch({ path: resolvePath.pathname, end: false });

   const hadleClick = () => {
      navigate(to);
      onClick?.();
   }

   return (
      <ListItemButton selected={!!match} onClick={hadleClick}>
         <Box fontSize='1.5rem' marginRight='1rem'>
            {icon}
         </Box>
         <ListItemText primary={label} />
      </ListItemButton>
   )
}

export const MenuLateral: React.FC<IDrawerProviderProps> = ({ children }) => {
   const { isDrawerOpen, toggleDrawerOpen, DrawerOptions } = useDrawerContext();
   const { isAuthenticated, logout } = useAuthContext();

   const theme = useTheme();
   const smDown = useMediaQuery(theme.breakpoints.down('sm'));
   const { themeName, toggleTheme } = useAppThemeContext();

   return (
      <>
         <Drawer open={isDrawerOpen} onClose={toggleDrawerOpen} variant={smDown ? 'temporary' : 'permanent'}>
            <Box width={theme.spacing(28)} height="100%" display="flex" flexDirection="column" >
               <Box width='100%' height={theme.spacing(20)} display="flex" alignItems="center" justifyContent="center">
                  <Avatar
                     src="https://cpmr-islands.org/wp-content/uploads/sites/4/2019/07/test.png"
                     sx={{ width: theme.spacing(12), height: theme.spacing(12) }}
                  />
               </Box>
               <Divider />

               {isAuthenticated && (
                  <Box flex={1}>
                     {DrawerOptions.map(drawerOption => (
                        <ListItemLink
                           to={drawerOption.path}
                           key={drawerOption.path}
                           icon={drawerOption.icon}
                           label={drawerOption.label}
                           onClick={smDown ? toggleDrawerOpen : undefined}
                        />
                     ))}
                  </Box>
               )}
            </Box>
            
            <Button onClick={logout} sx={{ marginBottom: "2rem" }}>
               <Box 
                     color={themeName == 'light' ? '#111' : '#fff'}>
                     <Typography
                        fontSize='.8rem'
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap="1rem"
                     >
                        <BiLogOut  />
                        Deslogar
                     </Typography>
               </Box>
            </Button>
            <Button onClick={toggleTheme}>
               <Box marginRight='.5rem' fontSize='.6rem' color={themeName == 'light' ? '#111' : '#fff'}>
                  <GiBedLamp />
                  <p>Alterar para tema {themeName != 'light' ? 'claro' : 'escuro'}</p>
               </Box>
            </Button>
         </Drawer>

         <Box height="100vh" marginLeft={smDown ? theme.spacing(0) : theme.spacing(28)}>
            {children}
         </Box>

      </>
   );
};