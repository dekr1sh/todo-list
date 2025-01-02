interface Task {
    dataProject: number;
    dataId: number;
    title: string;
    details: string;
    date: string;
    important: boolean;
    completed: boolean;
}

const defaultDataId = 5;
let dataId = +(localStorage.getItem("currentDataId") || defaultDataId);

function getDataId() {
    return dataId;
}

function increaseDataId() {
    dataId++;
}

function createTask(dataProject: number, dataId: number, title: string, details: string, date: string, important: boolean = false, completed: boolean = false): Task {
    return { dataProject, dataId, title, details, date, important, completed };
}


export {Task, getDataId, increaseDataId, createTask};