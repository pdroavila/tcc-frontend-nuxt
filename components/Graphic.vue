<template>
  <div class="dashboard py-5 bg-gray-100 flex justify-center h-full">
    <div
      v-if="loading"
      class="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50"
    >
      <Loader />
    </div>

    <div
      class="charts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl"
    >
      <div class="chart-card col-span-full bg-white rounded-lg shadow-md p-5">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Overview</h3>
          <select
            v-model="selectedPolo"
            @change="debouncedPoloChange"
            class="px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os Polos</option>
            <option v-for="polo in polos" :key="polo.id" :value="polo.id">
              {{ polo.nome }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="stat-card bg-blue-50 p-4 rounded-lg">
            <h4 class="text-sm text-gray-600">Total de Inscrições</h4>
            <p class="text-2xl font-bold text-blue-600">
              {{ totalInscricoes }}
            </p>
          </div>
          <div class="stat-card bg-green-50 p-4 rounded-lg">
            <h4 class="text-sm text-gray-600">Média de Idade</h4>
            <p class="text-2xl font-bold text-green-600">
              {{ mediaIdade }} anos
            </p>
          </div>
          <div class="stat-card bg-purple-50 p-4 rounded-lg">
            <h4 class="text-sm text-gray-600">Renda Média</h4>
            <p class="text-2xl font-bold text-purple-600">{{ rendaMedia }}</p>
          </div>
        </div>
      </div>

      <div
        v-for="(chart, index) in chartDefinitions"
        :key="index"
        class="chart-card bg-white rounded-lg shadow-md p-5 flex flex-col max-h-[400px]"
      >
        <h3 class="mb-4 text-base text-gray-800">{{ chart.title }}</h3>
        <canvas :ref="chart.ref"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import Chart from "chart.js/auto";
import { getGraficos, getPolos, estatisticasPolo } from "~/services/apiService";

const loading = ref(true);
const charts = ref([]);
const chartData = ref(null);
const config = useRuntimeConfig();
const polos = ref([]);
const selectedPolo = ref("");
const totalInscricoes = ref(0);
const mediaIdade = ref(0);
const rendaMedia = ref("");

const inscricoesChart = ref(null);
const escolaChart = ref(null);
const generoChart = ref(null);
const estadoCivilChart = ref(null);
const rendaChart = ref(null);
const etniaChart = ref(null);
const residenciaChart = ref(null);
const escolaridadeChart = ref(null);

const destroyCharts = () => {
  charts.value.forEach((chart) => {
    if (chart) {
      try {
        if (chart.stop) chart.stop();

        requestAnimationFrame(() => {
          if (chart.destroy) chart.destroy();
        });
      } catch (e) {
        console.warn("Erro ao destruir gráfico:", e);
      }
    }
  });
  charts.value = [];
};

const fetchData = async (idPolo = null) => {
  try {
    const data = await getGraficos(config, idPolo);
    chartData.value = data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  } finally {
    loading.value = false;
  }
};

// Definições dos gráficos
const chartDefinitions = [
  {
    ref: inscricoesChart,
    title: "Inscrições por Polo Ofertante",
    type: "bar",
    getData: (data) => ({
      labels: data.inscricoes_por_polo.map((item) => item.polo_ofertante__nome),
      datasets: [
        {
          label: "Inscrições",
          data: data.inscricoes_por_polo.map((item) => item.total),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    }),
  },
  {
    ref: escolaChart,
    title: "Tipo de Escola",
    type: "pie",
    getData: (data) => ({
      labels: data.tipo_escola.map((item) => item.escola_tipo),
      datasets: [
        {
          data: data.tipo_escola.map((item) => item.total),
          backgroundColor: [
            "rgba(255, 206, 86, 0.6)",
            "rgba(54, 162, 235, 0.6)",
          ],
        },
      ],
    }),
  },
  {
    ref: generoChart,
    title: "Distribuição por Gênero",
    type: "pie",
    getData: (data) => ({
      labels: data.distribuicao_genero.map((item) => item.genero_tipo),
      datasets: [
        {
          data: data.distribuicao_genero.map((item) => item.total),
          backgroundColor: [
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
        },
      ],
    }),
  },
  {
    ref: estadoCivilChart,
    title: "Estado Civil",
    type: "bar",
    getData: (data) => ({
      labels: data.estado_civil.map((item) => item.estado_civil_tipo),
      datasets: [
        {
          label: "Inscrições",
          data: data.estado_civil.map((item) => item.total),
          backgroundColor: "rgba(204, 153, 255, 0.6)",
        },
      ],
    }),
  },
  {
    ref: rendaChart,
    title: "Renda per Capita",
    type: "bar",
    getData: (data) => ({
      labels: data.renda_per_capita.map((item) => item.renda_tipo),
      datasets: [
        {
          label: "Inscrições",
          data: data.renda_per_capita.map((item) => item.total),
          backgroundColor: "rgba(255, 153, 102, 0.6)",
        },
      ],
    }),
  },
  {
    ref: etniaChart,
    title: "Distribuição por Etnia",
    type: "pie",
    getData: (data) => ({
      labels: data.distribuicao_etnia.map((item) => item.etnia_tipo),
      datasets: [
        {
          data: data.distribuicao_etnia.map((item) => item.total),
          backgroundColor: [
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
        },
      ],
    }),
  },
  {
    ref: residenciaChart,
    title: "Área de Residência",
    type: "bar",
    getData: (data) => ({
      labels: data.area_residencia.map((item) => item.area_tipo),
      datasets: [
        {
          label: "Inscrições",
          data: data.area_residencia.map((item) => item.total),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    }),
  },
  {
    ref: escolaridadeChart,
    title: "Nível de Escolaridade",
    type: "pie",
    getData: (data) => ({
      labels: data.nivel_escolaridade.map((item) => item.escolaridade_tipo),
      datasets: [
        {
          data: data.nivel_escolaridade.map((item) => item.total),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    }),
  },
];

const createCharts = (data) => {
  if (!data) return;

  requestAnimationFrame(() => {
    chartDefinitions.forEach((chartDef) => {
      if (chartDef.ref.value) {
        try {
          const newChart = new Chart(chartDef.ref.value, {
            type: chartDef.type,
            data: chartDef.getData(data),
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: chartDef.title,
                },
              },
              animation: {
                duration: 250,
              },
            },
          });
          charts.value.push(newChart);
        } catch (e) {
          console.warn(`Erro ao criar gráfico ${chartDef.title}:`, e);
        }
      }
    });
  });
};

function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const handlePoloChange = async () => {
  try {
    loading.value = true;

    destroyCharts();

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const [estatisticas, dados] = await Promise.all([
      estatisticasPolo(config, selectedPolo.value ?? null),
      fetchData(selectedPolo.value),
    ]);

    totalInscricoes.value = estatisticas.total_inscricoes;
    mediaIdade.value = estatisticas.media_idade;
    rendaMedia.value = estatisticas.media_renda;

    await nextTick();

    await new Promise((resolve) => requestAnimationFrame(resolve));

    createCharts(chartData.value);
  } catch (error) {
    console.error("Erro ao atualizar gráficos:", error);
    toast.error("Erro ao atualizar os dados");
  } finally {
    loading.value = false;
  }
};

const debouncedPoloChange = debounce(handlePoloChange, 500);

onMounted(async () => {
  try {
    polos.value = await getPolos(config);
    await fetchData();
    await nextTick();
    createCharts(chartData.value);

    const estatisticas = await estatisticasPolo(
      config,
      selectedPolo.value ?? null
    );
    totalInscricoes.value = estatisticas.total_inscricoes;
    mediaIdade.value = estatisticas.media_idade;
    rendaMedia.value = estatisticas.media_renda;
  } catch (error) {
    console.error("Erro ao inicializar dashboard:", error);
    toast.error("Erro ao carregar dados iniciais");
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  destroyCharts();
  if (debouncedPoloChange.cancel) {
    debouncedPoloChange.cancel();
  }
});
</script>
