import { Avatar, Card, CardContent, CardActions, IconButton, Typography, Grid, CardHeader, Button } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom"

export interface Props {
    username: string
    subject: string
    content: string
    datetime: string
}

function PostCard(props : Props){

    // return (
    //     <div>
    //         <Grid
    //             container
    //             justifyContent="space-evenly"
    //             alignItems="center"
    //         >
    //             <Card sx={{
    //                 minWidth: 600,
    //                 maxWidth: 600
    //             }}>
    //                 <Grid container>
    //                     <Grid item container justifyContent="center" alignItems="center" xs={2}>
    //                         <IconButton component={Link} to={'/' + props.username}>
    //                             <Avatar
    //                                 sx={{width: 50, height: 50}}
    //                             >
    //                                 {props.username[0].toUpperCase()}
    //                             </Avatar>
    //                         </IconButton>
    //                     </Grid>
    //                     <Grid item xs={9} spacing={2}>
    //                         <Typography sx={{ fontWeight: 'medium'}}> {props.username} </Typography>
    //                         <Typography variant='h6'>{props.subject}</Typography>
    //                         <Typography variant='body1'>{props.content}</Typography>
    //                     </Grid>
    //                     <Grid item container justifyContent="flex-end">
    //                         <Typography variant="body2" color="text.secondary">{props.datetime}</Typography>
    //                     </Grid>
    //                 </Grid>
    //             </Card>
    //         </Grid>
    //     </div>
    // )

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar>
                        {props.username[0].toUpperCase()}
                    </Avatar>
                }
                action={
                    <IconButton component={Link} to={'/' + props.username}>
                    </IconButton>
                }
                title={
                    <Grid container>
                        <Typography sx={{ fontWeight: 'medium'}}>
                            {props.username}                    
                        </Typography>
                        <Typography color="text.secondary" sx={{ml:1}}>
                            {props.datetime}
                        </Typography>
                    </Grid>
                }
                subheader={props.subject}
            />
            <CardContent sx={{ml: 7}}>
                <Typography variant="body2">
                    {props.content}
                </Typography>
            </CardContent>
            <CardActions sx={{ml: 7}}>
                <Button size="small">Comment</Button>
                <Button size="small">Like</Button>
            </CardActions>
        </Card>
    )
}

export default PostCard