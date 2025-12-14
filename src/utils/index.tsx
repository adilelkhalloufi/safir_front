import { CONFIG } from "@/CONFIG";
import { AxiosError } from "axios";
import { toast as sonnerToast } from "sonner";

// export const API_URL = `https://oapi.adev.ma/api`;
export const API_URL = `http://127.0.0.1:8000/api`;

export enum NotificationType {
  ERROR = "error",
  SUCCESS = "success",
}

// Create a toast function that works outside of React components
const showToast = (message: string, type: NotificationType, description?: string) => {
  // Use sonnerToast for now as a fallback since useToast requires React context
  sonnerToast[type](message, {
    description: description,
  });
};

export const setPageTitle = (title: string) => {
  window.document.title = title;
};

export const showNotification = (
  message = "Something went wrong",
  type: NotificationType = NotificationType.ERROR,
  description?: string
) => {
  showToast(message, type, description);
};

export const handleErrorResponse = (
  error: any,
  callback?: () => void,
  errorMessage?: string
) => {
  if (!errorMessage) {
    errorMessage = "Something went wrong";

    if (typeof error === "string") {
      try {
        error = JSON.parse(error);
      } catch (error) {
        // do nothing
        console.log("error", error);
      }
    }

    if (error instanceof AxiosError) {
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }
  }

  const formattedMessage = errorMessage &&
    errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);

  // Use sonnerToast directly for immediate visual feedback
  sonnerToast.error(formattedMessage);

  if (callback) {
    return callback();
  }
};

export function isExpressionValid(expression: string, variables: any) {
  if (!variables) {
    console.log("No variables found");

    return false; // No variables found
  }

  try {
    // Try to replace each variable with 1 to see if the expression is valid
    let expressionWithNumbers: any = expression;

    variables.forEach((variable: any) => {
      expressionWithNumbers = expressionWithNumbers.replaceAll(
        "{" + variable + "}",
        "1"
      );
    });

    eval(expressionWithNumbers); // This will throw an error if the expression is invalid
  } catch (error) {
    console.log("error isExpressionValid");

    return false; // Expression is invalid
  }

  return true; // Expression is valid
}

export function extractVariables(expression: string) {
  const variables = [];
  const regex = /{([\w]+?)}/g;
  let match;
  while ((match = regex.exec(expression)) !== null) {
    variables.push(match[1]);
  }
  return variables;
}

export function calculateTotal(valueOne: number, valueTwo: number, operation = '*') {
  let result: number;

  switch (operation) {
    case '+':
      result = valueOne + valueTwo;
      break;
    case '-':
      result = valueOne - valueTwo;
      break;
    case '*':
      result = valueOne * valueTwo;
      break;
    case '/':
      if (valueTwo === 0) {
        throw new Error('Division by zero is not allowed.');
      }
      result = valueOne / valueTwo;
      break;
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }

  return FormatPrice(result);
}

export function FormatPrice(value: any) {

  return parseFloat(value).toFixed(2) + " " + CONFIG.CURRENCY_SYMBOL;
}
