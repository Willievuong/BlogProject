
import { AppBar, Button, Toolbar, Typography, IconButton, MenuItem, Menu } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from "@mui/system"
import React, { useState } from "react";
import { Link } from "react-router-dom"
import finalPropsSelectorFactory from "react-redux/es/connect/selectorFactory";

export interface authProps {
    pageName : string;
    logout: any;
    loggedIn: boolean;
    username : string;
}

function AuthenticatedNavBar(props : authProps){

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                {props.username}
            </Typography>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleMenu}
            >
                <MenuIcon/>
            </IconButton>
            <Menu
                id="menu-appbar"
                keepMounted
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem component={Link} to="/"> Home </MenuItem>
                <MenuItem component={Link} to={'/' + props.username}> Profile </MenuItem>
                <MenuItem component={Link} to="/login" onClick={props.logout}> Log Out </MenuItem>
            </Menu>

        </Toolbar>
    )

}

function NonAuthenticatedNavBar(){
    return (
        <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                Blog Project
            </Typography>
            <Button color="inherit" href="/login">
                Login
            </Button>
        </Toolbar>
    )
}


function Navbar(props: authProps){

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position ="static">
                {props.loggedIn ? 
                    <AuthenticatedNavBar pageName={"PAGE NAME"} loggedIn={props.loggedIn} logout={props.logout} username={props.username}/> 
                    : 
                    <NonAuthenticatedNavBar/>
                }
            </AppBar>
        </Box>
    )


}

export default Navbar