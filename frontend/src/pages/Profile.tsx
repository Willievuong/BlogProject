import { Grid } from "@mui/material"
import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'
import PostCard from "../components/PostCard"
import ProfileCard from "../components/ProfileCard"
import handleRequest from "../utilities/Request"




function Profile(){
    const [state, setState] = useState({
        username: "",
        posts: []
    })

    let { username } = useParams();
    //TODO: error checking
    async function getProfile() {
        const user = await handleRequest('get', '/' + username)
        const posts = await handleRequest('get', '/' + username + '/posts')
        setState({username: user.data.username, posts: posts.data.data})
    }
    useEffect(()=>{
        getProfile()
    },[])

    return (
        <div>
            <Grid container>
                <Grid xs={3}></Grid>
                <Grid 
                    container
                    justifyContent="space-evenly"
                >
                    {state.username && <ProfileCard username={state.username}/>}
                </Grid>
                <Grid item container spacing={2} justifyContent="center">
                    {state.posts.map((i)=>{
                        return (                    
                            <Grid item>
                                <PostCard post={i} renderPage={getProfile}/>
                            </Grid>)
                    })}
                </Grid>
                <Grid xs={3}></Grid>
            </Grid>
        </div>
    )
}

export default Profile