import { Toaster as Sonner } from "sonner";

export const withSonner = (component: () => React.ReactNode) => () => {
  return (
    <>
      {component()}
      <Sonner />
    </>
  );
};
