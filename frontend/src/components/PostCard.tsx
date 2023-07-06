import { Avatar, Card, CardContent, CardActions, IconButton, Typography, Grid, CardHeader, Button, Divider, Toolbar, TextField} from "@mui/material";
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import SendIcon from '@mui/icons-material/Send';
import { Box } from "@mui/system";
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Comment from "../components/Comment"
import axios from 'axios'


export interface IPost {
    comments: IComment[],
    content: string,
    id: number,
    subject: string,
    time: string,
    username: string
}

export interface IComment {
    content: string,
    id: number,
    post_id: number,
    time: string,
    username: string
}
export interface Props {
    post: IPost,
    renderPage: any
}

function PostCard(props : Props){
    //TODO: This is bad, post api call should also retrieve all comments
    const [state, setState] = useState({
        newComment: ""
    })

    async function createComment() {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:5001/'+ props.post.id + '/createcomment',
            headers: {'Authorization' : 'Bearer ' + localStorage.getItem('access_token')},
            data: { content: state.newComment }
        })
        if(response) {
            setState({newComment: ''})
            props.renderPage()
        }
    }

    function handleChange(event: any)  {
        setState({...state, [event.target.id]: event.target.value})
    }

    useEffect(()=>{

    },[state.newComment])

    return (
        <Card
            sx={{
                minWidth: 600,
                maxWidth: 600
            }}
        >
            <CardHeader
                avatar={
                    <Avatar>
                        {props.post['username'][0].toUpperCase()}
                    </Avatar>
                }
                action={
                    <IconButton component={Link} to={'/' + props.post['username']}>
                    </IconButton>
                }
                title={
                    <Grid container>
                        <Typography sx={{ fontWeight: 'medium'}}>
                            {props.post['username']}                    
                        </Typography>
                        <Typography color="text.secondary" sx={{ml:1}}>
                            {props.post['time']}
                        </Typography>
                    </Grid>
                }
                subheader={props.post['subject']}
            />
            <CardContent sx={{ml: 7}}>
                <Typography variant="body2">
                    {props.post['content']}
                </Typography>
            </CardContent>
            <Divider variant="middle"></Divider>
            <CardActions sx={{ justifyContent: 'space-around'}}>
                <Button size="small">
                    <ThumbUpAltOutlinedIcon/>&nbsp;Like</Button>
                <Button size="small">
                <ChatBubbleOutlineOutlinedIcon/>&nbsp;Comment</Button>
            </CardActions>
            <Divider variant="middle"></Divider>
            <Grid>
                {props.post.comments.map((i)=>{
                    return (
                        <Comment comment={i}/>
                    )
                })}
            </Grid>
            <Box >
                <Toolbar disableGutters sx={{ top: 'auto', bottom: 0, px: 1}}>
                    <IconButton sx={{mr: 1}}>
                        <Avatar
                            sx={{width: 40, height: 40}}
                        >
                            {props.post['username'][0].toUpperCase()}
                        </Avatar>
                    </IconButton>
                    <TextField 
                        id="newComment" 
                        label='Write a comment...' 
                        fullWidth onChange={handleChange} 
                        value={state.newComment} 
                        variant="filled"
                        size="small"
                        sx={{ borderRadius: 'px'}}
                    ></TextField>
                    <Button onClick={createComment}><SendIcon/></Button>
                </Toolbar>
            </Box>
        </Card>
    )
}

export default PostCard