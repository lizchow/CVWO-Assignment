import React, { useState, useEffect, ChangeEvent } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import axios from "axios";
import update from "immutability-helper";
import "./App.css";
import NavBar from "./components/NavBar";
import TodosContainer from "./components/TodoContainer";
import EditTagName from "./components/EditTagName";
import clsx from "clsx";
import { Todo, NewTodo, Tag } from "./Types";

interface changeTag {
  tag_name: string;
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
const initialState: Todo = {
  id: -1,
  title: "",
  done: false,
  tag_list: [],
  dueDate: null,
};
function App() {
  const classes = useStyles();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [totalLen, setTotalLen] = useState(0);
  const [tags, setTags] = useState<Tag[]>([]);

  const [open, setOpen] = React.useState(false);
  const [checkedItem, setCheckedItem] = useState<number[]>([]);
  const [newItem, setNewItem] = useState<Todo>(initialState);
  const [selectedTag, setSelectedTag] = useState({ id: -1, name: "All Tasks" });
  const [isQuery, setIsQuery] = useState(false);
  const [tagError, setTagError] = useState(false);
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
        setCheckedItem(
          res.data
            .filter((todo: Todo) => todo.done)
            .map((todo: Todo) => todo.id)
        );
        setTotalLen(res.data.length);
        setNewItem((prevState) => ({
          ...prevState,
          initialState,
        }));
      })
      .catch((error) => console.log(error));
  }

  function getTags() {
    axios
      .get("/api/v1/tags")
      .then((res) => {
        setTags(res.data);
      })
      .catch((error) => console.log(error));
  }
  function getSelectedTag(tag_id: number, tag_name: string) {
    setIsQuery(false);
    setTagError(false);
    setNewItem((prevState) => ({
      ...prevState,
      id: initialState.id,
      title: initialState.title,
      done: initialState.done,
      tag_list: initialState.tag_list,
      dueDate: initialState.dueDate,
    }));
    if (tag_id >= 0) {
      setSelectedTag({ id: tag_id, name: tag_name });
      axios
        .get(`/api/v1/tags/${tag_id}`)
        .then((res) => {
          setTodos(res.data);
          setCheckedItem(
            res.data
              .filter((todo: Todo) => todo.done)
              .map((todo: Todo) => todo.id)
          );
        })
        .catch((error) => console.log(error));
    } else {
      setSelectedTag({ id: -1, name: "All Tasks" });
      getTodos();
    }
  }

  function createTodo(title: string) {
    axios
      .post("/api/v1/todos", {
        todo: {
          title: title,
          done: false,
          tag_list: selectedTag.id >= 0 ? selectedTag.name : "",
        },
      })
      .then((res) => {
        if (!res.data.error){
          setNewItem((prevState) => ({
            ...prevState,
            id: res.data.id,
            title: res.data.title,
            done: res.data.done,
            tag_list: res.data.tag_list,
            dueDate: res.data.dueDate,
          }));
          const newTodos = update(todos, { $splice: [[0, 0, res.data]] });
          setTodos(newTodos);
          setTotalLen((prevState) => prevState + 1);
        }
        
      })
      .catch((error) => console.log(error));
  }

  function toggleTodo(e: ChangeEvent<HTMLInputElement>, id: number) {
    const target = e.target as HTMLInputElement;
    axios
      .put(`/api/v1/todos/${id}`, { todo: { done: target.checked } })
      .then((res) => {
        const todoIndex = todos.findIndex((x) => x.id === res.data.id);
        const checkIndex = checkedItem.findIndex((x) => x === res.data.id);
        const newTodos = update(todos, {
          [todoIndex]: { $set: res.data },
        });
        setTodos(newTodos);
        const newChecked = res.data.done
          ? update(checkedItem, { $splice: [[0, 0, res.data.id]] })
          : update(checkedItem, { $splice: [[checkIndex, 1]] });
        setCheckedItem(newChecked);
      })
      .catch((error) => console.log(error));
  }
  function editTodo(data: NewTodo, id: number) {
    axios
      .put(`/api/v1/todos/${id}`, {
        todo: {
          title: data.title,
          tag_list: data.tag_list.join(","),
          dueDate: data.date,
        },
      })
      .then((res) => {
        const todoIndex = todos.findIndex((x) => x.id === res.data.id);
        if (
          !res.data.tag_list.includes(selectedTag.name) &&
          selectedTag.id !== -1
        ) {
          const newTodos = update(todos, { $splice: [[todoIndex, 1]] });
          setTodos(newTodos);
        } else {
          const newTodos = update(todos, {
            [todoIndex]: { $set: res.data },
          });
          setTodos(newTodos);
        }
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
    setTotalLen((prevState) => prevState - checkedItem.length);
    checkedItem.map((todo_id) => {
      return axios
        .delete(`/api/v1/todos/${todo_id}`)
        .then(() => {})
        .catch((error) => console.log(error));
    });
    const newTodos = multisplice(todos, checkedItem);
    setTodos(newTodos);
    
    setCheckedItem([]);
  }
  function updateTag(data: changeTag) {
    //console.log(data);
    axios
      .put(`/api/v1/tags/${selectedTag.id}`, {
        tag: { name: data.tag_name.trim() },
      })
      .then((res) => {
        if (res.data.error){
          setTagError(true);
        }
        else {
          setTagError(false);
          const tagIndex = tags.findIndex((x) => x.id === res.data.id);
          const newTags = update(tags, {
            [tagIndex]: { $set: res.data },
          });
          setTags(newTags);
        }
      })
      .catch((error) => console.log(error));
  }
  function deleteTag(id: number) {
    axios
      .delete(`/api/v1/tags/${id}`)
      .then(() => {
        setSelectedTag({ id: -1, name: "" });
        setNewItem((prevState) => ({
          ...prevState,
          initialState,
        }));
        const tagIndex = tags.findIndex((x) => x.id === id);
        const newTags = update(tags, { $splice: [[tagIndex, 1]] });
        setTags(newTags);
        getTodos();
      })
      .catch((err) => console.log(err));
  }
  function searchTodos(query: string) {
    setSelectedTag((prevState) => ({
      ...prevState,
      id: -2,
      name: "Search Query: " + query,
    }));
    axios
      .get(`/api/v1/todos`)
      .then((res) => {
        const filterQuery = query.replace(/\s/g, "").toLowerCase();
        const filteredTodos: Todo[] = res.data.filter((todo: Todo) =>
          todo.title.replace(/\s/g, "").toLowerCase().includes(filterQuery)
        );
        setTodos(filteredTodos);
        setSelectedTag((prevState) => ({
          ...prevState,
          id: -2,
          name: "Search Query: " + query,
        }));
        setCheckedItem(
          filteredTodos
            .filter((todo: Todo) => todo.done)
            .map((todo: Todo) => todo.id)
        );
        setIsQuery(true);
      })
      .catch((err) => {
        console.log(err);
      });
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
        defLen={totalLen}
        searchTodos={searchTodos}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
        getSelectedTag={getSelectedTag}
      />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <EditTagName
          selectedTag={selectedTag}
          updateTag={updateTag}
          deleteTag={deleteTag}
          tagError={tagError}
        />
        <TodosContainer
          todos={todos}
          tags={tags}
          checkedLen={checkedItem.length}
          newItem={newItem}
          isQuery={isQuery}
          createTodo={createTodo}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
          editTodo={editTodo}
        />
      </main>
    </div>
  );
}

export default App;
