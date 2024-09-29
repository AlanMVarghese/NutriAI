import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [region, setRegion] = useState("");
  const [budget, setBudget] = useState("");
  const [dietType, setDietType] = useState("veg"); // default to veg
  const [allergies, setAllergies] = useState("");
  const [answer, setAnswer] = useState("");

  async function generateAnswer() {
    setAnswer('Loading...');
    
    // Construct the question
    let question = `Suggest a diet for a day under ${budget} rupees, `;
    question += `${dietType} diet`;
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

    return sections.slice(1).map((section, index) => {
      const title = section.split('\n')[0]; // Get the meal title (e.g., Breakfast, Lunch)
      const items = section.slice(section.indexOf('\n') + 1).split('*').map(item => item.trim()).filter(Boolean); // Split food items by *

      return (
        <div key={index} className="meal-box">
          <h3>{title}</h3>
          <div className="meal-items">
            {items.map((item, i) => (
              <div key={i} className="card">
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className='page'>
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
            <option value="vegan">Vegan</option>
          </select>
        </div>
        <div className="input-row">
          <label className="label">Allergies (optional):</label>
          <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
        </div>
        <button className="button" onClick={generateAnswer}>Generate Diet Plan</button>
        </div>
        <div className="answer">
          {answer ? formatAnswer(answer) : null}
        </div>
      
    </div>
  );
}

export default App;
