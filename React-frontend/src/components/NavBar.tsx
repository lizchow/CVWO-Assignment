import React, { KeyboardEvent, ChangeEvent, useEffect, useState } from "react";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
  fade,
} from "@material-ui/core/styles";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import Button from "@material-ui/core/Button";
import { Tag } from "../Types";

interface ContainerProps {
  tags: Tag[];
  open: boolean;
  defLen: number;
  getSelectedTag: (tag_id: number, tag_name: string) => void;
  searchTodos: (query: string) => void;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
}
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "40ch",
      },
    },
  })
);
function NavBar(Props: ContainerProps) {
  const classes = useStyles();
  const theme = useTheme();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");

  const handleListItemClick = (index: number, tag_name: string) => {
    setSelectedIndex(index);
    Props.getSelectedTag(index, tag_name);
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setSearchQuery(target.value);
  };

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      setSearchQuery("");
      setSelectedIndex(-2);
      Props.searchTodos(searchQuery);
    }
  };

  useEffect(() => {}, [Props.tags]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: Props.open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={Props.handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, Props.open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleListItemClick(-1, "")}
            startIcon={<HomeRoundedIcon />}
            size="large"
            disableElevation
            style={{textTransform: 'none'}}
          >
            <Typography variant="h4" noWrap>
            Todo App
          </Typography>
          </Button>
          
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={handleQueryChange}
              onKeyPress={handleSearch}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={Props.open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={Props.handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {["All Tasks"].map((text) => (
            <ListItem
              button
              key={text}
              selected={selectedIndex === -1}
              onClick={() => handleListItemClick(-1, "")}
            >
              <ListItemText primary={text} />
              <ListItemSecondaryAction>{Props.defLen}</ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {Props.tags.map((tag) => (
            <ListItem
              button
              key={tag.name}
              selected={selectedIndex === tag.id}
              onClick={() => handleListItemClick(tag.id, tag.name)}
            >
              <ListItemText primary={tag.name} />
              <ListItemSecondaryAction>
                {tag.taggings_count}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}

export default NavBar;
