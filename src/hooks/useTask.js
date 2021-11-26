import { useState } from "react";
import { updateLocalStorage } from "../lib/local_storage";

const SQUARE_HEIGHT = 80
const UNIT_NUM_IN_SQUARE = 4
const UNIT_HEIGHT = SQUARE_HEIGHT / UNIT_NUM_IN_SQUARE
const UNIT_MINUTES = 60 / UNIT_NUM_IN_SQUARE

export const useTask = () => {
  const [task, setTask] = useState(JSON.parse(localStorage.getItem("task")) ?? [])
  const [taskKey, setTaskKey] = useState(localStorage.getItem("taskKey") ?? 0)

  const createTask = (startHour, endHour) => {
    const updatedTask = task.slice(0)
    updatedTask.push(
      {
        key: taskKey.toString(),
        done: false,
        description: '',
        startHour:  startHour,
        endHour:  endHour,
        startMinute:  0,
        endMinute:  0,
        minutes: 60,
        hours: 1,
      }
    )
    setTask(updatedTask)
    setTaskKey(Number(taskKey) + 1)
    updateLocalStorage(updatedTask, Number(taskKey) + 1);
  }

  const updateTask =
    (taskKey, startHour, endHour, startMinute, endMinute, minutes, hours, description) => {
      const updatedTask = task.slice(0).map(p => {
        if(p.key === taskKey){
          p.startHour = startHour
          p.endHour = endHour
          p.startMinute = startMinute
          p.endMinute = endMinute
          p.minutes = minutes
          p.hours = hours
          if(description !== ''){
            task.description = description
          }
        }
        return p
      })
      setTask(updatedTask)
      updateLocalStorage(updatedTask);
    }

  const deleteTask = (taskKey) => {
    const updatedTask = task.slice(0).filter((p) => {
      return Number(p.key) !== Number(taskKey)
    })
    setTask(updatedTask)
    updateLocalStorage(updatedTask);
  }


  const calculateTaskTime = (height, postition) => {
    const unit = height / UNIT_HEIGHT
    const minutes = (unit * UNIT_HEIGHT) / SQUARE_HEIGHT * 60
    const startHour = Math.floor(Math.round((postition / SQUARE_HEIGHT)* 10) / 10)
    const startMinute = (Math.round((postition % SQUARE_HEIGHT) / UNIT_HEIGHT ) * UNIT_MINUTES) % 60
    const endHour = startHour + Math.floor((startMinute + minutes) / 60)
    const endMinute = (startMinute + minutes) % 60

    return {
      startHour: startHour,
      endHour: endHour,
      startMinute: startMinute,
      endMinute: endMinute,
      minutes: minutes,
      hours: minutes / 60,
    }
  }

  return {
    task,
    setTask,
    createTask,
    updateTask,
    deleteTask,
    calculateTaskTime
  }
}