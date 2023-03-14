import axios from "axios";
import React from "react";
import useSound from "use-sound";

import alertSound from "./alert.mp3";

const SERVER_BASE_URL = "http://localhost:8800";

const colors = {
  angry: "bg-red-500",
  sad: "bg-orange-500",
  surprise: "bg-yellow-500",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    play();
  }, [data]);

  console.log(data);

  function cn(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div id="app" className="container p-4 flex flex-col gap-4 items-center">
      <h1 className="font-bold text-lg">FER frontend</h1>
      {/* <button onClick={play}>Play</button> */}
      {data?.map((item) => (
        <div
          key={item._id}
          className="max-w-lg w-full flex flex-col gap-2 rounded-2xl bg-gray-50 overflow-hidden p-4"
        >
          <h2
            className={cn(
              "p-4 rounded-lg",
              item?.emotion &&
                item?.emotion?.length > 0 &&
                colors.hasOwnProperty(item?.emotion?.toLowerCase())
                ? colors[item?.emotion?.toLowerCase()]
                : "bg-gray-100"
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
