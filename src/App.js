import "./styles.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  REMOVE_DIGIT: "remove-digit",
  CLEAR: "clear",
  EVALUATE: "evaluate",
  CHOOSE_OPERATION: "choose_operation"
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
});

function FormatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: `${payload.digit}`,
          overwrite: false
        };
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          Operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        };
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          Operation: payload.operation
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        Operation: payload.operation,
        currentOperand: null
      };
    case ACTIONS.EVALUATE:
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.Operation == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        previousOperand: null,
        Operation: null
      };

    case ACTIONS.REMOVE_DIGIT:
      if (state.currentOperand == null) {
        return state;
      }
      if (state.overwrite) {
        return {};
      }
      return {
        ...state,
        currentOperand: state.currentOperand.substring(
          0,
          state.currentOperand.length - 1
        )
      };

    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, Operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  console.log(Operation);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (Operation) {
    case "*":
      computation = prev * current;
      break;
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "÷":
      computation = prev / current;
      break;
    default:
      computation = prev * current;
  }
  return computation.toString();
}

export default function App() {
  const [{ previousOperand, currentOperand, Operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="App">
      <div className="output">
        <div className="first_value">
          {FormatOperand(previousOperand)}
          {Operation}
        </div>
        <div className="second_value">{FormatOperand(currentOperand)}</div>
      </div>
      <button
        className="button spanTwo"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button
        className="button"
        onClick={() => {
          dispatch({ type: ACTIONS.REMOVE_DIGIT });
        }}
      >
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <button
        className="button spanTwo"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}
