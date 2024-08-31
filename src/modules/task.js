const createTask = (title, details, date, important = false, completed = false) => {
    return { title, details, date, important, completed };
};

const toggleImportant = (task) => {
    task.important = !task.important;
};

const toggleComplete = (task) => {
    task.completed = !task.completed;
};

const editTask = (task, updates) => {
    Object.assign(task, updates);
};

const deleteTask = (project, task) => {
    const index = project.tasks.indexOf(task);
    if (index !== -1) {
        project.tasks.splice(index, 1);
    }
};

export {createTask, toggleImportant, toggleComplete, editTask, deleteTask};