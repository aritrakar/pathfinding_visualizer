import { getAllNodes, updateUnvisitedNeighbours1 } from "../util/common";

/**
 * @description Finds the shortest path between startNode and finishNode using Dijkstra's shortest path algorithm
 * @param {Node[][]} grid Grid (2D array) of Nodes
 * @param {Node} startNode Start Node
 * @param {Node} finishNode Target Node
 * @returns {Node[]} Nodes that have been VISITED (NOT the shortest path)
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
    updateUnvisitedNeighbours1(closestNode, grid);
  }
}

/**
 * @description Sorts Nodes by distance
 * @param {Node[]} unvisitedNodes Array of unvisited Nodes
 */
function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance); //Absolute value?
}
