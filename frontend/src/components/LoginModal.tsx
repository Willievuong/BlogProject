import { Card, Button, CardContent, TextField, Typography } from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import handleRequest from "../utilities/Request";

export interface Props {
    setLoggedIn: any
    loggedIn: boolean
}

function LoginModal(props: Props){
    const [state, setState] = useState({
        username: '',
        password: '',
        errorText: ''
    })

    const navigate = useNavigate()

    async function login() {
        let data = {
            username: state.username,
            password: state.password
        }
        let response = await handleRequest('post','/login', data) 
        if(response.status === 200) {
            localStorage.setItem('access_token', response.data.access_token)
            props.setLoggedIn(true)
            navigate('/')
        } else {
            setState({...state, errorText: "The username or password you entered is incorrect, please try again."})
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setState({...state, [e.target.id]: e.target.value})
    }
    //TODO: make login print message & not redirect if failed
    return (
        <div>
            <Grid
                container
                justifyContent="space-evenly"
                direction="row"
                alignItems="center"
            >
                <Card sx={{ minWidth: 275, maxWidth: 575 }} >
                    <CardContent >
                        <Typography>
                            Log Into Blog
                        </Typography>
                        <TextField id="username" label="Username" fullWidth margin="normal" onChange={handleChange}/>
                        <TextField id="password" label="Password" fullWidth margin="normal" onChange={handleChange} type="password"/>
                        <Typography sx={{color: 'red'}} variant="body2" gutterBottom>{state.errorText}</Typography>
                        <Button variant="contained" size="large" onClick={login} fullWidth> Login </Button>
                        <Typography>
                            Not yet a user? <a href="/signup">sign up</a>
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    )


}

export default LoginModal