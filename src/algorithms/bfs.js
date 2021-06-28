import Queue from "../util/queue";
import { getUnvisitedNeighbours } from "../util/common";

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
      return visitedNodesInOrder;
    }

    const neighbours = getUnvisitedNeighbours(currentNode, grid);
    for (const neighbour of neighbours) {
      neighbour.isVisited = true;
      queue.enqueue(neighbour);
      visitedNodesInOrder.push(neighbour);
    }
    updateUnvisitedNeighbours(currentNode, neighbours);
  }
}

/**
 * @description Sets the visited state of the neighbours of Node node to true.
 * @param {Node} node Node whose neighbours have to be updated
 * @param {Node[][]} grid Grid (2D array) of Nodes
 */
function updateUnvisitedNeighbours(node, neighbours) {
  for (const neighbour of neighbours) {
    neighbour.previousNode = node;
  }
}
