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
import EditForm from "./EditTodo";

interface Todo {
  id: number;
  title: string;
  done: boolean;
  tag_list: string[];
}
interface NewTodo {
  title: string;
  tag_list: string[];
}
interface TodoNew {
  title: string;
  tag_list: string;
}
interface Tag {
  id: number;
  name: string;
  taggings_count: number;
}

interface ContainerProps {
  todos: Todo[];
  inputValue: string;
  tags: Tag[];
  checkedLen: number;
  newItem: Todo;
  InputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  createTodo: (e: KeyboardEvent<HTMLInputElement>) => void;
  updateTodo: (e: ChangeEvent<HTMLInputElement>, id: number) => void;
  deleteTodo: () => void;
  editTodo: (data: TodoNew, id: number) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
  })
);

function TodosContainer(Props: ContainerProps) {
  const classes = useStyles();
  const [selectedId, setSelectedId] = useState(-1);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedTag, setSelectedTags] = useState<string[]>([]);

  function handleToggle(id: number, title: string, tags: string[]) {
    setSelectedId(id);
    setSelectedTitle(title);
    setSelectedTags(tags);
  }
  function editTodo(data: NewTodo, id: number) {
    setSelectedTitle(data.title);
    setSelectedTags(data.tag_list);
    Props.editTodo(
      { title: data.title, tag_list: data.tag_list.join(",") },
      id
    );
  }
  function updateTodo(
    e: ChangeEvent<HTMLInputElement>,
    id: number,
    title: string,
    tags: string[]
  ) {
    Props.updateTodo(e, id);
    setSelectedId(id);
    setSelectedTitle(title);
    setSelectedTags(tags);
  }
  function deleteTodo() {
    Props.deleteTodo();
    setSelectedId(-1);
  }
  useEffect(() => {
    if (Props.newItem.id !== 0) {
      setSelectedId(Props.newItem.id);
      setSelectedTags(Props.newItem.tag_list);
      setSelectedTitle(Props.newItem.title);
    }
  }, [Props.newItem]);

  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={6}
        style={{ borderRight: "0.1em solid grey", padding: "0.5em" }}
      >
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
              onClick={() => handleToggle(todo.id, todo.title, todo.tag_list)}
              selected={selectedId === todo.id}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  onChange={(e) =>
                    updateTodo(e, todo.id, todo.title, todo.tag_list)
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
          ItemId={selectedId}
          ItemTitle={selectedTitle}
          ItemTags={selectedTag}
        />
      </Grid>
    </Grid>
  );
}

export default TodosContainer;
