export function dijkstra(grid, startNode, finishNode) {
  /*
  if (!startNode || !finishNode || startNode === finishNode) {
    //Exceptional case with no startNode, no finishNode, or when they're equal
    return false;
  } */

  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (!!unvisitedNodes.length) {
    //Double negation meaning?
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift(); //removes closestNode from unvisitedNodes

    if (closestNode.isWall) {
      continue;
    }
    if (closestNode.distance === Infinity) {
      //When there are NO valid paths. Eg. walls around source or target
      visitedNodesInOrder.pop();
      return visitedNodesInOrder;
    }

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === finishNode) {
      return visitedNodesInOrder;
    }
    updateUnvisitedNeighbours(closestNode, grid);
  }
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

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

function updateUnvisitedNeighbours(node, grid) {
  const neighbours = getUnvisitedNeighbours(node, grid);
  for (const neighbour of neighbours) {
    neighbour.distance = node.distance + 1;
    neighbour.previousNode = node;
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance); //Absolute value?
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
