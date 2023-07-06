import { Button, Grid, Typography } from "@mui/material"
import PostCard from "../components/PostCard"
import axios from 'axios'
import { useEffect, useState } from 'react'
import PostEntry from "../components/PostEntry"

export interface Props {
    handleChange: any;
    loggedIn: boolean
}

function Home(props: Props){
    const [state, setState] = useState({
        posts: []
    })
    //TODO: make this call return all post of you & people you follow
    async function homepage() {
        const response = await axios({
            method: 'get',
            url: 'http://localhost:5001/allposts',
            headers: {'Authorization' : 'Bearer ' + localStorage.getItem('access_token')}
        })
        setState({posts: response.data.data})
    }
    useEffect(()=>{
        homepage()
    }, [])
    return (
        <div>
            <Grid container>
                <Grid xs={3}></Grid>
                <Grid container spacing={2} direction="column" justifyContent="center" xs={6}>
                    <Grid item container justifyContent='center'>
                        <PostEntry getHomePage={homepage}/>  
                    </Grid>
                    <Grid container item spacing={2} justifyContent='center'>
                        {state.posts.map((i)=>{
                            return (                    
                                <Grid item>
                                    <PostCard post={i} renderPage={homepage}/>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
                <Grid xs={3}></Grid>
            </Grid>          
        </div>
    )

}

export default Home