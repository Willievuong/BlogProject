import { Grid, Typography, Box, IconButton, Avatar, Card } from "@mui/material"
import { Link } from "react-router-dom"
import { IComment } from "../components/PostCard"

export interface Props {
    comment: IComment
}

function Comment(props: Props) {
    return (
        <div>
            <Grid container sx={{p:1}}>
                <IconButton sx={{mr: 1}} component={Link} to={'/' + props.comment['username']}>
                    <Avatar>
                        {props.comment['username'][0].toUpperCase()}
                    </Avatar>
                </IconButton>
                <Card sx={{bgcolor: '#f0f2f5', p:1, borderRadius: 4}}>
                    <Typography variant="body2" sx={{fontWeight: 600}}>
                        {props.comment['username']}
                    </Typography>
                    <Typography variant="body2">
                        {props.comment['content']}
                    </Typography>
                </Card>
            </Grid>
        </div>
    )
}

export default Comment