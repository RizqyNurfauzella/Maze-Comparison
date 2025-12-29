import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
plt.ioff()

from flask import Flask, render_template, request, jsonify
from maze import generate_maze
from dfs import dfs_iterative, dfs_recursive_main
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
    start_pos = (0, 0)  # As per maze generation
    return jsonify({'maze': maze, 'start': start_pos, 'exit': exit_pos})

@app.route('/run_dfs_iterative', methods=['POST'])
def run_dfs_iterative():
    data = request.json
    maze = data['maze']
    start = tuple(data['start'])
    exit_pos = tuple(data['exit'])
    path, visited_order, time_taken, nodes = dfs_iterative(maze, start, exit_pos)
    return jsonify({'path': path, 'visited': visited_order, 'time': time_taken, 'nodes': nodes})

@app.route('/run_dfs_recursive', methods=['POST'])
def run_dfs_recursive():
    data = request.json
    maze = data['maze']
    start = tuple(data['start'])
    exit_pos = tuple(data['exit'])
    path, visited_order, time_taken, nodes = dfs_recursive_main(maze, start, exit_pos)
    return jsonify({'path': path, 'visited': visited_order, 'time': time_taken, 'nodes': nodes})

@app.route('/run_analysis', methods=['POST'])
def run_analysis():
    data = request.json
    sizes = data.get('sizes', [5, 10, 15, 20])
    result = analyze_complexity(sizes)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)