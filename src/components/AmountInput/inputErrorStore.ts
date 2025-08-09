type ACTION_TYPES =
  | {
      type: "showNanError";
    }
  | { type: "hideNanError" }
  | { type: "showLengthError" }
  | { type: "hideLengthError" }
  | { type: "hideAllErrors" };

type ErrorMessageContainer = {
  [key: string]: string;
};

export const errorMessages: ErrorMessageContainer = {
  notANumber: "Invalid input, please enter a number",
  tooLong: "Entered number must be less than 10 symbols long",
};

interface ErrorState {
  notANumber: boolean;
  tooLong: boolean;
}

function errorReducer(state: ErrorState, action: ACTION_TYPES) {
  switch (action.type) {
    case "hideAllErrors":
      return {
        notANumber: false,
        tooLong: false,
      };
    case "showNanError":
      return {
        ...state,
        notANumber: true,
      };
    case "hideNanError":
      return {
        ...state,
        notANumber: false,
      };
    case "showLengthError":
      return {
        ...state,
        tooLong: true,
      };
    case "hideLengthError":
      return {
        ...state,
        tooLong: false,
      };
    default:
      throw new Error("Unknown action type");
  }
}

export default errorReducer;
