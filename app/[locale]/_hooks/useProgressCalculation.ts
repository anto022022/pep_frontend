
const useProgressCalculation = <T extends Record<string, string>>(currentStepperStatus: T) => {
    const totalSteps = Object.keys(currentStepperStatus).length;
    if (totalSteps === 0) return 0; // Prevent division by zero
    const totalCompletedSteps = Object.values(currentStepperStatus).filter(value => value === "completed").length;
    return Math.floor((totalCompletedSteps / totalSteps) * 100);
}

export default useProgressCalculation