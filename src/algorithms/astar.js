import {
  getUnvisitedNeighbours,
  updateUnvisitedNeighbours1,
} from "../util/common";

/**
 * @description Finds the shortest path between startNode and finishNode using the A* search algorithm
 * @param {Node[][]} grid Grid (2D array) of Nodes
 * @param {Node} startNode Start Node
 * @param {Node} finishNode Target Node
 * @returns {Node[]} Nodes that have been VISITED (NOT the shortest path)
 */
export function astar(grid, startNode, finishNode) {
  const closedList = [];
  const openList = [startNode]; //getAllNodes(grid);
  //openList.unshift(startNode);
  startNode.gscore = 0;
  startNode.fscore = ManhattanDistance(startNode, finishNode);

  while (!!openList.length) {
    sortNodesByFScore(openList);
    const currentNode = openList.shift();
    console.log(`currentNode: ${currentNode.col} ${currentNode.row}`);

    if (currentNode.isWall) continue;

    if (currentNode === finishNode) {
      console.log("closedList: ", closedList);
      return closedList;
    }

    currentNode.isVisited = true;
    closedList.push(currentNode);

    const neighbours = getUnvisitedNeighbours(currentNode, grid);
    for (const neighbour of neighbours) {
      if (!closedList.includes(neighbour)) {
        neighbour.gscore = currentNode.gscore + 1; //1 is the distance between currentNode and neighbour
        neighbour.hscore = ManhattanDistance(neighbour, finishNode);
        neighbour.fscore = neighbour.gscore + neighbour.hscore;

        if (!openList.includes(neighbour)) {
          openList.push(neighbour);
        }
      }
    }

    updateUnvisitedNeighbours1(currentNode, grid);
  }
}

/**
 * @description Manhattan distance between (x1,y1) and (x2,y2) is calculated as |x1-x2| + |y1-y2|
 * @param {Node} currentNode
 * @param {Node} targetNode
 * @returns Manhattan distance between currentNode and targetNode
 */
function ManhattanDistance(currentNode, targetNode) {
  const temp =
    Math.abs(currentNode.col - targetNode.col) +
    Math.abs(currentNode.row - targetNode.row);
  return temp;
}

/**
 * @description Sorts the entire grid by the f-score
 * @param {Node[][]} grid Grid (2D array) of Nodes
 */
function sortNodesByFScore(grid) {
  grid.sort((nodeA, nodeB) => nodeA.fscore - nodeB.fscore);
}
