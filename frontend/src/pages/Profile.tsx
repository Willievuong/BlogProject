import { ThemeContext } from "@emotion/react"
import { Button, ButtonBase, Typography, Grid, Avatar, Box, TextField } from "@mui/material"
import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'
import PostCard from "../components/PostCard"
import ProfileCard from "../components/ProfileCard"
import axios from 'axios'




function Profile(){
    const [state, setState] = useState({
        username: "",
        posts: []
    })

    let { username } = useParams();

    async function getProfile() {
        const user = await axios({
            method: 'get',
            url: 'http://localhost:5001/' + username
        })
        const posts = await axios({
            method: 'get',
            url: 'http://localhost:5001/' + username + '/posts'
        })
        setState({username: user.data.username, posts: posts.data.data})
    }
    useEffect(()=>{
        getProfile()
    },[])

    return (
        <div>
            <Grid container spacing={2}>
                <Grid 
                    container
                    justifyContent="space-evenly"
                >
                    {state.username && <ProfileCard username={state.username}/>}
                </Grid>
                <Grid item container spacing={2} justifyContent="space-evenly">
                    {state.posts.map((i)=>{
                        return (                    
                            <Grid item xs={12}>
                                <PostCard post={i} renderPage={getProfile}/>
                            </Grid>)
                    })}
                </Grid>
            </Grid>
        </div>
    )
}

export default Profile