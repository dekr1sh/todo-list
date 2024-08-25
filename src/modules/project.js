export const createProject = (name) => {
    return { name, todos: [] };
};

export const addTodoToProject = (project, todo) => {
    project.todos.push(todo);
};