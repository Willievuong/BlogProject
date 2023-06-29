import {Card, CardContent, Button, TextField, Typography, Grid, IconButton, Avatar, formLabelClasses} from "@mui/material"
import { useState, useEffect } from 'react'
import axios from 'axios'
import ProfileEditModal from "../pages/ProfileEditModal";

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
        const response = await axios({
        method: 'post',
        url: 'http://localhost:5001/follow/' + props.username,
        headers: {'Authorization' : 'Bearer ' + localStorage.getItem('access_token')}
        })
        if(response) {
            console.log(response)
        }
    }

    async function unfollow() {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:5001/unfollow/' + props.username,
            headers: {'Authorization' : 'Bearer ' + localStorage.getItem('access_token')}
        })
    }

    async function isFollowing() {
        const response = await axios({
            method: 'get',
            url: 'http://localhost:5001/isfollowing/' + props.username,
            headers: {'Authorization' : 'Bearer ' + localStorage.getItem('access_token')}
        })
        if(response) {
            console.log(response.data)
            if(response.data == 'self') {
                console.log('me')
                setState({...state, isSelf: true})
            }
            else {
                response.data == true ? setState({...state, isFollowing: true}) : setState({...state, isFollowing: false})
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