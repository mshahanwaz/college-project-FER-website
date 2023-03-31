import axios from "axios";
import React from "react";
import useSound from "use-sound";
import alertSound from "./alert.mp3";
import { cn, capitalize } from "./utils";
import moment from "moment";
import {
  AngryIcon,
  HappyIcon,
  NeutralIcon,
  SadIcon,
  SurpriseIcon,
} from "./assets/icons";

const SERVER_BASE_URL = "https://fer-emotions.onrender.com";

const COLORS = {
  angry: {
    bg: "bg-angry-light",
    text: "text-angry-dark",
  },
  sad: {
    bg: "bg-sad-light",
    text: "text-sad-dark",
  },
  surprise: {
    bg: "bg-surprise-light",
    text: "text-surprise-dark",
  },
  neutral: {
    bg: "bg-neutral-light",
    text: "text-neutral-dark",
  },
  happy: {
    bg: "bg-happy-light",
    text: "text-happy-dark",
  },
};

const EMOTIONS_FREQUENCY = {
  happy: 873,
  angry: 29,
  sad: 0,
  surprise: 19,
  neutral: 64,
};

const EMOJI_ICONS = {
  angry: <AngryIcon className="w-6 h-6" />,
  sad: <SadIcon className="w-6 h-6" />,
  surprise: <SurpriseIcon className="w-6 h-6" />,
  neutral: <NeutralIcon className="w-6 h-6" />,
  happy: <HappyIcon className="w-6 h-6" />,
};

export default function App() {
  const [emotionList, setEmotionsList] = React.useState(() =>
    JSON.parse(localStorage.getItem("data") || "[]")
  );
  const [play] = useSound(alertSound);

  React.useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`${SERVER_BASE_URL}/fer`);
      const localData = JSON.parse(localStorage.getItem("data"));
      if (
        localData &&
        localData.length === response?.data?.length &&
        localData.every(
          (emotion, index) => emotion._id === response.data[index]._id
        )
      ) {
        return;
      }

      localStorage.setItem("data", JSON.stringify(response.data));
      setEmotionsList(response.data);
    }
    fetchData();
    // let interval = setInterval(() => fetchData(), 2000);
    // return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (emotionList[0].emotion === "Happy") {
      play();
    }
  }, [emotionList, play]);

  console.log(emotionList);

  return (
    <div className="bg-gray-100 p-8 space-y-4 font-sans">
      <h1 className="font-bold text-[60px] leading-[1.1] tracking-tight">
        Facial Emotion Recognition System For Rehabilitation
      </h1>
      <h2 className="text-2xl font-bold space-x-6">
        <span className="">CSMIR Lab</span>
        <span className="">Dr. Chandra Prakash</span>
      </h2>
      <p className="max-w-3xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>
      <div className="flex gap-8 pt-4">
        <div className="p-4 rounded-[24px] bg-white h-fit">
          <h3 className="text-center text-lg font-bold flex flex-col whitespace-nowrap">
            <span>Emotion Frequency</span>
            <span>(till now)</span>
          </h3>
          <div className="p-4 flex flex-col gap-4">
            {Object.keys(EMOTIONS_FREQUENCY).map((emotion) => (
              <div
                key={emotion}
                className={cn(
                  "flex items-center justify-between gap-8 font-medium",
                  COLORS.hasOwnProperty(emotion)
                    ? COLORS[emotion].text
                    : "text-gray-900"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className={COLORS[emotion].text}>
                    {EMOJI_ICONS[emotion]}
                  </span>
                  <span className="">{capitalize(emotion)}</span>
                </div>
                <span className="text-black font-bold text-2xl">
                  {EMOTIONS_FREQUENCY[emotion]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 p-4 rounded-[24px] bg-white">
          {emotionList?.map((emotion) => (
            <div
              key={emotion._id}
              className={cn(
                "flex flex-col gap-1",
                emotion?.emotion &&
                  emotion?.emotion?.length > 0 &&
                  COLORS.hasOwnProperty(emotion?.emotion?.toLowerCase())
                  ? COLORS[emotion?.emotion?.toLowerCase()].text
                  : "text-gray-900"
              )}
            >
              <h3
                className={cn(
                  "p-4 rounded-lg font-medium",
                  emotion?.emotion &&
                    emotion?.emotion?.length > 0 &&
                    COLORS.hasOwnProperty(emotion?.emotion?.toLowerCase())
                    ? COLORS[emotion?.emotion?.toLowerCase()].bg
                    : "bg-gray-200"
                )}
              >
                {emotion?.emotion}
              </h3>
              <p className="text-xs self-end font-medium text-gray-400">
                {moment(new Date(emotion?.timestamp)).fromNow()}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-[24px] bg-white h-fit">
            <h3 className="text-center text-lg font-bold flex flex-col whitespace-nowrap">
              <span>Emotions in 1hr 23min</span>
            </h3>
            <div className="p-4 flex flex-col gap-4">
              {Object.keys(EMOTIONS_FREQUENCY).map((emotion) => (
                <div
                  key={emotion}
                  className={cn(
                    "flex items-center justify-between gap-8 font-medium",
                    COLORS.hasOwnProperty(emotion)
                      ? COLORS[emotion].text
                      : "text-gray-900"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className={COLORS[emotion].text}>
                      {EMOJI_ICONS[emotion]}
                    </span>
                    <span className="">{capitalize(emotion)}</span>
                  </div>
                  <span className="text-black font-bold text-2xl">
                    {EMOTIONS_FREQUENCY[emotion]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <form className="">
            <input
              type="number"
              placeholder="Enter duration"
              defaultValue={10}
              className="px-3 py-2 focus:outline-none focus:ring rounded"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
