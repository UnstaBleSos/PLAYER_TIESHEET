import { useState } from "react";
import "./App.css";

function App() {
  const [numPlayers, setNumPlayers] = useState(0);
  const [playerInputs, setPlayerInputs] = useState([]);
  const [rounds, setRounds] = useState([]);

  const handleNumChange = (e) => {
    const value = Number(e.target.value);
    if (value > 18) return alert("Cannot have more than 18 players");
    setNumPlayers(value);
    setPlayerInputs([]);
    setRounds([]);
  };

  const generatePlayerInputs = () => {
    if (numPlayers < 1) return alert("Enter a valid number of players");
    setPlayerInputs(Array(numPlayers).fill(""));
  };

  const handlePlayerNameChange = (i, value) => {
    const newInputs = [...playerInputs];
    newInputs[i] = value;
    setPlayerInputs(newInputs);
  };

  const generateBracket = () => {
    const validPlayers = playerInputs.map((p) => p.trim());
    if (validPlayers.includes("")) return alert("Fill all player names");

    const shuffled = [...validPlayers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const firstRound = [];
    const remaining = [...shuffled];
    while (remaining.length > 0) {
      const p1 = remaining.shift();
      const p2 = remaining.length > 0 ? remaining.shift() : "Bye";
      firstRound.push({ player1: p1, player2: p2, winner: null });
    }

    const totalRounds = Math.ceil(Math.log2(firstRound.length)) + 1;
    const allRounds = Array.from({ length: totalRounds }, (_, i) =>
      i === 0 ? firstRound : []
    );

    setRounds(allRounds);
  };

  const selectWinner = (roundIndex, matchIndex, winner) => {
    const newRounds = [...rounds];
    newRounds[roundIndex][matchIndex].winner = winner;

    if (roundIndex + 1 < newRounds.length) {
      const nextRound = [...newRounds[roundIndex + 1]];
      const nextIndex = Math.floor(matchIndex / 2);
      const slot = nextRound[nextIndex] || {
        player1: null,
        player2: null,
        winner: null,
      };
      if (matchIndex % 2 === 0) slot.player1 = winner;
      else slot.player2 = winner;
      nextRound[nextIndex] = slot;
      newRounds[roundIndex + 1] = nextRound;
    }

    const finalRound = newRounds[newRounds.length - 1];
    if (finalRound.length === 1 && finalRound[0].winner) {
      alert(`🏆 Tournament Winner: ${finalRound[0].winner}`);
    }

    setRounds(newRounds);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white p-6 gap-8">
      {/* Sidebar for inputs */}
      <div className="flex flex-col w-1/3 gap-6 bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700">
        <h1 className="text-center text-blue-400 text-4xl font-bold mb-4">
          TieSheet
        </h1>
        <input
          type="number"
          value={numPlayers > 0 ? numPlayers : ""}
          onChange={handleNumChange}
          placeholder="Enter number of players"
          className="border border-gray-600 bg-gray-900 text-white rounded-lg p-3 w-full"
        />
        <button
          onClick={generatePlayerInputs}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg mt-2 font-semibold"
        >
          Add Players
        </button>
        {playerInputs.length > 0 && (
          <div className="flex flex-col gap-2 mt-4">
            {playerInputs.map((name, i) => (
              <input
                key={i}
                value={name}
                placeholder={`Player ${i + 1}`}
                onChange={(e) => handlePlayerNameChange(i, e.target.value)}
                className="border border-gray-600 bg-gray-900 text-white rounded-lg p-2"
              />
            ))}
            <button
              onClick={generateBracket}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg mt-2 font-semibold"
            >
              Generate Bracket
            </button>
          </div>
        )}
      </div>

      {/* Tournament Bracket */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-16 items-start relative">
          {rounds.map((round, rIndex) => (
            <div key={rIndex} className="flex flex-col items-center relative">
              {round.map((match, mIndex) => {
                const marginTop =
                  rIndex === 0 ? "1rem" : `${Math.pow(2, rIndex - 1) * 5}rem`;

                return (
                  <div
                    key={mIndex}
                    className="flex flex-col items-center relative"
                    style={{
                      marginTop,
                      marginBottom: marginTop,
                    }}
                  >
                    {rIndex < rounds.length - 1 && (
                      <>
                        <div
                          className="absolute border-r border-t border-gray-600"
                          style={{
                            height: "3.5rem",
                            width: "2rem",
                            top: "1.25rem",
                            left: "100%",
                          }}
                        />
                        <div
                          className="absolute  border-b border-gray-600"
                          style={{
                            height: "1.5rem",
                            width: "2rem",
                            top: "3.3rem",
                            left: "100%",
                          }}
                        />
                      </>
                    )}

                    <button
                      className={`px-3 py-1 rounded w-28 text-center ${
                        match.winner === match.player1
                          ? "bg-green-600"
                          : "bg-gray-800"
                      }`}
                      onClick={() =>
                        selectWinner(rIndex, mIndex, match.player1)
                      }
                    >
                      {match.player1 || "—"}
                    </button>

                    <span className="my-1">vs</span>

                    <button
                      className={`px-3 py-1 rounded w-28 text-center ${
                        match.winner === match.player2
                          ? "bg-green-600"
                          : "bg-gray-800"
                      }`}
                      onClick={() =>
                        selectWinner(rIndex, mIndex, match.player2)
                      }
                    >
                      {match.player2 || "—"}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
