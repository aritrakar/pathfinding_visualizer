import Queue from "../util/queue";
import {
  getUnvisitedNeighbours,
  updateUnvisitedNeighbours2,
} from "../util/common";

/**
 * @description Finds the shortest path between startNode and finishNode using the Breadth-First Search algorithm
 * @param {Node[][]} grid Grid (2D array) of Nodes
 * @param {Node} startNode Start Node
 * @param {Node} finishNode Target Node
 * @returns {Node[]} Nodes that have been VISITED (NOT the shortest path)
 */
export function bfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const queue = new Queue();
  startNode.isVisited = true;
  queue.enqueue(startNode);

  while (!queue.isEmpty()) {
    const currentNode = queue.dequeue();

    if (currentNode.isWall) continue;

    if (currentNode === finishNode) {
      return visitedNodesInOrder;
    }

    const neighbours = getUnvisitedNeighbours(currentNode, grid);
    for (const neighbour of neighbours) {
      neighbour.isVisited = true;
      queue.enqueue(neighbour);
      visitedNodesInOrder.push(neighbour);
    }
    updateUnvisitedNeighbours2(currentNode, neighbours);
  }
}
