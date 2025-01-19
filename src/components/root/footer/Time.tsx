import TimeIcon from "@mui/icons-material/AccessTime";
import { useEffect, useState } from "react";
const Time = () => {
  const [timestr, setTimestr] = useState<string>(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let now = new Date();
      setTimestr(now.toLocaleTimeString());
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line
  });

  return (
    <>
      <TimeIcon />
      &nbsp; {timestr}
    </>
  );
};

export default Time;
