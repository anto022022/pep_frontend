import { Step } from "../_models/StoreFront";

const useStepperStatus = <T extends Record<string, string>>(
  stepper: Step[],
  currentStepperStatus: T
) => {
  return stepper.map((section) => {
    if (section.children) {
      const updatedChildren = section.children.map((child) => ({
        ...child,
        status: currentStepperStatus[child.value as keyof T] || child.status,
      }));

      return {
        ...section,
        children: updatedChildren,
        status: updatedChildren.every((child) => child.status === "completed")
          ? "completed"
          : updatedChildren.some((child) => child.status === "active")
          ? "active"
          : "pending",
      };
    }
    return {
      ...section,
      status:
        section.value !== undefined
          ? currentStepperStatus[section.value as keyof T] || section.status
          : section.status,
    };
  });
};

export default useStepperStatus;
