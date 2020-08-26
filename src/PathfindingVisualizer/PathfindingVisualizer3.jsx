import React from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import { astar } from "../algorithms/astar";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../algorithms/dijkstras.js";

export default class PathfindingVisualizer2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      algorithm: "Dijkstra's",
      mouseIsPressed: false,
      startNodePressed: false,
      finishNodePressed: false,
      start: { col: 5, row: 10 },
      finish: { col: 20, row: 10 },
      speedText: "Fast",
      speedSeconds: 10,
      prevNode: null,
      visited: 0,
      counted: 0,
    };
    this.animateAlgorithm = this.animateAlgorithm.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.setSpeed = this.setSpeed.bind(this);
    this.setAlgorithm = this.setAlgorithm.bind(this);
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid: grid });
  }

  getInitialGrid = () => {
    var navbarHeight = document.getElementById("navbar").clientHeight;
    const grid = [];
    const numCols = Math.floor((window.innerWidth - 160) / 40);
    const numRows = Math.floor((window.innerHeight - navbarHeight - 120) / 40);
    console.log(`numCols: ${numCols} numRows: ${numRows}`);
    for (let row = 0; row < numRows; row++) {
      const currentRow = [];
      for (let col = 0; col < numCols; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  createNode(col, row) {
    return {
      col,
      row,
      isStart: row === this.state.start.row && col === this.state.start.col,
      isFinish: row === this.state.finish.row && col === this.state.finish.col,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      gscore: 0,
      hscore: 0,
      fscore: 0,
    };
  }

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  getNewGridWithNodeToggled(type, grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isStart: type === "start" ? !node.isStart : node.isStart,
      isFinish: type === "finish" ? !node.isFinish : node.isFinish,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  handleMouseDown(row, col) {
    if (row === this.state.start.row && col === this.state.start.col) {
      console.log(`mouse DOWN row:${row}  col:${col}`);
      const newGrid = this.getNewGridWithNodeToggled(
        "start",
        this.state.grid,
        row,
        col
      );
      this.setState({
        grid: newGrid,
        mouseIsPressed: true,
        startNodePressed: true,
      });
    } else if (row === this.state.finish.row && col === this.state.finish.col) {
      console.log(`mouse DOWN row:${row}  col:${col}`);

      const newGrid = this.getNewGridWithNodeToggled(
        "finish",
        this.state.grid,
        row,
        col
      );
      this.setState({
        grid: newGrid,
        mouseIsPressed: true,
        finishNodePressed: true,
      });
    } else {
      const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseUp(row, col) {
    //Originally there was no row, col being passed
    if (this.state.startNodePressed) {
      console.log(`mouse UP row:${row}  col:${col}`);
      const newGrid = this.getNewGridWithNodeToggled(
        "start",
        this.state.grid,
        row,
        col
      );
      this.setState({
        grid: newGrid,
        start: { row: row, col: col },
        startNodePressed: false,
        mouseIsPressed: false,
      });
    } else if (this.state.finishNodePressed) {
      const newGrid = this.getNewGridWithNodeToggled(
        "finish",
        this.state.grid,
        row,
        col
      );
      this.setState({
        grid: newGrid,
        finish: { row: row, col: col },
        finishNodePressed: false,
        mouseIsPressed: false,
      });
    } else {
      this.setState({ mouseIsPressed: false });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    if (
      this.state.mouseIsPressed &&
      !this.state.startNodePressed &&
      !this.state.finishNodePressed
    ) {
      const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
    if (this.state.startNodePressed) {
      console.log(`mouse ENTER row:${row}  col:${col}`);
      this.setState({
        start: { row: row, col: col },
      });
    }
    if (this.state.finishNodePressed) {
      this.setState({
        finish: { row: row, col: col },
      });
    }
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    const singleAnimationDuration = this.state.speedSeconds;
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, singleAnimationDuration * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, singleAnimationDuration * i);
      this.setState({ visited: i + 1 });
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    const singleAnimationDuration = this.state.speedSeconds;
    if (nodesInShortestPathOrder.length > 1) {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }, singleAnimationDuration * i);
        this.setState({ counted: i + 1 });
      }
    }
  }

  visualize() {
    const { grid } = this.state;
    const startNode = grid[this.state.start.row][this.state.start.col];
    const finishNode = grid[this.state.finish.row][this.state.finish.col];
    const visitedNodesInOrder =
      this.state.algorithm === "Dijkstra's"
        ? dijkstra(grid, startNode, finishNode)
        : astar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  generateRandomMaze() {
    const rows = 20,
      cols = 50;
    let newGrid = [];
    for (let i = 0; i < Math.floor(Math.random() * cols * rows); i++) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);
      if (
        (randomRow !== this.state.start.row ||
          randomCol !== this.state.start.col) &&
        (randomRow !== this.state.finish.row ||
          randomCol !== this.state.finish.col)
      ) {
        //console.log(`randomRow: ${randomRow} randomCol: ${randomCol}`);
        newGrid = this.getNewGridWithWallToggled(
          this.state.grid,
          randomRow,
          randomCol
        );
        this.setState({ grid: newGrid });
      }
    }
  }

  setAlgorithm(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  setSpeed(event) {
    const { name, value } = event.target;
    value === "Fast"
      ? this.setState({ [name]: value, speedSeconds: 10 })
      : value === "Average"
      ? this.setState({ [name]: value, speedSeconds: 50 })
      : this.setState({ [name]: value, speedSeconds: 100 });
  }

  showWidth() {
    console.log(
      `window.width: ${window.innerWidth} window.innerHeight: ${window.innerHeight}`
    );
    var root = document.getElementById("root");
    console.log(
      `root.clientWidth: ${root.clientWidth} root.clientHeight: ${root.clientHeight}`
    );
  }

  reset() {
    //Hacky
    window.location.reload(false);
  }

  render() {
    const { grid, visited, counted } = this.state;

    return (
      <div>
        <div id="navbar">
          <h1>Pathfinding Visualizer</h1>
          <div id="counters">
            <h2>Nodes visited: {visited}</h2>
            <h2>Nodes counted: {counted}</h2>
          </div>
          <div>
            <select
              id="algo_dropdown"
              name="algorithm"
              value={this.state.algorithm}
              onChange={this.setAlgorithm}
            >
              <option value="Dijkstra's">Diijkstra's</option>
              <option value="A*">A*</option>
            </select>
            <button id="btn" onClick={() => this.visualize()}>
              Visualize {this.state.algorithm}
            </button>
            <button id="btn" onClick={() => this.generateRandomMaze()}>
              Generate Random Walls
            </button>
            <button id="btn" onClick={() => this.reset()}>
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

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {
                    row,
                    col,
                    isStart,
                    isFinish,
                    //isVisited,
                    isWall,
                  } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      col={col}
                      isStart={isStart}
                      isFinish={isFinish}
                      //isVisited={isVisited} //Uncommenting this causes the whole animation to render at once for some reason
                      isWall={isWall}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={(row, col) => this.handleMouseUp(row, col)}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
