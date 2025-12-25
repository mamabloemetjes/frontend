import { useTheme } from "@/hooks/useTheme";
import Snowfall from "react-snowfall";

const SnowFallComponent = () => {
  const month = new Date().getMonth();
  const isWinter = [11, 0, 1].includes(month);
  const { theme } = useTheme();

  return isWinter && theme === "dark" ? (
    <Snowfall
      snowflakeCount={100}
      speed={[1, 2]}
      wind={[0, 3]}
      radius={[0, 2.5]}
      color="#FFFFFF"
    />
  ) : null;
};

export default SnowFallComponent;
