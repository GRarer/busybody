import { Card, CardHeader, CardContent, Typography, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { WatchedTasksResponse } from "busybody-core";
import { useState } from "react";
import { renderDate, unixSecondsToDate } from "../../../util/dates";
import { FriendAvatar } from "../friends/friendCard";
import {red} from "@mui/material/colors"

export function DueDate(props: {unixSeconds: number, overdue: boolean}): JSX.Element {
  const time = renderDate(unixSecondsToDate(props.unixSeconds));
  // TODO integrate with theme colors
  const color = props.overdue ? red[500] : undefined;

  return <Typography variant="subtitle2" color={color}>Due {time}</Typography>
}

export function WatchedTaskCard(props: {
  info: WatchedTasksResponse[0];
  unfollow: () => void
}): JSX.Element {

  const [showUnfollowConfirmation, setShowUnfollowConfirmation] = useState(false);

  return <>
    <Card elevation={4} sx={{ marginBottom: '10px' }}>
      <CardHeader sx={{ paddingBottom: '0' }}
        avatar={<FriendAvatar info={props.info.owner} />}
        title={props.info.title}
        subheader={props.info.owner.fullName}
      />
      <CardContent sx={{paddingBottom: "0"}}>
        <Typography variant="body1">{props.info.description}</Typography>
        <DueDate unixSeconds={props.info.dueDate} overdue={props.info.overdue}/>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => setShowUnfollowConfirmation(true)}>Stop Watching</Button>
      </CardActions>
    </Card>
    <Dialog
      open={showUnfollowConfirmation}
      onClose={() => setShowUnfollowConfirmation(false)}
    >
      <DialogTitle>
        {`Stop watching this task?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {/* // TODO would be more natural to use friendly name here, would need to add to response*/}
          Do you want to stop watching the task <em>"{props.info.title}"</em> from {props.info.owner.fullName}? It
          will no longer  appear in your "watching" list and you will not be notified
          if {props.info.owner.fullName} misses the deadline.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowUnfollowConfirmation(false)}>Cancel</Button>
        <Button onClick={() => {
          props.unfollow();
        }}>
          Stop Watching
        </Button>
      </DialogActions>
    </Dialog>
  </>
}
