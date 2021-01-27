import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Tag, Todo, NewTodo } from "../Types";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

interface inputChangeParams {
  change: boolean;
  inputTags: string[];
  inputTitle: string;
  inputDate: Date | null;
}

interface EditProps {
  editTodo: (data: NewTodo, id: number) => void;
  tags: Tag[];
  selectedItem: Todo;
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
  const [inputChange, setInputChange] = useState<inputChangeParams>({
    change: false,
    inputTags: [],
    inputTitle: "",
    inputDate: null,
  });
  const { handleSubmit, register } = useForm<NewTodo>();
  const classes = useStyles();

  let history = useHistory();

  /**
   * Description: Check whether the task input is empty
   * @param e
   */
  function ValidateInput(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    setInputChange((prevState) => ({
      ...prevState,
      change: true,
      inputTitle: target.value,
    }));
    if (target.value.trim() === "") {
      setInputError(true);
    } else {
      setInputError(false);
    }
  }

  /**
   * Description: update local date variable
   * @param date 
   */
  function handleDateChange(date: MaterialUiPickersDate | null) {
    setInputChange((prevState) => ({
      ...prevState,
      change: true,
      inputDate: date,
    }));
  }

  /**
   * Description: update local tag_name variable
   * @param value 
   */
  function handleTagChange(value: string[]) {
    setInputChange((prevState) => ({
      ...prevState,
      change: true,
      inputTags: value,
    }));
  }

  /**
   * Description: Update the selected item
   * @param data 
   */
  function onSubmit(data: NewTodo) {
    setInputChange((prevState) => ({
      ...prevState,
      change: false,
    }));
    Props.editTodo(
      {
        title: data.title.trim(),
        tag_list: inputChange.inputTags,
        date: inputChange.inputDate,
      },
      Props.selectedItem.id
    );
    history.push("/");
  }

  useEffect(() => {
    setInputChange((prevState) => ({
      ...prevState,
      change: false,
      inputTitle: Props.selectedItem.title,
      inputTags: Props.selectedItem.tag_list,
      inputDate: Props.selectedItem.dueDate,
    }));
  }, [Props.selectedItem]);

  if (Props.selectedItem.id < 0) {
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
                disabled={!inputChange.change}
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
              value={inputChange.inputTitle}
              error={inputError}
              helperText={inputError ? "*Required" : ""}
              size="medium"
              InputProps={{ style: { fontSize: 30 } }}
              InputLabelProps={{ style: { fontSize: 30, minHeight: 40 } }}
              margin="normal"
            />
          </Grid>
          <Grid item xs>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                label="Due Date"
                value={inputChange.inputDate}
                disablePast
                onChange={handleDateChange}
                variant="inline"
                margin="normal"
                minDateMessage="Overdue!"
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs>
            <div className={classes.root}>
              <Autocomplete
                multiple
                id="tags-filled"
                options={Props.tags.map((tag) => tag.name)}
                value={inputChange.inputTags}
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
