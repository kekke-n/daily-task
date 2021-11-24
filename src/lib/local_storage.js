
export const updateLocalStorage = (newPlan, newPlanKey) => {
  if(newPlan) {
    localStorage.setItem("plan", JSON.stringify(newPlan))
  }
  if(newPlanKey) {
    localStorage.setItem("planKey", newPlanKey)
  }
}
