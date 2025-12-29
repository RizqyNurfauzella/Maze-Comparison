document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate');
    const runDfsIterativeBtn = document.getElementById('run-dfs-iterative');
    const runDfsRecursiveBtn = document.getElementById('run-dfs-recursive');
    const runAnalysisBtn = document.getElementById('run-analysis');
    const viewTableRadio = document.getElementById('view-table');
    const viewLineRadio = document.getElementById('view-line');
    const viewBarRadio = document.getElementById('view-bar');
    const playPauseBtn = document.getElementById('play-pause');
    const resetBtn = document.getElementById('reset');
    const progressInput = document.getElementById('progress');
    const speedInput = document.getElementById('speed');
    const speedValue = document.getElementById('speed-value');
    const mazeDiv = document.getElementById('maze');
    const dfsIterativeResult = document.getElementById('dfs-iterative-result');
    const dfsRecursiveResult = document.getElementById('dfs-recursive-result');
    const analysisContent = document.getElementById('analysis-content');
    const exportControls = document.getElementById('export-controls');
    const exportTableBtn = document.getElementById('export-table');
    const downloadChartBtn = document.getElementById('download-chart');

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
    runDfsIterativeBtn.addEventListener('click', runDfsIterative);
    runDfsRecursiveBtn.addEventListener('click', runDfsRecursive);
    runAnalysisBtn.addEventListener('click', runAnalysis);
    viewTableRadio.addEventListener('change', updateView);
    viewLineRadio.addEventListener('change', updateView);
    viewBarRadio.addEventListener('change', updateView);
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
                runAnalysis();
            }
        });
    }

    function renderMaze(maze) {
        mazeDiv.innerHTML = '';
        if (n > 1000) {
            mazeDiv.innerHTML = '<p>Maze too large to display. Use Analysis for performance metrics.</p>';
            return;
        }
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


    function runDfsIterative() {
        if (!currentMaze) {
            alert('Generate maze first!');
            return;
        }
        fetch('/run_dfs_iterative', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ maze: currentMaze, start: start, exit: exit }),
        })
        .then(response => response.json())
        .then(data => {
            displayResult(data, 'DFS Iterative', dfsIterativeResult);
            animationData = { visited: data.visited, path: data.path, className: 'dfs-iterative-path' };
            totalSteps = data.visited.length + data.path.length;
            resetAnimation();
        });
    }

    function runDfsRecursive() {
        if (!currentMaze) {
            alert('Generate maze first!');
            return;
        }
        fetch('/run_dfs_recursive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ maze: currentMaze, start: start, exit: exit }),
        })
        .then(response => response.json())
        .then(data => {
            displayResult(data, 'DFS Recursive', dfsRecursiveResult);
            animationData = { visited: data.visited, path: data.path, className: 'dfs-recursive-path' };
            totalSteps = data.visited.length + data.path.length;
            resetAnimation();
        });
    }

    function runAnalysis() {
        // const maxN = n;  // Use the current maze size n
        const sizes = [1, 5, 10, 15, 20, 30, 50, 100];
        
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
            let tableHtml = '<div style="display:flex;justify-content:center;"><table id="analysis-table" style="margin:auto;"><thead><tr><th>N</th><th>DFS Iterative Time (µs)</th><th>DFS Recursive Time (µs)</th><th>DFS Iterative Nodes</th><th>DFS Recursive Nodes</th></tr></thead><tbody>';
            for (let i = 0; i < analysisData.sizes.length; i++) {
                const itTime = analysisData.iterative_times[i] !== null ? (analysisData.iterative_times[i] * 1e6).toFixed(2) + ' µs' : 'N/A';
                const recTime = analysisData.recursive_times[i] !== null ? (analysisData.recursive_times[i] * 1e6).toFixed(2) + ' µs' : 'N/A';
                const itNodes = analysisData.iterative_nodes[i] !== null ? analysisData.iterative_nodes[i] : 'N/A';
                const recNodes = analysisData.recursive_nodes[i] !== null ? analysisData.recursive_nodes[i] : 'N/A';
                tableHtml += `<tr><td>${analysisData.sizes[i]}</td><td>${itTime}</td><td>${recTime}</td><td>${itNodes}</td><td>${recNodes}</td></tr>`;
            }
            tableHtml += '</tbody></table></div>';
            analysisContent.innerHTML = tableHtml;
            exportControls.style.display = 'flex';
        } else if (view === 'line') {
            // Line Chart
            analysisContent.innerHTML = '<canvas id="analysis-chart" width="800" height="400"></canvas>';
            const ctx = document.getElementById('analysis-chart').getContext('2d');
            const datasets = [
                {
                    label: 'DFS Iterative Time (µs)',
                    data: analysisData.sizes.map((size, i) => ({ x: size, y: analysisData.iterative_times[i] !== null ? analysisData.iterative_times[i] * 1e6 : null })),
                    borderColor: 'blue',
                    fill: false
                },
                {
                    label: 'DFS Recursive Time (µs)',
                    data: analysisData.sizes.map((size, i) => analysisData.recursive_times[i] !== null ? { x: size, y: analysisData.recursive_times[i] * 1e6 } : null).filter(p => p !== null),
                    borderColor: 'red',
                    fill: false
                }
            ];
            new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: datasets
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Maze Size (n x n)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Time (µs)'
                            }
                        }
                    }
                }
            });
            exportControls.style.display = 'none';
        } else if (view === 'bar') {
            // Bar Chart
            analysisContent.innerHTML = '<canvas id="analysis-chart" width="800" height="400"></canvas>';
            const ctx = document.getElementById('analysis-chart').getContext('2d');
            const labels = analysisData.sizes.map(size => size.toString());
            const datasets = [
                {
                    label: 'DFS Iterative Time (µs)',
                    data: analysisData.iterative_times.map(t => t !== null ? t * 1e6 : 0),
                    backgroundColor: 'rgba(0, 0, 255, 0.5)',
                    borderColor: 'blue',
                    borderWidth: 1
                },
                {
                    label: 'DFS Recursive Time (µs)',
                    data: analysisData.recursive_times.map(t => t !== null ? t * 1e6 : 0),
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    borderColor: 'red',
                    borderWidth: 1
                }
            ];
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Maze Size (n x n)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Time (µs)'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
            exportControls.style.display = 'none';
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
            cell.classList.remove('dfs-iterative-path', 'dfs-recursive-path', 'visited');
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

        let csvContent = 'N,DFS Iterative Time (s),DFS Recursive Time (s),DFS Iterative Nodes,DFS Recursive Nodes\n';
        for (let i = 0; i < analysisData.sizes.length; i++) {
            const recTime = analysisData.recursive_times[i] !== null ? analysisData.recursive_times[i].toFixed(6) : 'N/A';
            const recNodes = analysisData.recursive_nodes[i] !== null ? analysisData.recursive_nodes[i] : 'N/A';
            csvContent += `${analysisData.sizes[i]},${analysisData.iterative_times[i].toFixed(6)},${recTime},${analysisData.iterative_nodes[i]},${recNodes}\n`;
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
            cell.classList.remove('dfs-iterative-path', 'dfs-recursive-path', 'visited');
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
        const algoName = 'DFS';
        if (data.path) {
            const timeS = data.time.toFixed(6);
            const timeUs = (data.time * 1e6).toFixed(2);
            element.innerHTML = `
                <h3>${algoName}</h3>
                <p>Path Length: ${data.path.length}</p>
                <p>Time: ${timeS} seconds / ${timeUs} µs</p>
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
            cell.classList.remove('dfs-iterative-path', 'dfs-recursive-path', 'visited');
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