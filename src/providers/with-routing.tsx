import { BrowserRouter } from "react-router";

export const witRouting = (component: () => React.ReactNode) => () => {
  return <BrowserRouter>{component()}</BrowserRouter>;
};
