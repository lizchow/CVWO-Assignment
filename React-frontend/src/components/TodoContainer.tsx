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
import EventIcon from "@material-ui/icons/Event";
import Chip from "@material-ui/core/Chip";
import { ListItemSecondaryAction } from "@material-ui/core";

interface ContainerProps {
  todos: Todo[];
  tags: Tag[];
  checkedLen: number;
  newItem: Todo;
  isQuery: boolean;
  createTodo: (title: string) => void;
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
  const [inputValue, setInputValue] = useState("");
  function createTodo(e: KeyboardEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    if (e.key === "Enter" && target.value.trim() !== "") {
      setInputValue("");
      Props.createTodo(target.value.trim());
    }
  }
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  }
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
    Props.editTodo(data, id);
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

  /**
   * Description: Check whether the param date is past the current date
   * @param date
   */
  function isDue(date: Date) {
    var currentDate = new Date().setHours(0, 0, 0, 0);
    var todoDate = new Date(date).setHours(0, 0, 0, 0);
    return todoDate < currentDate;
  }

  useEffect(() => {
    setSelectedItem((prevState) => ({
      ...prevState,
      id: Props.newItem.id,
      title: Props.newItem.title,
      tag_list: Props.newItem.tag_list,
      dueDate: Props.newItem.dueDate,
    }));
  }, [Props.newItem, Props.isQuery]);

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
        {!Props.isQuery ? (
          <div className={classes.margin}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item style={{ maxWidth: 60 }}>
                <AddIcon />
              </Grid>
              <Grid item xs>
                <TextField
                  id="input"
                  label="Add a Task"
                  onKeyPress={createTodo}
                  onChange={handleChange}
                  value={inputValue}
                  fullWidth={true}
                  inputProps={{ maxLength: 50 }}
                  multiline
                />
              </Grid>
            </Grid>
          </div>
        ) : (
          <div></div>
        )}

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
        {Props.todos.length === 0 ? (
          <h1>No items found</h1>
        ) : (
          Props.todos.map((todo) => {
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
                ContainerComponent="div"
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
                <ListItemSecondaryAction>
                  {todo.dueDate ? (
                    <Chip
                      variant="outlined"
                      icon={<EventIcon />}
                      color={isDue(todo.dueDate) ? "secondary" : "primary"}
                      label={todo.dueDate}
                    />
                  ) : (
                    <div></div>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            );
          })
        )}
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
