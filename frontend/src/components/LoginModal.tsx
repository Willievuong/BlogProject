import { Card, Button, CardContent, TextField, Typography } from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2';
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'

export interface Props {
    setLoggedIn: any
    loggedIn: boolean
}

function LoginModal(props: Props){
    const [state, setState] = useState({
        username: '',
        password: ''
    })

    const navigate = useNavigate()

    async function helloWorld() {
        const response = await axios.get('http://localhost:5001/')
        console.log(response)

    }

    async function login() {
        const response = await axios.post('http://localhost:5001/login',{
            username: state.username,
            password: state.password
        })
        if(response.status == 200) {
            localStorage.setItem('access_token', response.data.access_token)
            props.setLoggedIn(true)
            navigate('/')
        }
    }

    function handleChange(event:any) {
        setState({...state, [event.target.id]: event.target.value})
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
                            Login Modal
                        </Typography>
                        <TextField id="username" label="Username" fullWidth margin="normal" onChange={handleChange}/>
                        <TextField id="password" label="Password" fullWidth margin="normal" onChange={handleChange}/>
                        <Button variant="contained" size="large" onClick={login}> Login </Button>
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