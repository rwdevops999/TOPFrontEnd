import { PropsWithChildren } from "react";
import AuthProvider from "./AuthProvider";
import DebugProvider from "./DebugProvider";
import { SnackbarProvider } from "notistack";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <DebugProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </DebugProvider>
    </AuthProvider>
  );
};

export default Providers;
