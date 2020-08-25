import React from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../algorithms/dijkstras.js";

/*
const START_NODE_COL = 37;
const START_NODE_ROW = 15;
const FINISH_NODE_COL = 45;
const FINISH_NODE_ROW = 10;
*/

class PathfindingVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startNodePressed: false,
      finishNodePressed: false,
      start: { col: 5, row: 10 },
      finish: { col: 45, row: 10 },
      prevNode: null,
      visited: 0,
      counted: 0,
    };
    this.visualizeDijkstra = this.visualizeDijkstra.bind(this);
    this.animateDijkstra = this.animateDijkstra.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    //this.getNewGridWithWallToggled = this.getNewGridWithWallToggled.bind(this);
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid: grid });
  }

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
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
      isStart: row === this.state.start.row && col === this.state.start.col, //START_NODE_ROW  START_NODE_COL,
      isFinish: row === this.state.finish.row && col === this.state.finish.col, //FINISH_NODE_ROW  FINISH_NODE_COL
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  handleMouseDown(row, col) {
    //console.log(`DOWN. row: ${row} col: ${col}`);
    if (row === this.state.start.row && col === this.state.start.col) {
      //const prevNode = this.state.grid[row][col];
      console.log(`mouse DOWN row:${row}  col:${col}`);
      //document.getElementById(`node-${row}-${col}`).className = "node";

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
    //console.log("mouse UP");
    if (this.state.startNodePressed) {
      console.log(`mouse UP row:${row}  col:${col}`);
      //document.getElementById(`node-${row}-${col}`).className ="node node-start";

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
      console.log("this.state.start: ", this.state.start);
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
      console.log("startNodePressed === false");
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
    //For source
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

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
      this.setState({ visited: i + 1 });
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    if (nodesInShortestPathOrder.length > 1) {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }, 10 * i);
        this.setState({ counted: i + 1 });
      }
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[this.state.start.row][this.state.start.col]; //START_NODE_ROW START_NODE_COL
    const finishNode = grid[this.state.finish.row][this.state.finish.col]; //FINISH_NODE_ROW  FINISH_NODE_COL
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
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
        console.log(`randomRow: ${randomRow} randomCol: ${randomCol}`);
        newGrid = this.getNewGridWithWallToggled(
          this.state.grid,
          randomRow,
          randomCol
        );
        this.setState({ grid: newGrid });
      }
    }
  }

  reset() {
    const grid = this.getInitialGrid();
    this.setState({ grid: grid });
  }

  render() {
    const { grid, visited, counted } = this.state;

    return (
      <div>
        <h1>Pathfinding Visualizer</h1>
        <div id="counters">
          <h2>Nodes visited: {visited}</h2>
          <h2>Nodes counted: {counted}</h2>
        </div>
        <div>
          <button id="btn" onClick={() => this.visualizeDijkstra()}>
            Visualize Dijkstra's algorithm
          </button>
          <button id="btn" onClick={() => this.generateRandomMaze()}>
            Generate Random Walls
          </button>
          <button id="btn" onClick={() => this.reset()}>
            Reset
          </button>
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

export default PathfindingVisualizer;
