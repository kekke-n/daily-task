import { useState } from "react";
import { updateLocalStorage } from "../lib/local_storage";

const SQUARE_HEIGHT = 80
const UNIT_NUM_IN_SQUARE = 4
const UNIT_HEIGHT = SQUARE_HEIGHT / UNIT_NUM_IN_SQUARE
const UNIT_MINUTES = 60 / UNIT_NUM_IN_SQUARE

export const useTask = () => {
  const [plan, setPlan] = useState(JSON.parse(localStorage.getItem("plan")) ?? [])
  const [planKey, setPlanKey] = useState(localStorage.getItem("planKey") ?? 0)

  const createPlan = (startHour, endHour) => {
    const updatedPlan = plan.slice(0)
    updatedPlan.push(
      {
        key: planKey.toString(),
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
    setPlan(updatedPlan)
    setPlanKey(Number(planKey) + 1)
    updateLocalStorage(updatedPlan, Number(planKey) + 1);
  }

  const updatePlan =
    (planKey, startHour, endHour, startMinute, endMinute, minutes, hours, description) => {
      const updatedPlan = plan.slice(0).map(p => {
        if(p.key === planKey){
          p.startHour = startHour
          p.endHour = endHour
          p.startMinute = startMinute
          p.endMinute = endMinute
          p.minutes = minutes
          p.hours = hours
          if(description !== ''){
            plan.description = description
          }
        }
        return p
      })
      setPlan(updatedPlan)
      updateLocalStorage(updatedPlan);
    }

  const deletePlan = (planKey) => {
    const updatedPlan = plan.slice(0).filter((p) => {
      return Number(p.key) !== Number(planKey)
    })
    setPlan(updatedPlan)
    updateLocalStorage(updatedPlan);
  }


  const calculatePlanTime = (height, postition) => {
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
    plan,
    setPlan,
    createPlan,
    updatePlan,
    deletePlan,
    calculatePlanTime
  }
}