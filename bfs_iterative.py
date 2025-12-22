import time
from collections import deque
from maze import is_valid_move, get_neighbors

def bfs_iterative(maze, start, exit_pos):
    """
    Iterative BFS to find shortest path in maze.
    Returns: path (list of positions), visited_order (list), time_taken, nodes_visited
    """
    start_time = time.time()
    n = len(maze)
    visited = [[False] * n for _ in range(n)]
    parent = [[None] * n for _ in range(n)]
    queue = deque([start])
    visited[start[0]][start[1]] = True
    nodes_visited = 1
    visited_order = [start]

    found = False
    while queue:
        current = queue.popleft()
        if current == exit_pos:
            found = True
            break
        for neighbor in get_neighbors(current):
            if is_valid_move(maze, neighbor, visited):
                visited[neighbor[0]][neighbor[1]] = True
                parent[neighbor[0]][neighbor[1]] = current
                queue.append(neighbor)
                visited_order.append(neighbor)
                nodes_visited += 1

    end_time = time.time()
    time_taken = end_time - start_time

    if not found:
        return None, visited_order, time_taken, nodes_visited

    # Reconstruct path
    path = []
    current = exit_pos
    while current is not None:
        path.append(current)
        current = parent[current[0]][current[1]]
    path.reverse()

    return path, visited_order, time_taken, nodes_visited