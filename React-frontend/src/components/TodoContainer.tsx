import React, { KeyboardEvent, ChangeEvent, useState, useEffect } from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import Divider from "@material-ui/core/Divider";
import EditForm from "./EditTodo";
import { Tag, Todo, NewTodo } from "../Types";

interface ContainerProps {
  todos: Todo[];
  inputValue: string;
  tags: Tag[];
  checkedLen: number;
  newItem: Todo;
  InputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  createTodo: (e: KeyboardEvent<HTMLInputElement>) => void;
  toggleTodo: (e: ChangeEvent<HTMLInputElement>, id: number) => void;
  deleteTodo: () => void;
  editTodo: (data: NewTodo, id: number) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
  })
);
const initialState: Todo = {
  id: -1,
  title: "",
  tag_list: [],
  done: false,
  dueDate: null,
};
function TodosContainer(Props: ContainerProps) {
  const classes = useStyles();
  const [selectedItem, setSelectedItem] = useState<Todo>(initialState);

  /**
   * Description: Change the selected item when the user clicks on the items
   * @param id
   * @param title
   * @param tags
   * @param date
   */
  function handleToggleItem(
    id: number,
    title: string,
    tags: string[],
    date: Date | null
  ) {
    setSelectedItem((prevState) => ({
      ...prevState,
      id: id,
      title: title,
      tag_list: tags,
      dueDate: date,
    }));
  }

  /**
   * Description: Update the todo attributes(title, tags and duedate) when the user changes it.
   * @param data
   * @param id
   */
  function editTodo(data: NewTodo, id: number) {
    setSelectedItem((prevState) => ({
      ...prevState,
      title: data.title,
      tag_list: data.tag_list,
      dueDate: data.date,
    }));
    Props.editTodo(
      { title: data.title, tag_list: data.tag_list, date: data.date },
      id
    );
  }

  /**
   * Description: Update the todo when user checks/unchecks the box.
   * @param e
   * @param id
   * @param title
   * @param tags
   */
  function toggleTodo(
    e: ChangeEvent<HTMLInputElement>,
    id: number,
    title: string,
    tags: string[]
  ) {
    Props.toggleTodo(e, id);
    setSelectedItem((prevState) => ({
      ...prevState,
      id: id,
      title: title,
      tag_list: tags,
    }));
  }

  /**
   * Description: Delete the selected todos.
   */
  function deleteTodo() {
    Props.deleteTodo();
    setSelectedItem((prevState) => ({
      ...prevState,
      id: -1,
    }));
  }

  useEffect(() => {
    setSelectedItem((prevState) => ({
      ...prevState,
      id: Props.newItem.id,
      title: Props.newItem.title,
      tag_list: Props.newItem.tag_list,
      dueDate: Props.newItem.dueDate,
    }));
  }, [Props.newItem]);

  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={6}
        style={{ borderRight: "0.1em solid grey", padding: "0.5em" }}
      >
        <Grid item>
          <Divider />
        </Grid>
        <div className={classes.margin}>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item style={{ maxWidth: 60 }}>
              <AddIcon />
            </Grid>
            <Grid item xs>
              <TextField
                id="input"
                label="Add a Task"
                onKeyPress={Props.createTodo}
                onChange={Props.InputChange}
                value={Props.inputValue}
                fullWidth={true}
                inputProps={{ maxLength: 50 }}
                multiline
              />
            </Grid>
          </Grid>
        </div>
        <Grid container justify="flex-end">
          <Button
            color="primary"
            disabled={Props.checkedLen === 0}
            variant="contained"
            onClick={deleteTodo}
          >
            Delete Selected Tasks
          </Button>
        </Grid>
        {Props.todos.map((todo) => {
          const labelId = `checkbox-list-label-${todo.id}`;
          return (
            <ListItem
              key={todo.id}
              button
              onClick={() =>
                handleToggleItem(
                  todo.id,
                  todo.title,
                  todo.tag_list,
                  todo.dueDate
                )
              }
              selected={selectedItem.id === todo.id}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  onChange={(e) =>
                    toggleTodo(e, todo.id, todo.title, todo.tag_list)
                  }
                  color="primary"
                  checked={todo.done}
                />
              </ListItemIcon>
              {todo.done ? (
                <del>
                  <ListItemText
                    id={labelId}
                    primary={todo.title}
                    style={{ wordWrap: "break-word" }}
                  />
                </del>
              ) : (
                <ListItemText
                  id={labelId}
                  primary={todo.title}
                  style={{ wordWrap: "break-word" }}
                />
              )}
            </ListItem>
          );
        })}
      </Grid>

      <Grid item xs={6}>
        <EditForm
          editTodo={editTodo}
          tags={Props.tags}
          selectedItem={selectedItem}
        />
      </Grid>
    </Grid>
  );
}

export default TodosContainer;
