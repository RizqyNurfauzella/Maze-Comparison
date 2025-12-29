import time
import sys
import matplotlib.pyplot as plt
from maze import generate_maze
from dfs import dfs_iterative, dfs_recursive_main

# Increase recursion limit for larger mazes
sys.setrecursionlimit(10000)

def analyze_complexity(sizes):
    iterative_times = []
    recursive_times = []
    iterative_nodes = []
    recursive_nodes = []

    for n in sizes:
        start = (0, 0)
        maze, exit_pos = generate_maze(n)

        # Iterative DFS
        path_i, _, time_i, nodes_i = dfs_iterative(maze, start, exit_pos)
        iterative_times.append(time_i)
        iterative_nodes.append(nodes_i)

        # Recursive DFS
        try:
            path_r, _, time_r, nodes_r = dfs_recursive_main(maze, start, exit_pos)
            recursive_times.append(time_r)
            recursive_nodes.append(nodes_r)
        except RecursionError:
            recursive_times.append(None)
            recursive_nodes.append(None)

    # No plotting needed, using Chart.js on client

    return {
        'sizes': sizes,
        'iterative_times': iterative_times,
        'recursive_times': recursive_times,
        'iterative_nodes': iterative_nodes,
        'recursive_nodes': recursive_nodes
    }

if __name__ == "__main__":
    sizes = [1, 5, 10, 15, 20, 30, 50, 100]
    analyze_complexity(sizes)