import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.post("./api/recommend", { url });
      console.log(response.data.recommendations);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <div>
      <h1>Website Recommendations</h1>
      <input
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={fetchRecommendations}>Get Recommendations</button>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
}
