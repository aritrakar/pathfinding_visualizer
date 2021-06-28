import Stack from "../util/stack";
import {
  getUnvisitedNeighbours,
  updateUnvisitedNeighbours2,
} from "../util/common";

/**
 * @description Finds the shortest path between startNode and finishNode using the Depth-First Search algorithm
 * @param {Node[][]} grid Grid (2D array) of Nodes
 * @param {Node} startNode Start Node
 * @param {Node} finishNode Target Node
 * @returns {Node[]} Nodes that have been VISITED (NOT the shortest path)
 */
export function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const stack = new Stack();
  stack.push(startNode);

  while (!stack.isEmpty()) {
    const currentNode = stack.pop();

    if (currentNode.isWall) continue;

    if (currentNode === finishNode) {
      return visitedNodesInOrder;
    }

    const neighbours = getUnvisitedNeighbours(currentNode, grid);
    if (!currentNode.isVisited) {
      currentNode.isVisited = true;

      for (const neighbour of neighbours) {
        stack.push(neighbour);
        visitedNodesInOrder.push(neighbour);
      }
    }
    updateUnvisitedNeighbours2(currentNode, neighbours);
  }
}
