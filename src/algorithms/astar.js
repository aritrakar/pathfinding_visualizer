/**
 * @description Finds the shortest path between startNode and finishNode using the A* search algorithm
 * @param {Node[][]} grid Grid (2D array) of Nodes
 * @param {Node} startNode Start Node
 * @param {Node} finishNode Target Node
 * @returns {Node[]} Nodes in the shortest path
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

    //if (currentNode.distance === Infinity) return false;

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

    updateUnvisitedNeighbours(currentNode, grid);
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

// function getAllNodes(grid) {
//   const nodes = [];
//   for (const row of grid) {
//     for (const node of row) {
//       nodes.push(node);
//     }
//   }
//   return nodes;
// }

/**
 * @param {Node} node Node whose neighbours are fetched
 * @param {Node[][]} grid Grid (2D array) of Nodes
 * @returns {Node[]} Unvisited neighbours of Node node as a 1D array
 */
function getUnvisitedNeighbours(node, grid) {
  const neighbours = [];
  const { col, row } = node;
  //Top
  if (row > 0) {
    neighbours.push(grid[row - 1][col]);
  }
  //Bottom
  if (row < grid.length - 1) {
    neighbours.push(grid[row + 1][col]);
  }
  //Left
  if (col > 0) {
    neighbours.push(grid[row][col - 1]);
  }
  //Right
  if (col < grid[row].length - 1) {
    neighbours.push(grid[row][col + 1]);
  }
  return neighbours.filter((neighbour) => !neighbour.isVisited);
}

/**
 * @description Sets the visited state of the neighbours of Node node to true.
 * @param {Node} node Node whose neighbours have to be updated
 * @param {Node[][]} grid Grid (2D array) of Nodes
 */
function updateUnvisitedNeighbours(node, grid) {
  const neighbours = getUnvisitedNeighbours(node, grid);
  for (const neighbour of neighbours) {
    neighbour.distance = node.distance + 1;
    neighbour.previousNode = node;
  }
}

/**
 * @description Gets the Nodes in the shortest path from start to target
 * @param {Node} finishNode The target Node
 * @returns {Node[]} Array containing Nodes in shortest path
 */
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
