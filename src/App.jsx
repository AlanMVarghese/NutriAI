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

    // Update answer with formatted structure
    setAnswer(response['data']['candidates'][0]['content']['parts'][0]['text']);
  }

  const formatAnswer = (text) => {
    // Remove stars and split the text into sections
    const cleanedText = text.replace(/\*\*/g, ''); // Remove the '**' characters
    const sections = cleanedText.split(/(?=Breakfast|Lunch|Dinner)/); // Split on meal titles

    return sections.slice(1).map((section, index) => (
      <div key={index} className="meal-box">
        <h3>{section.split('\n')[0]}</h3>
        <p>{section.slice(section.indexOf('\n') + 1)}</p>
      </div>
    ));
  };

  return (
    <>
      <h1>NutriAi</h1>

      <div className="input-box-group">
        <div className="input-row">
          <label className="label">Region:</label>
          <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} />
        </div>
        <div className="input-row">
          <label className="label">Budget:</label>
          <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </div>
        <div className="input-row">
          <label className="label">Diet Type:</label>
          <select value={dietType} onChange={(e) => setDietType(e.target.value)}>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
          </select>
        </div>
        <div className="input-row">
          <label className="label">Allergies (optional):</label>
          <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
        </div>
        <button className="button" onClick={generateAnswer}>Generate Answer</button>
        <div className="answer">
          {answer ? formatAnswer(answer) : null}
        </div>
      </div>
    </>
  );
}

export default App;
