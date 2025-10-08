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
    if (showTieSheet && matches.length>0) {
      gsap.from(playerRefs.current, {
        duration: 0.8,
        opacity: 0,
        x: 50,
        stagger: 0.2,
        ease: "power3.out",
      });
    }
  }, [showTieSheet,matches]);

  const handleNumChange = (e) => {
    const value = Number(e.target.value);
    if (value > 12) {
      alert("Cannot have more than 12 players");
      return;
    }
    setNumPlayers(value);
    setShowInputs(false);
    setShowTieSheet(false);
  };

  const generatePlayerInputs = () => {
    if (numPlayers < 1) {
      alert("Enter a valid number of players");
      return;
    }
    setPlayerInputs(Array(numPlayers).fill(""));
    setShowInputs(true);
  };

  const handlePlayerNameChange = (index, value) => {
    const newInputs = [...playerInputs];
    newInputs[index] = value;
    setPlayerInputs(newInputs);
  };

  const generateMatches = () => {
    const validPlayers = playerInputs
      .map((name) => name.trim())
      .filter((name) => name !== "");
    if (validPlayers.length !== playerInputs.length) {
      alert("Please fill in all player names");
      return;
    }

    const shuffled = [...validPlayers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPlayers(shuffled);

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

    setMatches(newMatches);

    setShowTieSheet(true);
  };

  return (
    <div className="flex min-h-screen bg-black text-white p-6 gap-6">
      <div className="flex flex-col gap-4 w-1/2">
        <div className="text-blue-300 text-[60px]">TieSheet</div>

        <div className="flex gap-2">
          <input
            className="border p-2 w-64 text-white"
            type="number"
            placeholder="Enter number of players"
            value={numPlayers > 0 ? numPlayers : ""}
            onChange={handleNumChange}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={generatePlayerInputs}
          >
            Generate Player Inputs
          </button>
        </div>

        {showInputs && (
          <div className="flex flex-col gap-2 mt-4">
            {playerInputs.map((name, index) => (
              <input
                key={index}
                className="border p-2 w-64 text-white"
                type="text"
                placeholder={`Player ${index + 1} name`}
                value={name}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              />
            ))}
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2 mr-60 self-center"
              onClick={generateMatches}
            >
              Generate Matches
            </button>
          </div>
        )}
      </div>

      {showTieSheet && (
        <div className="flex flex-col w-1/2 gap-4">
          <h2 className="text-[45px]">Shuffled Players:</h2>
          <div className="text-[25px]">{players.join(", ")}</div>

          <h1 className="text-[45px]">Matches:</h1>
          <ul>
            {matches.map((match, index) => (
              <li key={index} ref={addToRefs} className="mb-1 text-[25px]">
                {match[1] === "Bye"
                  ? `${match[0]} gets a bye`
                  : `${match[0]} vs ${match[1]}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
