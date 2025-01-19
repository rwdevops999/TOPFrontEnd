import SessionTimeIcon from "@mui/icons-material/Timelapse";
import { useEffect, useRef, useState } from "react";

const msToTime = (s: number): string => {
  const pad = (n: number, z?: number): string => {
    z = z || 2;
    return ("00" + n).slice(-z);
  };

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return pad(hrs) + ":" + pad(mins) + ":" + pad(secs);
};

const SessionTime = () => {
  const [durationstr, setDurationstr] = useState<string>("00:00:00");

  const start = useRef<number>(new Date().getTime());

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let now = new Date();
      setDurationstr(msToTime(now.getTime() - start.current));
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line
  });

  return (
    <>
      <SessionTimeIcon />
      &nbsp;{durationstr}
    </>
  );
};

export default SessionTime;
