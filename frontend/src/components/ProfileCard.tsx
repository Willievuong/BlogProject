import {Card, Button, Typography, Grid, IconButton, Avatar} from "@mui/material"
import { useState, useEffect } from 'react'
import ProfileEditModal from "../pages/ProfileEditModal";
import handleRequest from "../utilities/Request";

export interface Props {
    username: string;
}

function ProfileCard(props : Props) {

    const [state, setState] = useState({
        isFollowing: false,
        isSelf: false,
        editProfile: false
    })
    
    async function follow() {
        const response = await handleRequest('post', '/follow/' + props.username)
        if(response.status === 200) {
            console.log(response)
        }
    }

    async function unfollow() {
        const response = await handleRequest('post', '/follow/' + props.username)
        if(response.status === 200) {
            console.log(response)
        }
    }

    async function isFollowing() {
        const response = await handleRequest('get', '/isfollowing/' + props.username)
        if(response) {
            console.log(response.data)
            if(response.data === 'self') {
                setState({...state, isSelf: true})
            }
            else {
                response.data === true ? setState({...state, isFollowing: true}) : setState({...state, isFollowing: false})
            }
        }
    }
    //TODO: Link to edit profile component
    function editProfile() {
        setState({...state, editProfile: !state.editProfile})
    }

    useEffect(()=> {
        isFollowing()
    }, [state.isFollowing, state.isSelf])


    return (
        <div>
            <ProfileEditModal open={state.editProfile} toggleModal={editProfile} username={props.username}/>
            <Grid
                container
                justifyContent="space-evenly"
                alignItems="center"
            >
                <Card sx={{
                    minWidth: 600,
                    maxWidth: 600
                }}>
                    <Grid container sx={{p:2}}>
                        <Grid item container justifyContent="space-between" alignItems="flex-end">
                            <Grid item>
                                <IconButton>
                                        <Avatar
                                            sx={{width: 120, height: 120}}
                                        >
                                            {props.username[0].toUpperCase()}
                                        </Avatar>
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <Button 
                                    variant="contained" 
                                    onClick={ state.isSelf ? editProfile : (state.isFollowing ? unfollow : follow) }
                                > 
                                    { state.isSelf ? 'Edit Profile' : (state.isFollowing ? 'Unfollow' : 'Follow') }
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" sx={{fontWeight: 700}}>{props.username}</Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>@handle</Typography>
                            <Typography variant="body1">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Typography>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </div>
    )
}

export default ProfileCard