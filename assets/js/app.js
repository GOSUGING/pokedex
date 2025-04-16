$(document).ready(function(){
    // Capturar los elementos del DOM
    const pokeForm = $('#pokeForm');
    const pokeNumber = $('#pokeNumber');
    const pokeResult = $('#pokeResult');
    let myChart = null; // Variable para almacenar el gráfico

    // Procesar el formulario
    pokeForm.on('submit', function (event) {
        event.preventDefault();
        
        // Remover clases is-valid is-invalid
        pokeNumber.removeClass('is-valid is-invalid');

        // Capturar lo que escribió el usuario en el input
        const pokeNumberUser = parseInt(pokeNumber.val());

        // Validar que esto sea un número, espacios en blanco, mayores a 0
        if (!isNaN(pokeNumberUser) && pokeNumberUser > 0){
            pokeNumber.addClass('is-valid');
            getPokemon(pokeNumberUser); // Pasar pokeNumberUser como argumento
        } else {
            pokeNumber.addClass('is-invalid');
        }
    });

    // Botón para buscar de nuevo
    $('#searchAgainBtn').on('click', function() {
        pokeResult.empty(); // Limpiar el resultado
        pokeNumber.val(''); // Limpiar el input
        pokeNumber.removeClass('is-valid is-invalid'); // Eliminar clases de validación
        if (myChart !== null) {
            myChart.destroy(); // Destruir el gráfico existente si existe
        }
    });

    // Consumir la API de Pokémon con Ajax
    const getPokemon = (pokeNumberFn) => {
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${pokeNumberFn}`,
            method: 'GET',
            success(data) {
                console.log(data);
           
                const myPokemon = {
                    image: data.sprites.other.dream_world.front_default,
                    name: data.name,
                    height: data.height,
                    weight: data.weight,
                    base_experience: data.base_experience,
                    types: data.types,
                    stats: data.stats // Array de estadísticas del Pokémon
                };
                
                let typesString = "";
                if (myPokemon.types && myPokemon.types.length) {
                    for (let i = 0; i < myPokemon.types.length; i++) {
                        typesString += myPokemon.types[i].type.name;
                        if (i < myPokemon.types.length - 1) {
                            typesString += ", ";
                        }
                    }
                }
                
                // Crear un objeto con las etiquetas y los valores para el gráfico
                const chartData = {
                    labels: myPokemon.stats.map(stat => stat.stat.name),
                    values: myPokemon.stats.map(stat => stat.base_stat)
                };

                if (myChart !== null) {
                    myChart.destroy(); // Destruir el gráfico existente si existe
                }
                createChart(chartData);

                // Actualizar el contenido de la lista de estadísticas del Pokémon
                pokeResult.html(`
                    <div class="card">
                        <img src="${myPokemon.image}" alt="" class="card-img-top" style="max-width: 50%; height: auto;">
                        <div class="card-body">
                            <h5>name: ${myPokemon.name}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">Experiencia Base: ${myPokemon.base_experience}</li>
                            <li class="list-group-item">height: ${myPokemon.height}</li>
                            <li class="list-group-item">weight: ${myPokemon.weight}</li>
                            <li class="list-group-item">types: ${typesString}</li>
                        </ul>
                    </div>
                `);
            },
            error(error) {
                console.log(error);
            }
        });
    };

  // Esta función crea el gráfico utilizando Chart.js
    function createChart(data) {
        const ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'doughnut', // Cambiar el tipo de gráfico a doughnut
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Estadísticas del Pokémon',
                    data: data.values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                        // Puedes agregar más colores si es necesario
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                        // Puedes agregar más colores si es necesario
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                // No necesitas definir escalas para el gráfico de tipo doughnut
            }            
        });
    }
});
