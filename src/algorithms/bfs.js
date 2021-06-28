import Queue from "../util/queue";

export function bfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const queue = new Queue();
  startNode.isVisited = true;
  queue.enqueue(startNode);

  while (!queue.isEmpty()) {
    const currentNode = queue.dequeue();
    console.log(`Visiting: ${currentNode.col} ${currentNode.row}`);

    if (currentNode.isWall) continue;

    if (currentNode === finishNode) {
      console.log("FINISHED 1");
      console.log(queue.items);
      //return currentNode;
      return visitedNodesInOrder;
    }

    const neighbours = getUnvisitedNeighbours(currentNode, grid);
    for (const neighbour of neighbours) {
      //if (!neighbour.isVisited) {
      neighbour.isVisited = true;
      queue.enqueue(neighbour);
      visitedNodesInOrder.push(neighbour);
      //}
    }
    updateUnvisitedNeighbours(currentNode, neighbours);
  }
  //   console.log("FINISHED 2");
  //   console.log(queue.items);
  //   return queue.items;
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
  return neighbours.filter(
    (neighbour) => !neighbour.isVisited && !neighbour.isWall
  );
}

/**
 * @description Sets the visited state of the neighbours of Node node to true.
 * @param {Node} node Node whose neighbours have to be updated
 * @param {Node[][]} grid Grid (2D array) of Nodes
 */
function updateUnvisitedNeighbours(node, neighbours) {
  //console.log(`UPDATING ${node.col} ${node.row}`);
  for (const neighbour of neighbours) {
    neighbour.previousNode = node;
  }
}
