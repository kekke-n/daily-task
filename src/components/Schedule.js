import React from "react";
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function Schedule(props) {
  return (
    <div>
      <h4>スケジュール</h4>
      <Button
          variant="contained"
          size="small"
          onClick={props.copyToClipBoard(props.text)}>
          <ContentCopyIcon fontSize="small"/>
      </Button>
      <div style={{margin: 10}}>
        <pre>{props.text}</pre>
      </div>
    </div>
  )
}

export default Schedule;