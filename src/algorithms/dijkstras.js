/**
 * @description Finds the shortest path between startNode and finishNode using Dijkstra's shortest path algorithm
 * @param {Node[][]} grid Grid (2D array) of Nodes
 * @param {Node} startNode Start Node
 * @param {Node} finishNode Target Node
 * @returns {Node[]} Nodes in the shortest path
 */
export function dijkstra(grid, startNode, finishNode) {
  /*
  if (!startNode || !finishNode || startNode === finishNode) {
    //Exceptional case with no startNode, no finishNode, or when they're equal
    return false;
  } */

  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  // While there are still nodes to visit
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift(); //removes closestNode from unvisitedNodes

    // If the closest node is a wall
    if (closestNode.isWall) continue;

    //When there are NO valid paths. Eg. walls around source or target
    if (closestNode.distance === Infinity) {
      visitedNodesInOrder.pop();
      return visitedNodesInOrder;
    }

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // Found target
    if (closestNode === finishNode) {
      return visitedNodesInOrder;
    }
    updateUnvisitedNeighbours(closestNode, grid);
  }
}

/**
 * @param {Node[][]} grid Grid (2D array) of Nodes
 * @returns {Node[]} 1D rray containing all nodes in grid
 */
function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

/**
 * @description Gets the unvisited neighbours of Node node
 * @param {Node} node Node whose neighbours are fetched
 * @param {Node[][]} grid Grid (2D array) of Nodes
 * @returns
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
 * @description Sorts Nodes by distance
 * @param {Node[]} unvisitedNodes Array of unvisited Nodes
 */
function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance); //Absolute value?
}
