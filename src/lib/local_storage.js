
export const updateLocalStorage = (newPlan, newPlanKey) => {
  console.log(`updateLocalStorage`)
  if(newPlan) {
    localStorage.setItem("plan", JSON.stringify(newPlan))
  }
  console.log(`newPlan : ${newPlan}`)
  console.log(`newPlanKey : ${newPlanKey}`)
  if(newPlanKey) {
    localStorage.setItem("planKey", newPlanKey)
  }
}
