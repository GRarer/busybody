import { Typography } from '@mui/material';
import React from 'react';

export function FAQ(): JSX.Element {
  return <>
    <Typography variant='h6'>How do I make my friends be notified when I miss my tasks?</Typography>
    <Typography variant='body1'>When you create or edit a task in your to-do list, you can select the &apos;add
    watcher&apos; option to attach one or more friends to that task. Watchers are the people who will be notified by
    email if that particular task becomes overdue.</Typography>

    <Typography variant='h6'>How do I connect with friends?</Typography>
    <Typography variant='body1'>To be able to attach your friends as &apos;watchers&apos; for your tasks,
    you must first connect as friends on Busybody by sending or accepting a friend request. You can
    do this by entering your friend&apos;s username on the friends tab.</Typography>

    <Typography variant='h6'>What is my username?</Typography>
    <Typography variant='body1'>When logged in, you can view your username by opening the settings menu and
    navigating to &apos;Change Personal Info&apos;.</Typography>
    <Typography variant='body1'>If you cannot log in because you do not know your username, try the &apos;reset
    password&apos; option. This option, which becomes visible after one incorrect login attempt, will send you an email
    with your username and a password reset code. If there is no account associated with your email address, the email
    will say so.</Typography>

    <Typography variant='h6'>Why does Busybody exist?</Typography>
    <Typography variant='body1'>Busybody is a class project created by Grace Rarer for CS 4365
    Intro to Enterprise Computing at Georgia Tech.</Typography>

    <Typography variant='h6'>Will Busybody continue to be available after the current semester ends?</Typography>
    <Typography variant='body1'>Unfortunately, Busybody is not planned to operate after the current
    semester. The Busybody server will be shut down after May 10th 2022.</Typography>

    <Typography variant='h6'>Is Busybody open-source?</Typography>
    <Typography variant='body1'>Yes, the Busybody source code is available
    at <a href='https://github.com/GRarer/busybody'>github.com/GRarer/busybody</a> and is
    released under the MIT license. </Typography>
  </>;
}
