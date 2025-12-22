import time
import matplotlib.pyplot as plt
from maze import generate_maze
from bfs_iterative import bfs_iterative
from bfs_recursive import bfs_recursive
from dfs import dfs

def analyze_complexity(sizes):
    iterative_times = []
    recursive_times = []
    dfs_times = []
    iterative_nodes = []
    recursive_nodes = []
    dfs_nodes = []

    for n in sizes:
        start = (0, 0)
        maze, exit_pos = generate_maze(n)

        # Iterative
        path_i, _, time_i, nodes_i = bfs_iterative(maze, start, exit_pos)
        iterative_times.append(time_i)
        iterative_nodes.append(nodes_i)

        # Recursive
        path_r, _, time_r, nodes_r = bfs_recursive(maze, start, exit_pos)
        recursive_times.append(time_r)
        recursive_nodes.append(nodes_r)

        # DFS
        path_d, _, time_d, nodes_d = dfs(maze, start, exit_pos)
        dfs_times.append(time_d)
        dfs_nodes.append(nodes_d)

    # Plot times
    plt.figure(figsize=(10, 5))
    plt.subplot(1, 2, 1)
    plt.plot(sizes, iterative_times, label='Iterative BFS', marker='o')
    plt.plot(sizes, recursive_times, label='Recursive BFS', marker='o')
    plt.plot(sizes, dfs_times, label='DFS', marker='o')
    plt.xlabel('Maze Size (n x n)')
    plt.ylabel('Time (seconds)')
    plt.title('Running Time Comparison')
    plt.legend()
    plt.grid(True)

    # Plot nodes
    plt.subplot(1, 2, 2)
    plt.plot(sizes, iterative_nodes, label='Iterative BFS', marker='o')
    plt.plot(sizes, recursive_nodes, label='Recursive BFS', marker='o')
    plt.plot(sizes, dfs_nodes, label='DFS', marker='o')
    plt.xlabel('Maze Size (n x n)')
    plt.ylabel('Nodes Visited')
    plt.title('Nodes Visited Comparison')
    plt.legend()
    plt.grid(True)

    plt.tight_layout()
    plt.savefig('static/analysis.png')
    plt.close()

    return {
        'sizes': sizes,
        'iterative_times': iterative_times,
        'recursive_times': recursive_times,
        'dfs_times': dfs_times,
        'iterative_nodes': iterative_nodes,
        'recursive_nodes': recursive_nodes,
        'dfs_nodes': dfs_nodes
    }

if __name__ == "__main__":
    sizes = [5, 10, 15, 20, 25]
    analyze_complexity(sizes)