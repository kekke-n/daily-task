import { useState } from "react";

export const usePlan = () => {
  const [plan, setPlan] = useState(JSON.parse(localStorage.getItem("plan")) ?? [])

  return {
    plan,
    setPlan
  }
}