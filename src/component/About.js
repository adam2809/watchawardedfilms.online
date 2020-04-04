import React, { Component }  from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';

export default function About(props){
    return (
        <Container maxWidth='sm' style={{paddingTop:50}}>
            <Paper>
            {
                [
                    ['Author','Adam Kulesza'],
                    ['Projects github','https://github.com/adam2809/watchawardedfilms.online'],
                    ['Authors github','https://github.com/adam2809'],
                    ['Contact email','adam.kule@gmail.com']
                ].map((pair) => (
                    <>
                    <AboutCardRow title={pair[0]} content={pair[1]}/>
                    <Divider/>
                    </>
                ))
            }
            </Paper>
        </Container>
    )
}

function AboutCardRow(props){
    return (
        <>
        <Typography variant='h6' style={{marginLeft:20,paddingTop:20}}>
            {props.title}
        </Typography>
        <Typography variant='subtitle1' style={{marginLeft:20,paddingBottom:20}}>
            {props.content}
        </Typography>
        </>
    )
}
