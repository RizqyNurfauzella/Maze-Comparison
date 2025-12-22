document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate');
    const runIterativeBtn = document.getElementById('run-iterative');
    const runRecursiveBtn = document.getElementById('run-recursive');
    const runDfsBtn = document.getElementById('run-dfs');
    const runAnalysisBtn = document.getElementById('run-analysis');
    const viewTableRadio = document.getElementById('view-table');
    const viewGraphRadio = document.getElementById('view-graph');
    const playPauseBtn = document.getElementById('play-pause');
    const resetBtn = document.getElementById('reset');
    const progressInput = document.getElementById('progress');
    const speedInput = document.getElementById('speed');
    const speedValue = document.getElementById('speed-value');
    const mazeDiv = document.getElementById('maze');
    const iterativeResult = document.getElementById('iterative-result');
    const recursiveResult = document.getElementById('recursive-result');
    const dfsResult = document.getElementById('dfs-result');
    const analysisContent = document.getElementById('analysis-content');
    const exportControls = document.getElementById('export-controls');
    const exportTableBtn = document.getElementById('export-table');
    const downloadChartBtn = document.getElementById('download-chart');
    const analysisN = document.getElementById('analysis-n');

    let currentAnimation = null;
    let isPlaying = false;
    let animationSpeed = 5; // 1-10
    let animationData = null; // {visited, path, className}
    let currentStep = 0;
    let totalSteps = 0;

    let currentMaze = null;
    let n = 15;
    let start = [0, 0];
    let exit = [14, 14]; // will be set randomly

    generateBtn.addEventListener('click', generateMaze);
    runIterativeBtn.addEventListener('click', runIterative);
    runRecursiveBtn.addEventListener('click', runRecursive);
    runDfsBtn.addEventListener('click', runDfs);
    runAnalysisBtn.addEventListener('click', runAnalysis);
    viewTableRadio.addEventListener('change', updateView);
    viewGraphRadio.addEventListener('change', updateView);
    exportTableBtn.addEventListener('click', exportTableToCSV);
    downloadChartBtn.addEventListener('click', downloadChartImage);
    playPauseBtn.addEventListener('click', togglePlayPause);
    resetBtn.addEventListener('click', resetAnimation);
    progressInput.addEventListener('input', updateProgress);
    speedInput.addEventListener('input', updateSpeed);

    function generateMaze() {
        n = parseInt(document.getElementById('n').value);
        start = [0, 0];

        fetch('/generate_maze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ n: n }),
        })
        .then(response => response.json())
        .then(data => {
            currentMaze = data.maze;
            exit = data.exit;
            renderMaze(currentMaze);

            // Auto-run analysis for large n
            if (n > 70) {
                document.getElementById('analysis-n').value = n;
                runAnalysis();
            }
        });
    }

    function renderMaze(maze) {
        mazeDiv.innerHTML = '';
        if (n > 70) {
            mazeDiv.innerHTML = '<p>Maze too large to display. Use Analysis for performance metrics.</p>';
            return;
        }
        mazeDiv.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
        mazeDiv.style.gridTemplateRows = `repeat(${n}, 1fr)`;

        // Adjust cell size for large mazes
        const cellSize = n > 50 ? Math.max(5, 500 / n) : 30;
        mazeDiv.style.setProperty('--cell-size', `${cellSize}px`);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                if (maze[i][j] === 1) {
                    cell.classList.add('wall');
                } else {
                    cell.classList.add('path');
                }
                if (i === start[0] && j === start[1]) {
                    cell.classList.add('start');
                    cell.textContent = 'S';
                }
                if (i === exit[0] && j === exit[1]) {
                    cell.classList.add('exit');
                    cell.textContent = 'E';
                }
                mazeDiv.appendChild(cell);
            }
        }
    }

    function runIterative() {
        if (!currentMaze) {
            alert('Generate maze first!');
            return;
        }
        fetch('/run_bfs_iterative', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ maze: currentMaze, start: start, exit: exit }),
        })
        .then(response => response.json())
        .then(data => {
            displayResult(data, 'iterative', iterativeResult);
            animationData = { visited: data.visited, path: data.path, className: 'iterative-path' };
            totalSteps = data.visited.length + data.path.length;
            resetAnimation();
        });
    }

    function runRecursive() {
        if (!currentMaze) {
            alert('Generate maze first!');
            return;
        }
        fetch('/run_bfs_recursive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ maze: currentMaze, start: start, exit: exit }),
        })
        .then(response => response.json())
        .then(data => {
            displayResult(data, 'recursive', recursiveResult);
            animationData = { visited: data.visited, path: data.path, className: 'recursive-path' };
            totalSteps = data.visited.length + data.path.length;
            resetAnimation();
        });
    }

    function runDfs() {
        if (!currentMaze) {
            alert('Generate maze first!');
            return;
        }
        fetch('/run_dfs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ maze: currentMaze, start: start, exit: exit }),
        })
        .then(response => response.json())
        .then(data => {
            displayResult(data, 'dfs', dfsResult);
            animationData = { visited: data.visited, path: data.path, className: 'dfs-path' };
            totalSteps = data.visited.length + data.path.length;
            resetAnimation();
        });
    }

    function runAnalysis() {
        const maxN = parseInt(analysisN.value);
        const sizes = [];
        for (let i = 5; i <= maxN; i += 5) {
            sizes.push(i);
        }
        console.log('Running analysis for sizes:', sizes);
        fetch('/run_analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sizes: sizes }),
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Analysis data:', data);
            displayAnalysis(data);
        })
        .catch(error => {
            console.error('Error in runAnalysis:', error);
        });
    }

    let analysisData = null;

    function displayAnalysis(data) {
        analysisData = data;
        updateView();
    }

    function updateView() {
        if (!analysisData) return;
        const view = document.querySelector('input[name="view"]:checked').value;
        if (view === 'table') {
            // Table
            let tableHtml = '<table id="analysis-table"><thead><tr><th>N</th><th>BFS Iterative Time (s)</th><th>BFS Recursive Time (s)</th><th>DFS Time (s)</th><th>BFS Iterative Nodes</th><th>BFS Recursive Nodes</th><th>DFS Nodes</th></tr></thead><tbody>';
            for (let i = 0; i < analysisData.sizes.length; i++) {
                tableHtml += `<tr><td>${analysisData.sizes[i]}</td><td>${analysisData.iterative_times[i].toFixed(6)}</td><td>${analysisData.recursive_times[i].toFixed(6)}</td><td>${analysisData.dfs_times[i].toFixed(6)}</td><td>${analysisData.iterative_nodes[i]}</td><td>${analysisData.recursive_nodes[i]}</td><td>${analysisData.dfs_nodes[i]}</td></tr>`;
            }
            tableHtml += '</tbody></table>';
            analysisContent.innerHTML = tableHtml;
            exportControls.style.display = 'flex';
        } else {
            // Graph
            analysisContent.innerHTML = '<img id="analysis-chart-img" src="/static/analysis.png" alt="Analysis Chart" style="max-width: 100%; height: auto;">';
            exportControls.style.display = 'flex';
        }
    }

    function togglePlayPause() {
        if (!animationData) {
            alert('Run an algorithm first!');
            return;
        }
        if (isPlaying) {
            pauseAnimation();
        } else {
            startAnimation();
        }
    }

    function resetAnimation() {
        if (currentAnimation) {
            clearTimeout(currentAnimation);
        }
        isPlaying = false;
        playPauseBtn.textContent = 'Play';
        currentStep = 0;
        progressInput.value = 0;
        // Clear previous animation
        const cells = mazeDiv.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('iterative-path', 'recursive-path', 'dfs-path', 'visited');
        });
        // Re-render maze
        renderMaze(currentMaze);
    }

    function startAnimation() {
        if (!animationData) return;
        isPlaying = true;
        playPauseBtn.textContent = 'Pause';
        animateBFS(animationData.visited, animationData.path, animationData.className);
    }

    function pauseAnimation() {
        isPlaying = false;
        playPauseBtn.textContent = 'Play';
        if (currentAnimation) {
            clearTimeout(currentAnimation);
            currentAnimation = null;
        }
    }

    function updateSpeed() {
        animationSpeed = parseInt(speedInput.value);
        speedValue.textContent = animationSpeed + 'x';
    }

    function exportTableToCSV() {
        if (!analysisData) {
            alert('No analysis data to export!');
            return;
        }

        let csvContent = 'N,BFS Iterative Time (s),BFS Recursive Time (s),DFS Time (s),BFS Iterative Nodes,BFS Recursive Nodes,DFS Nodes\n';
        for (let i = 0; i < analysisData.sizes.length; i++) {
            csvContent += `${analysisData.sizes[i]},${analysisData.iterative_times[i].toFixed(6)},${analysisData.recursive_times[i].toFixed(6)},${analysisData.dfs_times[i].toFixed(6)},${analysisData.iterative_nodes[i]},${analysisData.recursive_nodes[i]},${analysisData.dfs_nodes[i]}\n`;
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'algorithm_analysis.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function downloadChartImage() {
        const img = document.getElementById('analysis-chart-img');
        if (!img) {
            alert('No chart to download!');
            return;
        }

        const link = document.createElement('a');
        link.href = img.src;
        link.download = 'algorithm_analysis_chart.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function updateProgress() {
        if (!animationData) return;
        const progress = parseInt(progressInput.value);
        currentStep = Math.floor((progress / 100) * totalSteps);
        renderAnimationAtStep(currentStep);
    }

    function renderAnimationAtStep(step) {
        const cells = mazeDiv.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('iterative-path', 'recursive-path', 'dfs-path', 'visited');
        });

        const visitedEnd = Math.min(step, animationData.visited.length);
        for (let i = 0; i < visitedEnd; i++) {
            const pos = animationData.visited[i];
            const index = pos[0] * n + pos[1];
            if (cells[index] && !cells[index].classList.contains('start') && !cells[index].classList.contains('exit')) {
                cells[index].classList.add('visited');
            }
        }

        const pathStart = Math.max(0, step - animationData.visited.length);
        for (let i = 0; i < pathStart; i++) {
            const pos = animationData.path[i];
            const index = pos[0] * n + pos[1];
            if (cells[index] && !cells[index].classList.contains('start') && !cells[index].classList.contains('exit')) {
                cells[index].classList.remove('visited');
                cells[index].classList.add(animationData.className);
            }
        }
    }

    function displayResult(data, type, element) {
        const algoName = type === 'dfs' ? 'DFS' : `${type.charAt(0).toUpperCase() + type.slice(1)} BFS`;
        if (data.path) {
            element.innerHTML = `
                <h3>${algoName}</h3>
                <p>Path Length: ${data.path.length}</p>
                <p>Time: ${data.time.toFixed(6)} seconds</p>
                <p>Nodes Visited: ${data.nodes}</p>
            `;
        } else {
            element.innerHTML = `<h3>${algoName}</h3><p>No path found</p>`;
        }
    }

    function animateBFS(visited, path, className) {
        if (!isPlaying) return;

        const cells = mazeDiv.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('iterative-path', 'recursive-path', 'dfs-path', 'visited');
        });

        let i = 0;
        const animateVisited = () => {
            if (!isPlaying) return;
            if (i < visited.length) {
                const pos = visited[i];
                const index = pos[0] * n + pos[1];
                if (cells[index] && !cells[index].classList.contains('start') && !cells[index].classList.contains('exit')) {
                    cells[index].classList.add('visited');
                }
                i++;
                currentStep++;
                progressInput.value = (currentStep / totalSteps) * 100;
                currentAnimation = setTimeout(animateVisited, 100 / animationSpeed); // Speed adjusted
            } else {
                // After visited, animate path
                animatePath(path, className);
            }
        };
        animateVisited();
    }

    function animatePath(path, className) {
        if (!isPlaying) return;

        const cells = mazeDiv.querySelectorAll('.cell');
        let j = 0;
        const animate = () => {
            if (!isPlaying) return;
            if (j < path.length) {
                const pos = path[j];
                const index = pos[0] * n + pos[1];
                if (cells[index] && !cells[index].classList.contains('start') && !cells[index].classList.contains('exit')) {
                    cells[index].classList.remove('visited');
                    cells[index].classList.add(className);
                }
                j++;
                currentStep++;
                progressInput.value = (currentStep / totalSteps) * 100;
                currentAnimation = setTimeout(animate, 200 / animationSpeed); // Speed adjusted for path
            } else {
                isPlaying = false;
                playPauseBtn.textContent = 'Play';
            }
        };
        animate();
    }

    // Generate initial maze
    generateMaze();
});