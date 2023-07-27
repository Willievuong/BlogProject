import { Card, Button, CardContent, TextField, Typography } from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2';
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import handleRequest from "../utilities/Request";



function SignUpModal(){

    const [state, setState] = useState({
        email: '',
        username: '',
        password: '',
        errorText: ''
    })
    
    const navigate = useNavigate()
    async function signup() {
        let data = {
            email: state.email,
            username: state.username,
            password: state.password
        }
        const response = await handleRequest('post', '/signup', data)
        if(response.status === 201) {
            navigate('/login')
        } else if(response.response.status === 406) {
            setState({...state, errorText: response.response.data.message})
        }
    }

    function handleChange(event:any) {
        setState({...state, [event.target.id]: event.target.value})
    }

    useEffect(()=>{

    }, [state.errorText])

    return (
        <div>
            <Grid
                container
                justifyContent="space-evenly"
                direction="row"
                alignItems="center"
            >
                <Card sx={{ minWidth: 275, maxWidth: 575 }} >
                    <CardContent>
                        <Typography>
                            Sign Up Modal
                        </Typography>
                        <TextField id="username" 
                                   label="Username" 
                                   fullWidth 
                                   margin="normal" 
                                   onChange={handleChange} 
                                   error={state.errorText.length === 0 ? false: true}
                                   helperText={state.errorText}
                        />
                        <TextField id="email" label="Email" fullWidth margin="normal" onChange={handleChange}/>
                        <TextField id="password" label="Password" fullWidth margin="normal" onChange={handleChange} type="password"/>
                        <Button variant="contained" size="large" onClick={signup}>Sign Up</Button>
                        <Typography>
                            Did you mean to <a href="/login">login</a> instead?
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    )


}


export default SignUpModal
