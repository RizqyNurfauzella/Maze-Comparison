import time
from maze import get_neighbors, is_valid_move

def dfs_recursive(maze, current, exit_pos, visited, visited_order, parent):
    """
    Recursive helper for DFS.
    """
    visited[current[0]][current[1]] = True
    visited_order.append(current)

    if current == exit_pos:
        return True

    for neighbor in get_neighbors(current):
        if is_valid_move(maze, neighbor, visited):
            parent[neighbor[0]][neighbor[1]] = current
            if dfs_recursive(maze, neighbor, exit_pos, visited, visited_order, parent):
                return True

    return False

def dfs_iterative(maze, start, exit_pos):
    """
    Iterative DFS to find path in maze.
    Note: DFS does not guarantee shortest path.
    Returns: path (list of positions), visited_order (list), time_taken, nodes_visited
    """
    start_time = time.perf_counter()
    n = len(maze)
    visited = [[False] * n for _ in range(n)]
    parent = [[None] * n for _ in range(n)]
    visited_order = []
    stack = [start]
    found = False

    while stack:
        current = stack.pop()
        if not visited[current[0]][current[1]]:
            visited_order.append(current)
            visited[current[0]][current[1]] = True
            if current == exit_pos:
                found = True
                break            
            neighbors = get_neighbors(current)
            for neighbor in reversed(neighbors):
                if is_valid_move(maze, neighbor, visited):
                    parent[neighbor[0]][neighbor[1]] = current
                    stack.append(neighbor)

    end_time = time.perf_counter()
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

def dfs_recursive_main(maze, start, exit_pos):
    """
    Recursive DFS to find path in maze.
    Note: DFS does not guarantee shortest path.
    Returns: path (list of positions), visited_order (list), time_taken, nodes_visited
    """
    start_time = time.perf_counter()
    n = len(maze)
    visited = [[False] * n for _ in range(n)]
    parent = [[None] * n for _ in range(n)]
    visited_order = []

    found = dfs_recursive(maze, start, exit_pos, visited, visited_order, parent)

    end_time = time.perf_counter()
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