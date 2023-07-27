import {Card, CardContent, Button, TextField, Grid} from "@mui/material"
import { useState } from 'react'
import handleRequest from "../utilities/Request"
import { storage } from "../firebase"
import { ref } from "firebase/storage"
// import { v4 } from "uuid"

export interface Props {
    getHomePage: any;
}

function PostEntry(props : Props) {

    const [state, setState] = useState({
        newPostTitle: "",
        newPostContent: "",
        imageUpload: null
    })
    async function createPost() {
        let data = {subject: state.newPostTitle, content: state.newPostContent}
        const response = await handleRequest('post', '/createpost', data)
        if(response.status === 200) {
            props.getHomePage()
            setState({...state, newPostTitle:"", newPostContent: ""})
        }
    }

    function handleChange(event:any) {
        setState({...state, [event.target.id]: event.target.value})
    }

    function handleImageUpload(event: any) {
        setState({...state, imageUpload: event.target.files[0]})
    }

    function uploadImage() {
        if(state.imageUpload == null) {
            return
        }
        const imageRef = ref(storage, `post/${state.imageUpload}` )
    }

    return (
        <div>
            <Grid container>
                <Card sx={{ minWidth: 600, maxWidth: 1080}}>
                    <CardContent>
                        <Grid container >
                            <TextField id="newPostTitle" label="Title" fullWidth margin="normal" value={state.newPostTitle} onChange={handleChange}></TextField>
                            <TextField id="newPostContent" label="Tell us about it" fullWidth margin="normal" multiline value={state.newPostContent} onChange={handleChange}></TextField>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Button variant="contained">Upload Image</Button>
                            <Button variant="contained" size="large" onClick={createPost}>Post</Button>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    )
}

export default PostEntry