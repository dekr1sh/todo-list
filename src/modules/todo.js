export const createTodo = (title, description = '', dueDate, important = false, completed = false) => {
    return { title, description, dueDate, important, completed };
};

export const toggleImportant = (todo) => {
    todo.important = !todo.important;
};

export const toggleComplete = (todo) => {
    todo.completed = !todo.completed;
};

export const updateTodo = (todo, updates) => {
    Object.assign(todo, updates);
};

export const deleteTodo = (project, todo) => {
    const index = project.todos.indexOf(todo);
    if (index > -1) {
        project.todos.splice(index, 1);
    }
};