import { Button, Grid, Typography } from "@mui/material"
import PostCard from "../components/PostCard"
import axios from 'axios'
import { useEffect, useState } from 'react'
import PostEntry from "../components/PostEntry"

export interface Props {
    handleChange: any;
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
        console.log(response.data.data)
    }
    useEffect(()=>{
        homepage()
    }, [])
    return (
        <div
            style={{
                
            }}
        >
            <Grid container spacing={2} justifyContent="space-evenly">
                <Grid item xs={12}>
                    <Typography>
                        Home Page
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <PostEntry getHomePage={homepage}/>  
                </Grid>
                <Grid item container spacing={2} justifyContent="space-evenly">
                    {state.posts.map((i)=>{
                        return (                    
                            <Grid item xs={12}>
                                <PostCard post={i} renderPage={homepage}/>
                            </Grid>)
                    })}
                </Grid>
            </Grid>           
        </div>
    )

}

export default Home