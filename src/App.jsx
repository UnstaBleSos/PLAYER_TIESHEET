import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [num, setNum] = useState(0);
  const [array, setArray] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (num > 12) {
      alert("Cannot set more than 12");
      console.error("Cannot set more than 12");
      return;
    }

    // Create array [1 ... num]
    const newArray = Array.from({ length: num }, (_, i) => i + 1);

    // Shuffle array (Fisher–Yates)
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    setArray(newArray);

    // Generate matches
    const newMatches = [];
    for (let i = 0; i < newArray.length; i += 2) {
      if (i + 1 < newArray.length) {
        newMatches.push([newArray[i], newArray[i + 1]]);
      } else {
        newMatches.push([newArray[i], "Bye"]);
      }
    }

    setMatches(newMatches);
  }, [num]);

  return (
    <div className="flex flex-col justify-center items-center h-screen  gap-4">
      <div className="text-blue-300 text-[80px]">TieSheet</div>

      <input
        className="border p-3 w-64"
        type="number"
        name="players"
       
        onChange={(e) => setNum(Number(e.target.value))}
        placeholder="Enter number of players"
      />

      <h3>Shuffled Players:</h3>
      <div>{array.join(", ")}</div>

      <h3 className="mt-4">Matches:</h3>
      <ul>
        {matches.map((match, index) => (
          <li key={index}>
            {match[1] === "Bye"
              ? `${match[0]} gets a bye`
              : `${match[0]} vs ${match[1]}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
