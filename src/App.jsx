import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Navbar from './components/Navbar';

const API_URL = 'https://api.unsplash.com/search/photos';

function App() {
  const [region, setRegion] = useState("");
  const [budget, setBudget] = useState("");
  const [dietType, setDietType] = useState("veg"); 
  const [allergies, setAllergies] = useState("");
  const [answer, setAnswer] = useState("");
  const [imageUrls, setImageUrls] = useState({});
  const [loadingImages, setLoadingImages] = useState(false);
  const [error, setError] = useState("");

  async function generateAnswer() {
    setAnswer('Loading...');
    setError('');

    let question = `Suggest a diet for a day under ${budget} rupees, ${dietType} diet`;
    if (allergies) question += `, avoiding allergies: ${allergies}`;

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
        { contents: [{ parts: [{ text: question }] }] },
        { params: { key: process.env.GOOGLE_API_KEY } }
      );

      const generatedText = response.data.candidates[0].content.parts[0].text;
      setAnswer(generatedText);

      const foodItems = extractFoodItems(generatedText);
      setLoadingImages(true);
      foodItems.forEach(food => fetchPhotos(food));

    } catch (error) {
      console.error('Error generating answer:', error);
      setAnswer('Failed to generate a response. Please try again.');
    }
  }

  async function fetchPhotos(foodItem) {
    try {
      const result = await axios.get(API_URL, {
        params: {
          client_id: process.env.UNSPLASH_API_KEY,
          query: foodItem,
        },
      });

      const imageUrl = result.data.results[0]?.urls?.thumb || ''; 
      setImageUrls(prev => ({ ...prev, [foodItem]: imageUrl }));

    } catch (error) {
      console.error(`Error fetching photos for ${foodItem}:`, error);
      setError(`Failed to fetch image for ${foodItem}`);
    } finally {
      setLoadingImages(false);
    }
  }

  const extractFoodItems = (text) => {
    const cleanedText = text.replace(/\*\*/g, '');
    const sections = cleanedText.split(/(?=Breakfast|Lunch|Dinner)/);

    let foodItems = [];
    sections.slice(1).forEach(section => {
      const items = section
        .slice(section.indexOf('\n') + 1)
        .split('*')
        .map(item => item.trim())
        .filter(Boolean);

      foodItems = [...foodItems, ...items.slice(0, 3)];
    });

    return foodItems;
  };

  const formatAnswer = (text) => {
    const cleanedText = text.replace(/\*\*/g, '');
    const sections = cleanedText.split(/(?=Breakfast|Lunch|Dinner)/);

    return sections.slice(1).map((section, index) => {
      const title = section.split('\n')[0]; 
      const items = section
        .slice(section.indexOf('\n') + 1)
        .split('*')
        .map(item => item.trim())
        .filter(Boolean);

      return (
        <div key={index} className="meal-box">
          <h3>{title}</h3>
          <div className="meal-items">
            {items.slice(0, 3).map((item, i) => (
              <div key={i} className="card">
                <p>{item}</p>
                {imageUrls[item] ? (
                  <img src={imageUrls[item]} alt={item} />
                ) : loadingImages ? (
                  <p>Loading image...</p>
                ) : (
                  <p>No image available</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className='page'>
      <Navbar/>

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
        {error && <p className="error">{error}</p>}
        {answer ? formatAnswer(answer) : null}
      </div>
    </div>
  );
}

export default App;
