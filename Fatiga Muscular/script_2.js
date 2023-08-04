// Función para leer el archivo CSV y obtener los datos en formato numérico
function readCSV(file) {
    return fetch(file)
        .then(response => response.text())
        .then(data => data.split('\n').map(line => parseFloat(line)))
        .catch(error => {
            console.error('Error al cargar el archivo:', error);
            return [];
        });
}

// Calcular el promedio de los datos
function calculateAverage(data) {
    const sum = data.reduce((acc, value) => acc + value, 0);
    return sum / data.length;
}

// Leer los datos del archivo emg_data.csv
const emgDataPromise = readCSV('emg_data.csv');

// Leer los datos del archivo emg_data_2.csv
const emgData2Promise = readCSV('emg_data_2.csv');

// Procesar ambos archivos CSV y comparar los promedios
Promise.all([emgDataPromise, emgData2Promise])
    .then(([emgData, emgData2]) => {
        // Mostrar los datos en la tabla en la página web
        const tableBody = document.getElementById('emg-data-table');
        for (let i = 0; i < emgData2.length; i++) {
            const row = document.createElement('tr');
            const indexCell = document.createElement('td');
            const dataCell = document.createElement('td');
            indexCell.textContent = i + 1;
            dataCell.textContent = emgData2[i];
            row.appendChild(indexCell);
            row.appendChild(dataCell);
            tableBody.appendChild(row);
        }

        // Calcular el promedio de los datos EMG del archivo emg_data_2.csv
        const average2 = calculateAverage(emgData2);

        // Mostrar el promedio en el HTML
        const averageElement = document.getElementById('average');
        averageElement.textContent = `Average: ${average2.toFixed(2)}`;

        // Obtener los datos por encima del promedio del archivo emg_data_2.csv
        const aboveAverageData2 = emgData2.filter(value => value > average2);

        // Mostrar los datos por encima del promedio en el HTML
        const aboveAverageElement = document.getElementById('above-average');
        aboveAverageElement.textContent = `Data above average: ${aboveAverageData2.join(', ')}`;

        // Calcular el promedio del archivo emg_data.csv
        const average = calculateAverage(emgData);

        // Mostrar el mensaje de entrenamiento dependiendo de la comparación de promedios
        const messageElement = document.getElementById('training-message');
        if (average2 >= average) {
            messageElement.textContent = 'No presenta fatiga muscular';
        } else {
            messageElement.textContent = 'Presenta fatiga muscular';
        }

        // Crear el gráfico de líneas con Chart.js
        const ctx = document.getElementById('emg-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: emgData2.length }, (_, i) => i + 1),
                datasets: [{
                    label: 'EMG Data',
                    data: emgData2,
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
    });
