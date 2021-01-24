export type Todo = {
    id: number;
    title: string;
    done: boolean;
    tag_list: string[];
    dueDate: Date |null
}; 

export type NewTodo = {
    title: string;
    tag_list: string[];
    date: Date | null;
}; 

export type Tag = {
    id: number;
    name: string;
    taggings_count: number;
};
