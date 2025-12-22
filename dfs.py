import time
from maze import get_neighbors

def dfs(maze, start, exit_pos):
    """
    Recursive DFS to find path in maze.
    Note: DFS does not guarantee shortest path.
    Returns: path (list of positions), visited_order (list), time_taken, nodes_visited
    """
    start_time = time.time()
    n = len(maze)
    visited = [[False] * n for _ in range(n)]
    parent = [[None] * n for _ in range(n)]
    visited_order = []

    def recurse(current):
        visited_order.append(current)
        visited[current[0]][current[1]] = True
        if current == exit_pos:
            return True
        for neighbor in get_neighbors(current):
            if 0 <= neighbor[0] < n and 0 <= neighbor[1] < n and maze[neighbor[0]][neighbor[1]] == 0 and not visited[neighbor[0]][neighbor[1]]:
                parent[neighbor[0]][neighbor[1]] = current
                if recurse(neighbor):
                    return True
        return False

    found = recurse(start)
    end_time = time.time()
    time_taken = end_time - start_time
    nodes_visited = len(visited_order)

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