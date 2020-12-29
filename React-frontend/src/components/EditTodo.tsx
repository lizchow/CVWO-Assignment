import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface Tag {
  id: number;
  name: string;
  taggings_count: number;
}

interface Todo {
  title: string;
  tag_list: string[];
}
interface EditProps {
  editTodo: (data: Todo, id: number) => void;
  tags: Tag[];
  ItemId: number;
  ItemTitle: string;
  ItemTags: string[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > * + *": {
        marginTop: theme.spacing(3),
      },
    },
  })
);

function EditForm(Props: EditProps) {
  const [inputError, setInputError] = useState(false);
  const [tagChange, setTagChange] = useState(false);
  const [titleChange, setTitleChange] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [inputTags, setInputTags] = useState<string[]>([]);
  const { handleSubmit, register } = useForm<Todo>();
  const classes = useStyles();

  let history = useHistory();

  function ValidateInput(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    setTitleChange(true);
    setInputTitle(target.value);
    if (target.value.trim() === "") {
      setInputError(true);
    } else {
      setInputError(false);
    }
  }
  function handleTagChange(value: string[]) {
    setTagChange(true);
    setInputTags(value);
  }
  function onSubmit(data: Todo) {
    //console.log(data);
    setTagChange(false);
    setTitleChange(false);
    Props.editTodo(
      {
        title: data.title.trim(),
        tag_list: inputTags,
      },
      Props.ItemId
    );
    history.push("/");
  }

  useEffect(() => {
    setInputTitle(Props.ItemTitle);
    setInputTags(Props.ItemTags);
    setTitleChange(false);
    setTagChange(false);
  }, [Props.ItemId]);

  if (Props.ItemId === -1) {
    return (
      <div>
        <h1>Select an item.</h1>
      </div>
    );
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction="column" spacing={2}>
          <Grid item xs>
            <Grid container justify="flex-end">
              <Button
                disabled={!(tagChange || titleChange)}
                type="submit"
                variant="contained"
                color="primary"
              >
                Update Todo
              </Button>
            </Grid>
          </Grid>
          <Grid item xs>
            <TextField
              required
              inputRef={register}
              multiline
              fullWidth
              name="title"
              onChange={ValidateInput}
              label="Title"
              value={!titleChange ? Props.ItemTitle : inputTitle}
              error={inputError}
              helperText={inputError ? "*Required" : ""}
              size="medium"
              InputProps={{ style: { fontSize: 30 } }}
              InputLabelProps={{ style: { fontSize: 30, minHeight: 40 } }}
              margin="normal"
            />
          </Grid>
          <Grid item xs>
            <div className={classes.root}>
              <Autocomplete
                multiple
                id="tags-filled"
                options={Props.tags.map((tag) => tag.name)}
                value={!tagChange ? Props.ItemTags : inputTags}
                onChange={(_, value) => handleTagChange(value)}
                freeSolo
                renderTags={(value: string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Tags"
                    placeholder="Input your tags"
                  />
                )}
              />
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
export default EditForm;
