/**
 * @param {Node} node Node whose neighbours are fetched
 * @param {Node[][]} grid Grid (2D array) of Nodes
 * @returns Returns the unvisited neighbours of Node node as an array
 */
export function getUnvisitedNeighbours(node, grid) {
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
  return neighbours.filter(
    (neighbour) => !neighbour.isVisited && !neighbour.isWall
  );
}

/**
 * @description Gets the Nodes in the shortest path from start to finish.
 * Backtracks from the finishNode to find the shortest path.
 * Only works when called *after* the dijkstra method above.
 * @param {Node} finishNode Target Node
 * @returns {Node[]} Nodes in the shortest path as an array
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
