import React, { ChangeEvent, useState, useEffect } from "react";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from "@material-ui/core/IconButton";
import DoneOutlineRoundedIcon from "@material-ui/icons/DoneOutlineRounded";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { useForm } from "react-hook-form";
import { Typography } from "@material-ui/core";

interface IProps {
  selectedTag: { id: number; name: string };
  updateTag: (data: changeTag) => void;
  deleteTag: (id: number) => void;
}
interface changeTag {
  tagName: string;
}
function EditTagName(props: IProps) {
  const [tagName, setTagName] = useState("");
  const [tagChange, setTagChange] = useState(false);
  const { handleSubmit, register } = useForm<changeTag>();

  function handleTagChange(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    setTagChange(true);
    setTagName(target.value);
  }
  function updateTag(data: changeTag){
      props.updateTag(data);
      setTagChange(false);
  }
  
  useEffect(() => {
    setTagChange(false);
    setTagName(props.selectedTag.name);
  }, [props.selectedTag]);

  return (
    <div>
      {props.selectedTag.id>= 0 ? (
        <form onSubmit={handleSubmit(updateTag)}>
          <div style={{ padding: 20 }}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={3}>
                <TextField
                  id="changetagname"
                  value={tagName}
                  onChange={handleTagChange}
                  inputRef={register}
                  name="tag_name"
                  fullWidth={true}
                  inputProps={{ maxLength: 50 }}
                  InputProps={{ style: { fontSize: 30 } }}
                  InputLabelProps={{ style: { fontSize: 30, minHeight: 40 } }}
                  multiline
                />
              </Grid>
              <Grid item>
                <Tooltip title="Update Tag Name" placement="top">
                <IconButton
                  aria-label="updatetagname"
                  color="primary"
                  type="submit"
                  disabled={!tagChange}
                >
                  <DoneOutlineRoundedIcon />
                </IconButton>
                </Tooltip>
                
              </Grid>
              <Grid item>
              <Tooltip title="Delete Tag" placement="top">
                <IconButton
                  aria-label="deleteTag"
                  color="primary"
                  onClick={()=>props.deleteTag(props.selectedTag.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              </Grid>
            </Grid>
          </div>
        </form>
      ) : (
        <Typography variant="h4">{props.selectedTag.name}</Typography>
      )}
    </div>
  );
}

export default EditTagName;
