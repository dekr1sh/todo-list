const defaultDataId = 0;
let dataId = +localStorage.getItem("currentDataId") || defaultDataId;

function getDataId() {
    return dataId;
}

function increaseDataId() {
    dataId++;
}

function createTask(dataProject, dataId, title, details, date, important = false, completed = false) {
    return { dataProject, dataId, title, details, date, important, completed };
}


export {getDataId, increaseDataId, createTask};