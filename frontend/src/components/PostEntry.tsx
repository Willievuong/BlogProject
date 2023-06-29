import {Card, CardContent, Button, TextField, Typography, Grid} from "@mui/material"
import { useState } from 'react'
import axios from 'axios'

export interface Props {
    getHomePage: any;
}

function PostEntry(props : Props) {

    const [postState, setState] = useState({
        newPostTitle: "",
        newPostContent: ""
    })
    async function createPost() {
        let data = {subject: postState.newPostTitle, content: postState.newPostContent}
        const response = await axios({
            method: 'post',
            url: 'http://localhost:5001/createpost',
            headers: {'Authorization' : 'Bearer ' + localStorage.getItem('access_token')},
            data: data
        })
        if(response) {
            props.getHomePage()
            setState({newPostTitle:"", newPostContent: ""})
        }
    }

    function handleChange(event:any) {
        setState({...postState, [event.target.id]: event.target.value})
    }

    return (
        <div>
            <Grid
                container
                justifyContent="space-evenly"
                alignItems="center"
            >
                <Card sx={{ minWidth: 600, maxWidth: 1080}}>
                    <CardContent>
                        <Grid container >
                            <TextField id="newPostTitle" label="Title" fullWidth margin="normal" value={postState.newPostTitle} onChange={handleChange}></TextField>
                            <TextField id="newPostContent" label="Tell us about it" fullWidth margin="normal" multiline value={postState.newPostContent} onChange={handleChange}></TextField>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Button variant="contained" size="large" onClick={createPost}>Post</Button>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    )
}

export default PostEntry