import {
  BuyerUserModel,
  RegisteredUserModel,
  UnRegisteredUserModel,
} from "../_models/onBoardingStages";
import { setStepperData } from "../_store/reducers/onboarding_store";
import { useAppDispatch } from "../_store/store";

export default function useStepperData() {
  const dispatch = useAppDispatch();

  const getModel = (businessType: string) => {
    switch (businessType) {
      case "unregister":
        return UnRegisteredUserModel;
      case "register":
        return RegisteredUserModel;
      case "nonprofit":
        return RegisteredUserModel;
      case "buyer":
        return BuyerUserModel;
      default:
        return RegisteredUserModel;
    }
  };

  const getStepperData = (stepperData: any, businessType: string): void => {
    const model = getModel(businessType);

    const updatedStepper = model.map((step: any) => ({
      ...step,
      [step.enum]: stepperData.hasOwnProperty(step.enum)
        ? stepperData[step.enum]
        : step[step.enum],
    }));
    dispatch(setStepperData(updatedStepper));
  };

  return { getStepperData };
}
