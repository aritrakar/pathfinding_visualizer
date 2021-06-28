import React from "react";
import "./Node.css";

/** 
 * @class Represents a node in the grid which can be the 
 * starting node, the ending node or a wall.
 * @prop {Number} row The row of the Node
 * @prop {number} col The col of the Node
 * @prop {boolean} isStart Is the Node a starting node
 * @prop {boolean} isFinish Is the Node an ending node
 * @prop {boolean} isVisited Has the Node been visited
 * @prop {function} onMouseUp Function to execute when mouse is up (released)
 * @prop {function} onMouseDown Function to execute when mouse is down (clicked)
 * @prop {function} onMouseEnter Function to execute when mouse enters the Node
 */
export default class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      row,
      col,
      isStart,
      isFinish,
      isVisited,
      isWall,
      onMouseUp,
      onMouseDown,
      onMouseEnter,
    } = this.props;

    // Add extra class name for start, finish, wall or visited node
    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isWall
      ? "node-wall"
      : isVisited
      ? "node-visited"
      : "";
    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp(row, col)}
      ></div>
    );
  }
}
