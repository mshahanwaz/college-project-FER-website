import axios from "axios";
import React from "react";
import useSound from "use-sound";

import alertSound from "./alert.mp3";

const SERVER_BASE_URL = "https://fer-emotions.onrender.com";

const colors = {
  angry: {
    bg: "bg-red-500",
    fg: "bg-red-100",
  },
  sad: {
    bg: "bg-orange-500",
    fg: "bg-orange-100",
  },
  surprise: {
    bg: "bg-yellow-500",
    fg: "bg-yellow-100",
  },
};

export default function App() {
  const [data, setData] = React.useState(() =>
    JSON.parse(localStorage.getItem("data") || "[]")
  );
  const [play] = useSound(alertSound);

  React.useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`${SERVER_BASE_URL}/fer`);
      const localData = JSON.parse(localStorage.getItem("data"));
      if (
        localData &&
        localData.length === response.data.length &&
        localData.every((item, index) => item._id === response.data[index]._id)
      ) {
        return;
      }

      localStorage.setItem("data", JSON.stringify(response.data));
      setData(response.data);
    }
    fetchData();
    let interval = setInterval(() => fetchData(), 2000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    play();
  }, [data, play]);

  console.log(data);

  function cn(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div id="app" className="container p-4 flex flex-col gap-4 items-center">
      <h1 className="font-bold text-lg">FER Notification System</h1>
      {data?.map((item) => (
        <div
          key={item._id}
          className={cn(
            "max-w-lg w-full flex flex-col gap-2 rounded-2xl overflow-hidden p-4",
            item?.emotion &&
              item?.emotion?.length > 0 &&
              colors.hasOwnProperty(item?.emotion?.toLowerCase())
              ? colors[item?.emotion?.toLowerCase()].fg
              : "bg-gray-100"
          )}
        >
          <h2
            className={cn(
              "p-4 rounded-lg",
              item?.emotion &&
                item?.emotion?.length > 0 &&
                colors.hasOwnProperty(item?.emotion?.toLowerCase())
                ? colors[item?.emotion?.toLowerCase()].bg
                : "bg-gray-200"
            )}
          >
            {item?.emotion}
          </h2>
          <p className="text-xs self-end text-gray-600">
            {new Date(item?.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
