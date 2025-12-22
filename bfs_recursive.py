import time
from collections import deque
from maze import get_neighbors

def bfs_recursive(maze, start, exit_pos):
    """
    Recursive BFS simulation.
    Note: True recursive BFS is tricky; this simulates by recursing on queue processing.
    """
    start_time = time.time()
    n = len(maze)
    visited = [[False] * n for _ in range(n)]
    parent = [[None] * n for _ in range(n)]
    queue = deque([start])
    visited[start[0]][start[1]] = True
    nodes_visited = [1]  # use list to modify in recursion
    visited_order = [start]

    def recurse():
        if not queue:
            return None
        current = queue.popleft()
        if current == exit_pos:
            return current
        for neighbor in get_neighbors(current):
            if 0 <= neighbor[0] < n and 0 <= neighbor[1] < n and maze[neighbor[0]][neighbor[1]] == 0 and not visited[neighbor[0]][neighbor[1]]:
                visited[neighbor[0]][neighbor[1]] = True
                parent[neighbor[0]][neighbor[1]] = current
                queue.append(neighbor)
                visited_order.append(neighbor)
                nodes_visited[0] += 1
        return recurse()

    result = recurse()
    end_time = time.time()
    time_taken = end_time - start_time

    if result is None:
        return None, visited_order, time_taken, nodes_visited[0]

    # Reconstruct path
    path = []
    current = exit_pos
    while current is not None:
        path.append(current)
        current = parent[current[0]][current[1]]
    path.reverse()

    return path, visited_order, time_taken, nodes_visited[0]