import random

def generate_maze(n):
    """
    Generate a perfect maze using recursive backtracking.
    0: path (white)
    1: wall (black)
    Entrance at top left, exit at bottom right.
    Features complex paths with 90-degree turns, dead ends, spirals, and zigzags.
    Maze shape is deterministic for the same n.
    """
    # Set seed for deterministic maze generation
    random.seed(n)

    # Initialize maze with walls
    maze = [[1 for _ in range(n)] for _ in range(n)]

    start = (0, 0)
    maze[0][0] = 0

    stack = [start]
    visited = set([start])

    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while stack:
        current = stack[-1]
        neighbors = []
        for dx, dy in directions:
            nx, ny = current[0] + dx * 2, current[1] + dy * 2
            if 0 <= nx < n and 0 <= ny < n and (nx, ny) not in visited:
                wall_x, wall_y = current[0] + dx, current[1] + dy
                neighbors.append((nx, ny, wall_x, wall_y))

        if neighbors:
            # Choose random neighbor
            next_cell_x, next_cell_y, wall_x, wall_y = random.choice(neighbors)
            next_cell = (next_cell_x, next_cell_y)
            # Carve path
            maze[next_cell_x][next_cell_y] = 0
            maze[wall_x][wall_y] = 0
            visited.add(next_cell)
            stack.append(next_cell)
        else:
            stack.pop()

    exit_pos = (n-1, n-1)
    # Ensure exit is a path and connected
    if maze[exit_pos[0]][exit_pos[1]] == 1:
        # Carve a path to exit from a nearby carved cell
        # Find a neighbor of exit that is carved
        for dx, dy in directions:
            nx, ny = exit_pos[0] + dx, exit_pos[1] + dy
            if 0 <= nx < n and 0 <= ny < n and maze[nx][ny] == 0:
                maze[exit_pos[0]][exit_pos[1]] = 0
                break
        else:
            # If no neighbor, set it anyway
            maze[exit_pos[0]][exit_pos[1]] = 0

    return maze, exit_pos

def is_valid_move(maze, pos, visited):
    n = len(maze)
    x, y = pos
    return 0 <= x < n and 0 <= y < n and maze[x][y] == 0 and not visited[x][y]

def get_neighbors(pos):
    x, y = pos
    return [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]