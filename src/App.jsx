import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./App.css";

function App() {
  const [numPlayers, setNumPlayers] = useState(0);
  const [playerInputs, setPlayerInputs] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [showInputs, setShowInputs] = useState(false);
  const [showTieSheet, setShowTieSheet] = useState(false);

  const playerRefs = useRef([]);
  playerRefs.current = [];

  const addToRefs = (el) => {
    if (el && !playerRefs.current.includes(el)) {
      playerRefs.current.push(el);
    }
  };

  useEffect(() => {
    if (matches.length > 0) {
      gsap.from(playerRefs.current, {
        duration: 0.8,
        opacity: 0,
        x: 50,
        stagger: 0.15,
        ease: "power3.out",
      });
    }
  }, [matches]);

  const handleNumChange = (e) => {
    const value = Number(e.target.value);
    if (value > 12) {
      alert("Cannot have more than 12 players");
      return;
    }
    setNumPlayers(value);
    setShowInputs(false);
    setShowTieSheet(false);
    setPlayers([]);
    setMatches([]);
    setPlayerInputs([]);
  };

  const generatePlayerInputs = () => {
    if (numPlayers < 1) return;
    setPlayerInputs(Array(numPlayers).fill(""));
    setShowInputs(true);
    setShowTieSheet(false);
  };

  const handlePlayerNameChange = (index, value) => {
    const newInputs = [...playerInputs];
    newInputs[index] = value;
    setPlayerInputs(newInputs);
  };

  const generateMatches = () => {
    const validPlayers = playerInputs.map((p) => p.trim());
    if (validPlayers.includes("")) {
      alert("Please fill in all player names");
      return;
    }

    const shuffled = [...validPlayers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newMatches = [];
    const remaining = [...shuffled];
    while (remaining.length > 0) {
      const i1 = Math.floor(Math.random() * remaining.length);
      const player1 = remaining.splice(i1, 1)[0];

      if (remaining.length > 0) {
        const i2 = Math.floor(Math.random() * remaining.length);
        const player2 = remaining.splice(i2, 1)[0];
        newMatches.push([player1, player2]);
      } else {
        newMatches.push([player1, "Bye"]);
      }
    }

    setPlayers(shuffled);
    setMatches(newMatches);
    setShowTieSheet(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8 gap-10">
      <div className="flex flex-col gap-6 w-1/2 bg-gray-800/40 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-700">
        <h1 className="text-blue-400 text-5xl font-bold tracking-wide text-center">
          TieSheet
        </h1>

        <div className="flex gap-3 justify-center">
          <input
            className="border border-gray-600 bg-gray-900 text-white rounded-lg p-3 w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            type="number"
            placeholder="Enter number of players"
            value={numPlayers > 0 ? numPlayers : ""}
            onChange={handleNumChange}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition-all"
            onClick={generatePlayerInputs}
          >
            Add Players
          </button>
        </div>

        {showInputs && (
          <div className="flex flex-col gap-3 mt-4 items-center">
            {playerInputs.map((name, index) => (
              <input
                key={index}
                className="border border-gray-600 bg-gray-900 text-white rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                type="text"
                placeholder={`Player ${index + 1} name`}
                value={name}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              />
            ))}
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all mt-4"
              onClick={generateMatches}
            >
              Generate Matches
            </button>
          </div>
        )}
      </div>

      {showTieSheet && (
        <div className="flex flex-col w-1/2 bg-gray-800/40 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-4xl font-bold text-blue-400 mb-3">
            Shuffled Players
          </h2>
          <div className="text-lg text-gray-300 mb-8">{players.join(", ")}</div>

          <h2 className="text-4xl font-bold text-blue-400 mb-3">Matches</h2>
          <ul className="space-y-3 text-lg">
            {matches.map((match, index) => (
              <li
                key={index}
                ref={addToRefs}
                className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-700 shadow-md text-gray-200 hover:bg-gray-700 transition-all"
              >
                {match[1] === "Bye"
                  ? `${match[0]} gets a bye`
                  : `${match[0]} 🆚 ${match[1]}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
