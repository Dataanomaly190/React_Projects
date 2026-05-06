import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import "./App.css";

export default function App() {
  const [joke, setJoke] = useState("");
  const [punchline, setPunchline] = useState("");
  const [loading, setLoading] = useState(false);
  const [jokeType, setJokeType] = useState("");
  const [count, setCount] = useState(0);
  const [generalJokes, setGeneralJokes] = useState(0);
  const [programmingJokes, setProgrammingJokes] = useState(0);
  const [jokesHistory, setJokesHistory] = useState([]);
  const [selectedJoke, setSelectedJoke] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const generateJoke = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://official-joke-api.appspot.com/random_joke"
      );
      if (!response.ok)
        throw new Error("Error occurred while fetching the Joke!");

      const data = await response.json();
      const { setup, punchline, type } = data;

      setJoke(setup);
      setPunchline(punchline);
      setJokeType(type);
      setCount((prev) => prev + 1);

      if (type === "general") setGeneralJokes((prev) => prev + 1);
      else if (type === "programming") setProgrammingJokes((prev) => prev + 1);

      setJokesHistory((prevHistory) => [
        ...prevHistory,
        {
          id: prevHistory.length + 1,
          joke: setup,
          punchline,
          type,
        },
      ]);
    } catch (error) {
      console.error("Error occurred! Please try again later!", error);
      setJoke("Error occurred while loading the Joke!");
      setPunchline("");
    } finally {
      setLoading(false);
    }
  };

  const debouncedGenerateJoke = useCallback(debounce(generateJoke, 300), []);

  const handleJokeSelection = (e) => {
    const value = e.target.value;
    if (!value) {
      setSelectedJoke(null);
      setShowPreview(false);
      return;
    }

    const jokeId = Number(value);
    const selected = jokesHistory.find((j) => j.id === jokeId);
    setSelectedJoke(selected);
    setShowPreview(true);
  };

  return (
    <div className="container">
      <h1 className="title">WELCOME TO THE LAUGHTER FACTORY!</h1>

      <div className="joke_container">
        <div className="content">
          <div>
            <strong>Number of Jokes till now: {count}</strong>
          </div>
          <div className="content_section">
            <strong>General Jokes: {generalJokes}</strong>
          </div>
          <div className="content_section">
            <strong>Programming Jokes: {programmingJokes}</strong>
          </div>
          <p>
            <strong>
              Type of Joke: <em className="content_section">{jokeType}</em>
            </strong>
          </p>
          <p>
            <strong>Joke:</strong> {loading ? "Loading..." : joke}
          </p>
          <p>
            <strong>Punchline:</strong> {loading ? "Loading..." : punchline}
          </p>
        </div>

        <button
          id="topper"
          className="button"
          onClick={() => !loading && debouncedGenerateJoke()}
          disabled={loading}
        >
          <strong>Click Here!</strong>
        </button>

        <div className="preview_container">
          <select onChange={handleJokeSelection} className="selector">
            <option value="">Select a Joke Number</option>
            {jokesHistory.map((joke) => (
              <option key={joke.id} value={joke.id}>
                Joke #{joke.id}
              </option>
            ))}
          </select>
        </div>

        {showPreview && selectedJoke && (
          <div className="preview_container_display">
            <p>
              <strong>Previous Joke #{selectedJoke.id}:</strong>
            </p>
            <p>{selectedJoke.joke}</p>
            <p>
              <strong>Punchline:</strong> {selectedJoke.punchline}
            </p>
            <p>
              <strong>
                Type: <em>{selectedJoke.type}</em>
              </strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
