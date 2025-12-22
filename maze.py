import random

def generate_maze(n):
    """
    Generate a simple maze as a 2D list.
    0: path
    1: wall
    start and exit are set to 0.
    Randomly place some walls, but ensure start and exit are paths.
    """
    maze = [[0 for _ in range(n)] for _ in range(n)]

    # Set start and exit as paths
    start = (0, 0)
    exit_pos = (n-1, n-1)
    maze[start[0]][start[1]] = 0
    maze[exit_pos[0]][exit_pos[1]] = 0

    # Randomly add walls, but not on start or exit
    for i in range(n):
        for j in range(n):
            if (i, j) != start and (i, j) != exit_pos:
                if random.random() < 0.3:  # 30% chance of wall
                    maze[i][j] = 1

    return maze, exit_pos

def is_valid_move(maze, pos, visited):
    n = len(maze)
    x, y = pos
    return 0 <= x < n and 0 <= y < n and maze[x][y] == 0 and not visited[x][y]

def get_neighbors(pos):
    x, y = pos
    return [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]