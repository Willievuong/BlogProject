import { Avatar, Card, CardContent, CardActions, IconButton, Typography, Grid, CardHeader, Button, Modal, Box } from "@mui/material";
import { Link } from "react-router-dom"

export interface Props {
    open: boolean
    toggleModal: any
    username: string
    subject: string
    content: string
    datetime: string
}

function CommentModal(props: Props) {


    return (
        <Modal
            open={props.open}
            onClose={props.toggleModal}
        >
            <Box>
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
                </Card>
            </Box>
        </Modal>
    )
}

export default CommentModal