<template>
    <div class="dashboard py-5 bg-gray-100 flex justify-center h-full">
      <!-- <div v-if="loading" class="text-center text-lg py-5">Carregando gráficos...</div> -->
      <div v-if="loading" class="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50">
          <Loader />
      </div>
      <div class="charts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
        <div class="chart-card bg-white rounded-lg shadow-md p-5 flex flex-col max-h-[400px]">
          <h3 class="mb-4 text-base text-gray-800">Inscrições por Polo Ofertante</h3>
          <canvas ref="inscricoesChart"></canvas>
        </div>
        <div class="chart-card bg-white rounded-lg shadow-md p-5 flex flex-col max-h-[400px]">
          <h3 class="mb-4 text-base text-gray-800">Tipo de Escola</h3>
          <canvas ref="escolaChart"></canvas>
        </div>
        <div class="chart-card bg-white rounded-lg shadow-md p-5 flex flex-col max-h-[400px]">
          <h3 class="mb-4 text-base text-gray-800">Distribuição por Gênero</h3>
          <canvas ref="generoChart"></canvas>
        </div>
        <div class="chart-card bg-white rounded-lg shadow-md p-5 flex flex-col max-h-[400px]">
          <h3 class="mb-4 text-base text-gray-800">Estado Civil</h3>
          <canvas ref="estadoCivilChart"></canvas>
        </div>
        <div class="chart-card bg-white rounded-lg shadow-md p-5 flex flex-col max-h-[400px]">
          <h3 class="mb-4 text-base text-gray-800">Renda per Capita</h3>
          <canvas ref="rendaChart"></canvas>
        </div>
        <div class="chart-card bg-white rounded-lg shadow-md p-5 flex flex-col max-h-[400px]">
          <h3 class="mb-4 text-base text-gray-800">Distribuição por Etnia</h3>
          <canvas ref="etniaChart"></canvas>
        </div>
        <div class="chart-card bg-white rounded-lg shadow-md p-5 flex flex-col max-h-[400px]">
          <h3 class="mb-4 text-base text-gray-800">Área de Residência</h3>
          <canvas ref="residenciaChart"></canvas>
        </div>
        <div class="chart-card bg-white rounded-lg shadow-md p-5 flex flex-col max-h-[400px]">
          <h3 class="mb-4 text-base text-gray-800">Nível de Escolaridade</h3>
          <canvas ref="escolaridadeChart"></canvas>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue';
  import Chart from 'chart.js/auto';
  
  const loading = ref(true);
  const inscricoesChart = ref(null);
  const escolaChart = ref(null);
  const generoChart = ref(null);
  const estadoCivilChart = ref(null);
  const rendaChart = ref(null);
  const etniaChart = ref(null);
  const residenciaChart = ref(null);
  const escolaridadeChart = ref(null);
  const charts = ref([]);
  const chartData = ref(null);
  
  onMounted(async () => {
    await fetchData();
    await nextTick();
    createCharts(chartData.value);
  });
  
  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/graficos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }
      });
      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }
      const data = await response.json();
      chartData.value = data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      loading.value = false;
    }
  };
  
  const createCharts = (data) => {
    if (!data) return;
  
    if (inscricoesChart.value) {
      charts.value.push(new Chart(inscricoesChart.value, {
        type: 'bar',
        data: {
          labels: data.inscricoes_por_polo.map(item => `${item.polo_ofertante__nome}`),
          datasets: [{
            label: 'Inscrições',
            data: data.inscricoes_por_polo.map(item => item.total),
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Inscrições por Polo Ofertante'
            }
          }
        }
      }));
    }
  
    if (escolaChart.value) {
      charts.value.push(new Chart(escolaChart.value, {
        type: 'pie',
        data: {
          labels: data.tipo_escola.map(item => item.escola_tipo),
          datasets: [{
            data: data.tipo_escola.map(item => item.total),
            backgroundColor: ['rgba(255, 206, 86, 0.6)', 'rgba(54, 162, 235, 0.6)']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Tipo de Escola'
            }
          }
        }
      }));
    }
  
    if (generoChart.value) {
      charts.value.push(new Chart(generoChart.value, {
        type: 'pie',
        data: {
          labels: data.distribuicao_genero.map(item => item.genero_tipo),
          datasets: [{
            data: data.distribuicao_genero.map(item => item.total),
            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Distribuição por Gênero'
            }
          }
        }
      }));
    }

    if (estadoCivilChart.value) {
      charts.value.push(new Chart(estadoCivilChart.value, {
        type: 'bar',
        data: {
          labels: data.estado_civil.map(item => `${item.estado_civil_tipo}`),
          datasets: [{
            label: 'Inscrições',
            data: data.estado_civil.map(item => item.total),
            backgroundColor: 'rgba(204, 153, 255, 0.6)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Inscrições por Estado Civil'
            }
          }
        }
      }));
    }

    if (rendaChart.value) {
      charts.value.push(new Chart(rendaChart.value, {
        type: 'bar',
        data: {
          labels: data.renda_per_capita.map(item => `${item.renda_tipo}`),
          datasets: [{
            label: 'Inscrições',
            data: data.renda_per_capita.map(item => item.total),
            backgroundColor: 'rgba(255, 153, 102, 0.6)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Inscrições por Renda per Capita'
            }
          }
        }
      }));
    }

    if (etniaChart.value) {
      charts.value.push(new Chart(etniaChart.value, {
        type: 'pie',
        data: {
          labels: data.distribuicao_etnia.map(item => `${item.etnia_tipo}`),
          datasets: [{
            label: 'Inscrições',
            data: data.distribuicao_etnia.map(item => item.total),
            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Inscrições por Etnia'
            }
          }
        }
      }));
    }
        
    if (residenciaChart.value) {
      charts.value.push(new Chart(residenciaChart.value, {
        type: 'bar',
        data: {
          labels: data.area_residencia.map(item => `${item.area_tipo}`),
          datasets: [{
            label: 'Inscrições',
            data: data.area_residencia.map(item => item.total),
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Inscrições por Área de Residência'
            }
          }
        }
      }));
    }

    if (escolaridadeChart.value) {
      charts.value.push(new Chart(escolaridadeChart.value, {
        type: 'pie',
        data: {
          labels: data.nivel_escolaridade.map(item => `${item.escolaridade_tipo}`),
          datasets: [{
            label: 'Inscrições',
            data: data.nivel_escolaridade.map(item => item.total),
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Inscrições por Nível de Escolaridade'
            }
          }
        }
      }));
    }
  };
  </script>
  