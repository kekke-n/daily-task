
export const updateLocalStorage = (newTask, newTaskKey) => {
  if(newTask) {
    localStorage.setItem("task", JSON.stringify(newTask))
  }
  if(newTaskKey) {
    localStorage.setItem("taskKey", newTaskKey)
  }
}
