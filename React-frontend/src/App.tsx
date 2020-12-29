import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import axios from "axios";
import update from "immutability-helper";
import "./App.css";
import NavBar from "./components/NavBar";
import TodosContainer from "./components/TodoContainer";
import clsx from "clsx";

interface Todo {
  id: number;
  title: string;
  done: boolean;
  tag_list: string[];
}
interface NewTodo {
  title: string;
  tag_list: string;
}
interface Tag {
  id: number;
  name: string;
  taggings_count: number;
}
const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
);

function App() {
  const classes = useStyles();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = useState<number[]>([]);
  const [checkedLen, setCheckedLen] = useState(0);
  const [newItem, setNewItem] = useState<Todo>({
    id: 0,
    title: "",
    done: false,
    tag_list: [],
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function getTodos() {
    axios
      .get("/api/v1/todos")
      .then((res) => {
        setTodos(res.data);
        setChecked(
          res.data
            .filter((todo: Todo) => todo.done)
            .map((todo: Todo) => todo.id)
        );
        setCheckedLen(checked.length);
      })
      .catch((error) => console.log(error));
  }
  function getTags() {
    axios
      .get("/api/v1/tags")
      .then((res) => {
        const newTags = res.data.filter((tag: Tag) => tag.taggings_count !== 0);
        setTags(newTags);
      })
      .catch((error) => console.log(error));
  }
  function getSelectedCategory(cat_id: number) {
    if (cat_id !== 0) {
      axios
        .get(`/api/v1/tags/${cat_id - 1}`)
        .then((res) => {
          setTodos(res.data);
        })
        .catch((error) => console.log(error));
    } else {
      getTodos();
    }
  }

  function createTodo(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;

      axios
        .post("/api/v1/todos", { todo: { title: target.value, done: false } })
        .then((res) => {
          setNewItem(res.data);
          const newTodos = update(todos, { $splice: [[0, 0, res.data]] });
          setTodos(newTodos);
          setInputValue("");
        })
        .catch((error) => console.log(error));
    }
  }
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  }
  function updateTodo(e: ChangeEvent<HTMLInputElement>, id: number) {
    const target = e.target as HTMLInputElement;
    axios
      .put(`/api/v1/todos/${id}`, { todo: { done: target.checked } })
      .then((res) => {
        const todoIndex = todos.findIndex((x) => x.id === res.data.id);
        const checkIndex = checked.findIndex((x) => x === res.data.id);
        const newTodos = update(todos, {
          [todoIndex]: { $set: res.data },
        });
        setTodos(newTodos);
        const newChecked = res.data.done
          ? update(checked, { $splice: [[0, 0, res.data.id]] })
          : update(checked, { $splice: [[checkIndex, 1]] });
        setCheckedLen(res.data.done ? checkedLen + 1 : checkedLen - 1);
        setChecked(newChecked);
      })
      .catch((error) => console.log(error));
  }
  function editTodo(data: NewTodo, id: number) {
    axios
      .put(`/api/v1/todos/${id}`, {
        todo: { title: data.title, tag_list: data.tag_list },
      })
      .then((res) => {
        const todoIndex = todos.findIndex((x) => x.id === res.data.id);
        const newTodos = update(todos, {
          [todoIndex]: { $set: res.data },
        });
        setTodos(newTodos);
        getTags();
      })
      .catch((error) => console.log(error));
  }
  function multisplice(arr: Todo[], id_list: number[]): Todo[] {
    if (id_list.length === 0) {
      return arr;
    } else {
      const current_id = id_list.pop();
      const index = arr.findIndex((x) => x.id === current_id);
      const newArr = update(arr, { $splice: [[index, 1]] });
      return multisplice(newArr, id_list);
    }
  }
  function deleteTodo() {
    console.log(checked);
    checked.map((todo_id) => {
      axios
        .delete(`/api/v1/todos/${todo_id}`)
        .then(() => {})
        .catch((error) => console.log(error));
    });
    const newTodos = multisplice(todos, checked);
    setTodos(newTodos);
    setChecked([]);
    setCheckedLen(0);
  }

  useEffect(() => {
    getTodos();
    getTags();
  }, []);

  return (
    <div className={classes.root}>
      <NavBar
        tags={tags}
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
        getSelectedCategory={getSelectedCategory}
      />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <TodosContainer
          todos={todos}
          tags={tags}
          inputValue={inputValue}
          checkedLen={checkedLen}
          newItem={newItem}
          InputChange={handleChange}
          createTodo={createTodo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          editTodo={editTodo}
        />
      </main>
    </div>
  );
}

export default App;
