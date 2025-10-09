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
  const shuffleRef = useRef();
  const matchesRef = useRef();
  const playerRef = useRef([]);
  const playersRef = useRef([]);

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

  useEffect(() => {
    gsap.from(shuffleRef.current, {
      opacity: 0,
      duration: 0.8,
      x: 20,
    });
    gsap.from(matchesRef.current, {
      opacity: 0,
      duration: 0.8,
      x: 20,
    });
    if (playersRef.current.length) {
      gsap.fromTo(
        playersRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [showTieSheet]);

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
    const validPlayers = playerInputs.map((name) => name.trim());
    if (validPlayers.includes("")) {
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
    <div className="flex min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 justify-start items-start gap-8">
      <div className="flex flex-col w-1/2 gap-6 bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-700">
        <h1 className="text-center text-blue-400 text-5xl font-bold tracking-wide mb-4">
          TieSheet
        </h1>

        <div className="flex gap-3 justify-center">
          <input
            className="border border-gray-600 bg-gray-900 text-white rounded-lg p-3 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            type="number"
            placeholder="Enter number of players"
            value={numPlayers > 0 ? numPlayers : ""}
            onChange={handleNumChange}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold transition-all"
            onClick={generatePlayerInputs}
          >
            Add Players
          </button>
        </div>

        {showInputs && (
          <div className="flex flex-col gap-3 items-center mt-4">
            {playerInputs.map((name, index) => (
              <input
                key={index}
                className="border border-gray-600 bg-gray-900 text-white rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                type="text"
                placeholder={`Player ${index + 1} name`}
                value={name}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                ref={playerRef}
              />
            ))}
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold transition-all mt-4"
              onClick={generateMatches}
            >
              Generate Matches
            </button>
          </div>
        )}
      </div>

      {showTieSheet && (
        <div className="flex flex-col w-1/2 gap-6">
          <div>
            <h2
              className="text-3xl text-blue-400 font-bold mb-2"
              ref={shuffleRef}
            >
              Shuffled Players
            </h2>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-lg text-gray-200">
              {players.join(", ")}
            </div>
          </div>

          <div>
            <h2
              className="text-3xl text-blue-400 font-bold mb-2"
              ref={matchesRef}
            >
              Matches
            </h2>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {matches.map((match, index) => (
                <li
                  key={index}
                  ref={(el) => (playersRef.current[index] = el)}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 shadow hover:bg-gray-700 transition-all"
                >
                  {match[1] === "Bye"
                    ? `${match[0]} gets a bye`
                    : `${match[0]} 🆚 ${match[1]}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
