import { env } from "@/lib/env";
import { notFound } from "next/navigation";

interface FeatureRouteProps {
  children: React.ReactNode;
  type?: "login" | "register";
}

const FeatureRoute = ({ children, type }: FeatureRouteProps) => {
  const { enableLogin, enableRegister } = env.features;

  // If no specific type is given, allow rendering
  // only when at least one feature is enabled
  if (!type) {
    return enableLogin || enableRegister ? <>{children}</> : null;
  }

  if (type === "login" && enableLogin) {
    return <>{children}</>;
  }

  if (type === "register" && enableRegister) {
    return <>{children}</>;
  }

  return notFound();
};

export default FeatureRoute;
