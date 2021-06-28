import Stack from "../util/stack";
import { getUnvisitedNeighbours } from "../util/common";

export function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const stack = new Stack();
  stack.push(startNode);
  while (!stack.isEmpty()) {
    const currentNode = stack.pop();

    if (currentNode.isWall) continue;

    if (currentNode === finishNode) {
      console.log("FINISHED 1");
      console.log(stack.items);
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
