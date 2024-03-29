/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React from "react";
import useSound from "use-sound";
import alertSound from "./assets/sound/alert.mp3";
import { cn, capitalize } from "./core/utils";
import moment from "moment";
import {
  AngryIcon,
  HappyIcon,
  NeutralIcon,
  SadIcon,
  SurpriseIcon,
} from "./assets/icons";
import Loader from "./core/components/Loader";
import PieChart from "./PieChart";

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

const EMOJI_ICONS = {
  angry: <AngryIcon className="w-6 h-6" />,
  sad: <SadIcon className="w-6 h-6" />,
  surprise: <SurpriseIcon className="w-6 h-6" />,
  neutral: <NeutralIcon className="w-6 h-6" />,
  happy: <HappyIcon className="w-6 h-6" />,
};

const DESCRIPTION =
  "A facial emotion recognition system for rehabilitation uses machine learning to identify and analyze emotions from facial expressions, assisting individuals with emotional regulation difficulties. The system provides real-time feedback and progress tracking to patients and therapists, improving mental health rehabilitation.";

export default function App() {
  const [emotionList, setEmotionsList] = React.useState(() =>
    JSON.parse(localStorage.getItem("data") || "[]")
  );
  const [frequency, setFrequency] = React.useState({});
  const [frequencyWithDuration, setFrequencyWithDuration] = React.useState({});
  const [duration, setDuration] = React.useState("1440");
  const [pieData, setPieData] = React.useState([
    {
      id: "angry",
      label: "Angry",
      value: 0,
      color: "#dc2626",
    },
    {
      id: "sad",
      label: "Sad",
      value: 0,
      color: "#ea580c",
    },
    {
      id: "surprise",
      label: "Surprise",
      value: 0,
      color: "#ca8a04",
    },
    {
      id: "neutral",
      label: "Neutral",
      value: 0,
      color: "#4b5563",
    },
    {
      id: "happy",
      label: "Happy",
      value: 0,
      color: "#16a34a",
    },
  ]);
  const [play] = useSound(alertSound);

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

  async function fetchFrequency() {
    const response = await axios.get(`${SERVER_BASE_URL}/fer/data`);
    const { data } = response;
    let frequencyList = Object.keys(data);
    frequencyList.sort((a, b) => a.localeCompare(b));
    let frequency = {};
    frequencyList.forEach((emotion) => {
      setPieData((prev) =>
        prev.map((item) => {
          if (item.label === emotion) {
            return {
              ...item,
              value: data[emotion],
            };
          }
          return item;
        })
      );
      frequency = {
        ...frequency,
        [emotion]: data[emotion],
      };
    });
    setFrequency(frequency);
  }

  async function fetchFrequencyWithDuration() {
    const response = await axios.get(
      `${SERVER_BASE_URL}/fer/data/${duration === "" ? 0 : +duration * 60}`
    );
    const { data } = response;
    let frequencyList = Object.keys(data);
    frequencyList.sort((a, b) => a.localeCompare(b));
    let frequency = {};
    frequencyList.forEach((emotion) => {
      frequency = {
        ...frequency,
        [capitalize(emotion)]: data[emotion],
      };
    });
    setFrequencyWithDuration(frequency);
  }

  function handleInputChange(e) {
    let value = +e.target.value;
    if (value > -1 && value < 9999999999) setDuration(e.target.value);
  }

  React.useEffect(() => {
    fetchFrequency();
    fetchFrequencyWithDuration();
    fetchData();
    let interval = setInterval(() => fetchData(), 2000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      fetchFrequencyWithDuration();
    }, 500);
    return () => clearTimeout(timeout);
  }, [duration]);

  React.useEffect(() => {
    if (
      emotionList &&
      emotionList?.length > 0 &&
      Object.keys(emotionList[0]).length > 0 &&
      emotionList[0].hasOwnProperty("emotion") &&
      emotionList[0]?.emotion === "Happy"
    ) {
      play();
    }
  }, [emotionList, play]);

  let days = Math.floor(+duration / 60 / 24);
  let hours = Math.floor(+duration / 60) - days * 24;
  let minutes = +duration % 60;
  const timeDuration = `${days ? days + "d" : ""} ${hours ? hours + "h" : ""} ${
    minutes ? minutes + "m" : ""
  } ${duration === "" ? "0m" : ""}`;

  return (
    <div className="bg-gray-100 p-8 flex flex-col space-y-4 font-sans">
      <h1 className="font-bold text-[48px] leading-[1.1] tracking-tight">
        Facial Emotion Recognition System For Rehabilitation
      </h1>
      <h2 className="text-2xl font-bold flex gap-6 items-baseline">
        <span>
          Computational Intelligence & Smart Motion Research(CISMR) Lab
        </span>
        <span>Dr. Chandra Prakash</span>
      </h2>
      <p className="pb-6">{DESCRIPTION}</p>
      <div className="flex flex-col items-center lg:items-start lg:flex-row gap-8">
        <div className="flex flex-col gap-4 max-w-[300px] w-full">
          <div className="border border-gray-200 p-4 rounded-[24px] bg-white h-fit">
            <h3 className="text-center text-lg font-bold flex flex-col whitespace-nowrap">
              <span>Emotion Frequency</span>
              <span>(till now)</span>
            </h3>
            <div className="p-4 flex flex-col gap-4">
              {frequency && Object.keys(frequency).length > 0 ? (
                Object.keys(frequency).map((emotion) => {
                  let emotionId = emotion;
                  emotionId = emotionId.toLowerCase();
                  return (
                    <div
                      key={emotion}
                      className={cn(
                        "flex items-center justify-between gap-8 font-medium",
                        COLORS[emotionId].text
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span>{EMOJI_ICONS[emotionId]}</span>
                        <span className="">{emotion}</span>
                      </div>
                      <span className="text-black font-bold text-2xl">
                        {frequency[emotion]}
                      </span>
                    </div>
                  );
                })
              ) : (
                <Loader />
              )}
            </div>
          </div>
          <div className="w-full h-[242px] bg-white border rounded-[24px] border-gray-200">
            {frequency && Object.keys(frequency).length > 0 ? (
              <PieChart data={pieData} />
            ) : (
              <Loader />
            )}
          </div>
        </div>
        <div className="order-3 lg:order-none border border-gray-200 w-full overflow-hidden rounded-[24px]">
          <div className="h-[calc(100vh-66px)] overflow-auto flex flex-col gap-4 p-4 bg-white">
            {emotionList && emotionList?.length > 0 ? (
              emotionList?.map((emotion) => (
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
              ))
            ) : (
              <Loader />
            )}
          </div>
        </div>
        <div className="border border-gray-200 p-4 max-w-[300px] w-full rounded-[24px] bg-white h-fit">
          <h3 className="text-center text-lg font-bold flex flex-col whitespace-nowrap">
            <span>Emotions in last</span>
            <span>{timeDuration}</span>
          </h3>
          <div className="p-4 flex flex-col gap-4">
            {frequency && Object.keys(frequency).length > 0 ? (
              Object.keys(frequencyWithDuration).map((emotion) => {
                let emotionId = emotion;
                emotionId = emotionId.toLowerCase();
                return (
                  <div
                    key={emotion}
                    className={cn(
                      "flex items-center justify-between gap-8 font-medium",
                      COLORS[emotionId].text
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span>{EMOJI_ICONS[emotionId]}</span>
                      <span className="">{emotion}</span>
                    </div>
                    <span className="text-black font-bold text-2xl">
                      {frequencyWithDuration[emotion]}
                    </span>
                  </div>
                );
              })
            ) : (
              <Loader />
            )}
          </div>
          <div className="w-full pt-4">
            <input
              type="number"
              placeholder="Enter duration in minutes"
              value={duration}
              className="px-3 py-2 w-full border-2 border-gray-300 bg-gray-50 focus:border-blue-500 focus:outline-none rounded-lg"
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
