import { toast } from "react-toastify";

const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
};

export function notifyCreated(label = "Item") {
  toast.success(`${label} created successfully`, defaultOptions);
}

export function notifyUpdated(label = "Item") {
  toast.success(`${label} updated successfully`, defaultOptions);
}

export function notifyDeleted(label = "Item") {
  toast.success(`${label} deleted successfully`, defaultOptions);
}

export function notifySuccess(message) {
  toast.success(message, defaultOptions);
}

export function notifyError(message) {
  toast.error(message, defaultOptions);
}
