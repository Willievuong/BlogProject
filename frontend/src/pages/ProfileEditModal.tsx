import { Box, Card, Typography, TextField, Grid, Modal, Button, IconButton, Avatar, AppBar, Toolbar } from '@mui/material'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

export interface Props {
    open: boolean
    toggleModal: any
    username: string
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: '#FFFFFF',
    borderRadius: 2,
}

function ProfileEditModal(props: Props) {

    return (
        <div>
            <Modal
                open={props.open}
                onClose={props.toggleModal}
            >
                <Box sx={style}>
                    <AppBar position="sticky" sx={{borderRadius: '8px 8px 0px 0px'}}>
                        <Toolbar>
                            <Typography sx={{flexGrow: 1}}>Edit Profile</Typography>
                            <Button variant="contained">Save</Button>
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing={2} sx={{p: 2}}>
                        <Grid item>
                            <IconButton>
                                    <Avatar
                                        sx={{width: 120, height: 120}}
                                    >
                                    </Avatar>
                            </IconButton>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label='Name' defaultValue={props.username}></TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth multiline maxRows={4} label='Bio'></TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label='Email'/>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    )
}
export default ProfileEditModal