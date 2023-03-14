import React from "react";

const SERVER_BASE_URL = "http://localhost:8800";

export default function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch(`${SERVER_BASE_URL}/fer`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => alert(err.message));
  }, []);

  return (
    <div className="container p-4 flex flex-col gap-4 items-center">
      <h1 className="font-bold text-lg">FER frontend</h1>
      {data?.map((item) => (
        <div
          key={item._id}
          className="max-w-lg w-full flex flex-col gap-2 bg-gray-50 rounded-2xl overflow-hidden p-4"
        >
          <h2 className="bg-gray-100 p-4 rounded-lg">{item?.emotion}</h2>
          <p className="text-xs self-end text-gray-600">
            {new Date(item?.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
