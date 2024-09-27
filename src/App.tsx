import { useState } from 'react';
import './App.css';
import { ColorPicker } from './colorpicker';

function App() {
  const [color, setColor] = useState('rgb(255, 0, 0)');
  const [resolvedColor, setResolvedColor] = useState('red');
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div
      className="app"
      style={{
        backgroundColor: color,
      }}
    >
      <div>
        <label>Color</label>
        <input
          type="text"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
          }}
        />
      </div>
      <div>
        <label>Resolved Color</label>
        <input
          type="text"
          value={resolvedColor}
          onChange={(e) => {
            setResolvedColor(e.target.value);
          }}
        />
      </div>
      <div>
        <button onClick={() => setShowColorPicker(!showColorPicker)}>
          Toggle Color Picker
        </button>
      </div>
      {showColorPicker && (
        <div className="picker">
          <ColorPicker
            value={color}
            resolvedValue={resolvedColor}
            onChange={setColor}
          />
        </div>
      )}
    </div>
  );
}

export default App;
