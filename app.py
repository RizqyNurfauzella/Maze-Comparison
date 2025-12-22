from flask import Flask, render_template, request, jsonify
from maze import generate_maze
from bfs_iterative import bfs_iterative
from bfs_recursive import bfs_recursive
from dfs import dfs
from analysis import analyze_complexity

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_maze', methods=['POST'])
def generate():
    data = request.json
    n = int(data['n'])
    maze, exit_pos = generate_maze(n)
    return jsonify({'maze': maze, 'exit': exit_pos})

@app.route('/run_bfs_iterative', methods=['POST'])
def run_iterative():
    data = request.json
    maze = data['maze']
    start = tuple(data['start'])
    exit_pos = tuple(data['exit'])
    path, visited_order, time_taken, nodes = bfs_iterative(maze, start, exit_pos)
    return jsonify({'path': path, 'visited': visited_order, 'time': time_taken, 'nodes': nodes})

@app.route('/run_bfs_recursive', methods=['POST'])
def run_recursive():
    data = request.json
    maze = data['maze']
    start = tuple(data['start'])
    exit_pos = tuple(data['exit'])
    path, visited_order, time_taken, nodes = bfs_recursive(maze, start, exit_pos)
    return jsonify({'path': path, 'visited': visited_order, 'time': time_taken, 'nodes': nodes})

@app.route('/run_dfs', methods=['POST'])
def run_dfs():
    data = request.json
    maze = data['maze']
    start = tuple(data['start'])
    exit_pos = tuple(data['exit'])
    path, visited_order, time_taken, nodes = dfs(maze, start, exit_pos)
    return jsonify({'path': path, 'visited': visited_order, 'time': time_taken, 'nodes': nodes})

@app.route('/run_analysis', methods=['POST'])
def run_analysis():
    data = request.json
    sizes = data.get('sizes', [5, 10, 15, 20, 25, 30])
    result = analyze_complexity(sizes)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)