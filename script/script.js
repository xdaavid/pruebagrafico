// Leer el archivo CSV y procesar los datos
fetch('emg_data.csv')
    .then(response => response.text())
    .then(data => {
        // Dividir el archivo CSV en líneas
        const lines = data.split('\n');
        
        // Obtener los primeros 50 datos EMG en formato numérico
        const emg_data = lines.slice(0, 50).map(line => parseFloat(line));

        // Mostrar los datos en la tabla en la página web
        const tableBody = document.getElementById('emg-data-table');
        for (let i = 0; i < emg_data.length; i++) {
            const row = document.createElement('tr');
            const indexCell = document.createElement('td');
            const dataCell = document.createElement('td');
            indexCell.textContent = i + 1;
            dataCell.textContent = emg_data[i];
            row.appendChild(indexCell);
            row.appendChild(dataCell);
            tableBody.appendChild(row);
        }

        // Calcular el promedio de los datos EMG
        const sum = emg_data.reduce((acc, value) => acc + value, 0);
        const average = sum / emg_data.length;

        // Mostrar el promedio en el HTML
        const averageElement = document.getElementById('average');
        averageElement.textContent = `Average: ${average.toFixed(2)}`;

        // Obtener los datos por encima del promedio
        const aboveAverageData = emg_data.filter(value => value > average);

        // Mostrar los datos por encima del promedio en el HTML
        const aboveAverageElement = document.getElementById('above-average');
        aboveAverageElement.textContent = `Data above average: ${aboveAverageData.join(', ')}`;

        // Crear el gráfico de líneas con Chart.js
        const ctx = document.getElementById('emg-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: emg_data.length }, (_, i) => i + 1),
                datasets: [{
                    label: 'EMG Data',
                    data: emg_data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Index'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'EMG Data'
                        }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error al cargar el archivo:', error));
