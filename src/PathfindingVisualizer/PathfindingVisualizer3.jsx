import React from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import { astar } from "../algorithms/astar";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../algorithms/dijkstras.js";

export default class PathfindingVisualizer3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      numRows: 0,
      numCols: 0,
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

  /**
   * @description Creates a grid of Nodes
   * @returns Grid (2D array) of Nodes
   */
  getInitialGrid = () => {
    var navbarHeight = document.getElementById("navbar").clientHeight;
    const grid = [];
    const numCols = Math.floor((window.innerWidth - 160) / 40);
    const numRows = Math.floor((window.innerHeight - navbarHeight - 120) / 40);
    this.setState({numRows, numCols})
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

  /**
   * @description Creates a single unvisited Node that is not a wall
   * @param {number} col The column of the Node to be created
   * @param {number} row The row of the Node to be created
   * @returns 
   */
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

  /**
   * @description Toggles the wall state of Node at (row, col) 
   * @param {Node[][]} grid Grid (2D array) of Nodes
   * @param {number} row Row of the Node to toggle to wall
   * @param {number} col Column of the Node to toggle to wall
   * @returns Grid with wall toggled at (row, col)
   */
  getNewGridWithWallToggled(grid, row, col) {
    // (Shallow) Copy the entire grid
    const newGrid = grid.slice();

    // Get the reference to the Node to change to wall
    const node = newGrid[row][col];

    // Make new Node with toggled wall
    const newNode = {
      ...node, // Get other details using the spread operator
      isWall: !node.isWall,
    };

    // Set newNode in the new grid
    newGrid[row][col] = newNode;
    return newGrid;
  }

  /**
   * @description Toggles Node at (row, col) to a start/finish Node
   * @param {string} type Type of Node to toggle to, ie. start or finish Node
   * @param {Node[][]} grid Grid (2D array) of Nodes
   * @param {number} row Row of the Node to toggle start/finish node
   * @param {number} col Column of the Node to toggle to start/finish node
   * @returns Grid with Node toggled at (row, col) to start/finish Node
   */
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

  /**
   * @description Handles the necessary state changes when a Node is clicked but not released
   * @param {number} row Row of the Node which has been clicked 
   * @param {number} col Column of the Node which has been clicked 
   */
  handleMouseDown(row, col) {
    if (row === this.state.start.row && col === this.state.start.col) { // Start Node is pressed
      console.log(`mouse DOWN row:${row}  col:${col}`);

      // Toggle start Node to unvisited Node
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
    } else if (row === this.state.finish.row && col === this.state.finish.col) { // Finish Node is pressed
      console.log(`mouse DOWN row:${row}  col:${col}`);

      // Toggle finish Node to unvisited Node
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
    } else { //Unvisited Node is pressed
      // Toggle unvisited Node to wall Node
      const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  /**
   * @description Handles the necessary state changes when a Node is released
   * @param {number} row Row of the Node which has been released 
   * @param {number} col Column of the Node which has been released 
   */
  handleMouseUp(row, col) {
    //Originally there was no row, col being passed
    if (this.state.startNodePressed) { //Start Node
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
    } else if (this.state.finishNodePressed) { // Finish Node
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
    } else { // Unvisited Node
      this.setState({ mouseIsPressed: false });
    }
  }

  /**
   * @description Toggles Node at (row, col) to start, finish or wall Node
   * @param {number} row Row of the Node that the mouse enters 
   * @param {number} col Column of the Node that the mouse enters
   */
  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    if (
      this.state.mouseIsPressed &&
      !this.state.startNodePressed &&
      !this.state.finishNodePressed
    ) {
      // Toggle unvisited Node to a Wall Node
      const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
    if (this.state.startNodePressed) { // Toggle Node at (row, col) to start Node
      console.log(`mouse ENTER row:${row}  col:${col}`);
      this.setState({
        start: { row: row, col: col },
      });
    }
    if (this.state.finishNodePressed) { // Toggle Node at (row, col) to finish Node
      this.setState({
        finish: { row: row, col: col },
      });
    }
  }

  /**
   * @description Animate the Nodes in the grid according to order 
   * in which they have been visited by the algorithm
   * @param {Node[]} visitedNodesInOrder Array of Nodes visited in order
   * @param {Node[]} nodesInShortestPathOrder  Array of Nodes in the shortest path
   */
  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    const singleAnimationDuration = this.state.speedSeconds;

    // Traverse the visitedNodesInOrder array and set each Node to visited
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      // If it is the last Node then animate the shortest path
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, singleAnimationDuration * i);
        return;
      }

      // Set Node to visited and change its HTML class
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, singleAnimationDuration * i);

      // Increase the visited Nodes count
      this.setState({ visited: i + 1 });
    }
  }

  /**
   * @description Animates the Nodes in the shortest path from start to end Node
   * @param {Node[]} nodesInShortestPathOrder Array of Nodes in the shortest path
   */
  animateShortestPath(nodesInShortestPathOrder) {
    const singleAnimationDuration = this.state.speedSeconds;

    // Shortest path length must be greater than 1 for an animation to happen
    // There's nothing to animate if the start and end Nodes are adjacent
    if (nodesInShortestPathOrder.length > 1) {
      // Traverse through the array and set each Node to the 'node-shortest-path' HTML class
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }, singleAnimationDuration * i);

        // Increase the counted Nodes count
        this.setState({ counted: i + 1 });
      }
    }
  }

  /**
   * @description Visualizes the chosen algorithm
   */
  visualize() {
    const { grid } = this.state;
    const startNode = grid[this.state.start.row][this.state.start.col];
    const finishNode = grid[this.state.finish.row][this.state.finish.col];
    // const visitedNodesInOrder =
    //   this.state.algorithm === "Dijkstra's"
    //     ? dijkstra(grid, startNode, finishNode)
    //     : astar(grid, startNode, finishNode);

    let visitedNodesInOrder = [];
    switch (this.state.algorithm) {
      case "Dijkstra's":
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        break;
      case "A*":
        visitedNodesInOrder = astar(grid, startNode, finishNode);
        break;
      default:
        break;
    }

    // Get the nodes in the shortest path
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    // Animate the algorithm
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  /**
   * @description Generates wall Nodes randomly
   */
  generateRandomMaze() {
    //const rows = 20, cols = 50;
    const {numRows, numCols} = this.state;
    let newGrid = [];
    for (let i = 0; i < Math.floor(Math.random() * numCols * numRows); i++) {
      const randomRow = Math.floor(Math.random() * numRows);
      const randomCol = Math.floor(Math.random() * numCols);
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

  /**
   * @description Sets the chosen algorithm. By default it is "Dijkstra's"
   * @param {*} event 
   */
  setAlgorithm(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  /**
   * @description Sets the chosen speed. By default it is "Fast", ie. 10ms
   * @param {*} event 
   */
  setSpeed(event) {
    const { name, value } = event.target;
    value === "Fast"
      ? this.setState({ [name]: value, speedSeconds: 10 })
      : value === "Average"
      ? this.setState({ [name]: value, speedSeconds: 50 })
      : this.setState({ [name]: value, speedSeconds: 100 });
  }

  /**
   * @description Shows the dimensions of the 'window' and of 'root'
   */
  showWidth() {
    console.log(
      `window.width: ${window.innerWidth} window.innerHeight: ${window.innerHeight}`
    );
    var root = document.getElementById("root");
    console.log(
      `root.clientWidth: ${root.clientWidth} root.clientHeight: ${root.clientHeight}`
    );
  }

  /**
   * @description Resets the grid WITHOUT reloading the page
   */
  reset(){
    const {grid, numRows, numCols} = this.state;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (grid[row][col].isStart) {
          document.getElementById(`node-${row}-${col}`).className = "node node-start";
        } else if (grid[row][col].isFinish) {
          document.getElementById(`node-${row}-${col}`).className = "node node-finish";
        } else {
          if(grid[row][col].isWall) grid[row][col].isWall = false
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    this.setState({grid, visited: 0, counted: 0})
  }

  /**
   * @description Resets the grid by reloading the page
   */
  // reset2() {
  //   //Hacky
  //   window.location.reload(false);
  // }

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
