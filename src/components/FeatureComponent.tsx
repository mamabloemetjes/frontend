import { env } from "@/lib/env";

interface FeatureComponentProps {
  // Children
  children: React.ReactNode;
  type: "login" | "register";
}

const FeatureComponent = ({ children, type }: FeatureComponentProps) => {
  if (type === "login" && env.features.enableLogin) {
    return <>{children}</>;
  }

  if (type === "register" && env.features.enableRegister) {
    return <>{children}</>;
  }

  return null;
};

export default FeatureComponent;
