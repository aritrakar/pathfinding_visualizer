import React from "react";
import "./PathfindingVisualizer.css";

export default function Navbar(props) {
  const { visited, counted, visualizeAlgorithm, maze, reset } = props;
  return (
    <div>
      <h1>Pathfinding Visualizer</h1>
      <div id="counters">
        <h2>Nodes visited: {visited}</h2>
        <h2>Nodes counted: {counted}</h2>
      </div>
      <div>
        <button id="btn" onClick={() => visualizeAlgorithm}>
          Visualize Dijkstra's
        </button>
        <button id="btn" onClick={() => maze}>
          Generate Random Walls
        </button>
        <button id="btn" onClick={() => reset}>
          Reset
        </button>
        <select
          id="speed_dropdown"
          name="speedText"
          value={this.state.speedText}
          onChange={this.setSpeed}
        >
          <option value="Fast">Fast</option>
          <option value="Average">Average</option>
          <option value="Slow">Slow</option>
        </select>
      </div>
    </div>
  );
}
