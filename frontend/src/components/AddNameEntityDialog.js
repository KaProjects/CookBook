import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import axios from "axios";


const AddNameEntityDialog = ({ open, handleOpen, parentCallBack, props, type }) => {
  const [name, setName] = React.useState("");

  const handleClose = () => {
    setName("");
    handleOpen(false);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.post("http://" + props.host + ":" + props.port + "/"+type+"/",{id:null,name:name});
    console.log(type + " created: " + response.data)

    parentCallBack();
    handleClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add new {type}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              label="name"
              type="text"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default AddNameEntityDialog;
