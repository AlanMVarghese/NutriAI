import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [region, setRegion] = useState("");
  const [budget, setBudget] = useState("");
  const [dietType, setDietType] = useState("veg"); // default to veg
  const [disease, setDisease] = useState("");
  const [allergies, setAllergies] = useState("");
  const [answer, setAnswer] = useState("");

  async function generateAnswer() {
    setAnswer('Loading...');
    
    // Construct the question
    let question = `Suggest a diet for a day under ${budget} rupees, `;
    question += `${dietType} diet`;
    if (disease) question += `, considering the disease: ${disease}`;
    if (allergies) question += `, avoiding allergies: ${allergies}`;
    
    const response = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDIjHB4cD7WAKZ1-STYom4czbx97IVahEI",
      method: "post",
      data: {
        contents: [{ parts: [{ text: question }] }],
      },
    });

    setAnswer(response['data']['candidates'][0]['content']['parts'][0]['text']);
  }

  return (
    <>
      <h1>NutriAi</h1>
      <div>
        <label>
          Region:
          <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Budget:
          <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Diet Type:
          <select value={dietType} onChange={(e) => setDietType(e.target.value)}>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Disease (optional):
          <input type="text" value={disease} onChange={(e) => setDisease(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Allergies (optional):
          <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
        </label>
      </div>
      <br />
      <button onClick={generateAnswer}>Generate Answer</button>
      <pre>{answer}</pre>
    </>
  );
}

export default App;
