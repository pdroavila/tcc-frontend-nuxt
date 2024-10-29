<template>
    <div v-if="loading" class="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50">
      <Loader />
    </div>
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6">Relatório de Inscrições</h1>
        
        <div class="flex flex-wrap justify-center md:grid-cols-4 gap-4 mb-6">
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Nome</label>
            <input 
              v-model="filters.nome" 
              type="text" 
              class="border rounded-md p-2"
              placeholder="Filtrar por nome"
            >
          </div>
          
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Curso</label>
            <select 
              v-model="filters.curso" 
              class="border rounded-md p-2"
            >
              <option value="">Selecione um curso</option>
              <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
                {{ curso.nome }}
              </option>
            </select>
          </div>
  
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Polo</label>
            <select 
              v-model="filters.polo" 
              class="border rounded-md p-2"
            >
              <option value="">Selecione um polo</option>
              <option v-for="polo in polos" :key="polo.id" :value="polo.id">
                {{ polo.nome }}
              </option>
            </select>
          </div>
  
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Situação</label>
            <select 
              v-model="filters.status" 
              class="border rounded-md p-2"
            >
              <option value="">Todas</option>
              <option value="0">Aguardando análise</option>
              <option value="1">Aprovada</option>
              <option value="2">Rejeitada</option>
            </select>
          </div>
  
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Data Inicial</label>
            <input 
              v-model="filters.data_inicial" 
              type="date" 
              class="border rounded-md p-2"
            >
          </div>
  
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Data Final</label>
            <input 
              v-model="filters.data_final" 
              type="date" 
              class="border rounded-md p-2"
            >
          </div>
        </div>
  
        <div class="flex justify-end mb-4 gap-2">
          <button 
            @click="buscarInscricoes()" 
            class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Buscar
          </button>
          <button 
            @click="exportarCSV" 
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Exportar CSV
          </button>
        </div>
  
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome Completo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Curso</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Polo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Situação</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="inscricao in inscricoes.results" :key="inscricao.id">
                <td class="px-6 py-4">{{ inscricao.candidato.nome_completo }}</td>
                <td class="px-6 py-4">{{ inscricao.candidato.email }}</td>
                <td class="px-6 py-4">{{ inscricao.curso.nome }}</td>
                <td class="px-6 py-4">{{ inscricao.polo.nome }}</td>
                <td class="px-6 py-4">{{ inscricao.status == 1 ? 'Aprovada' : inscricao.status == 2 ? 'Rejeitada' : 'Aguardando Análise' }}</td>
                <td class="px-6 py-4">{{ formatDate(inscricao.data_criacao) }}</td>
                <td class="px-6 py-4 text-center">
                  <button 
                    @click="verDetalhes(inscricao.id, inscricao.hash)"
                    class="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                  >
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Paginação -->
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Mostrando {{ inscricoes.results?.length || 0 }} de {{ inscricoes.count || 0 }} resultados
          </div>
          <div class="flex gap-2">
            <button 
              @click="mudarPagina(inscricoes.previous)"
              :disabled="!inscricoes.previous"
              class="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Anterior
            </button>
            <button 
              @click="mudarPagina(inscricoes.next)"
              :disabled="!inscricoes.next"
              class="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { getCursos, getPolos, getInscricoes } from "~/services/apiService";
  
  const config = useRuntimeConfig()
  const router = useRouter()
  const loading = ref(true)
  const inscricoes = ref({
    count: 0,
    next: null,
    previous: null,
    results: []
  })
  const cursos = ref([])
  const polos = ref([])
  
  const filters = reactive({
    nome: '',
    curso: '',
    polo: '',
    status: '',
    data_inicial: '',
    data_final: '',
    page: 1
  })
  
  const buscarInscricoes = async (url = false) => {
    try {
      loading.value = true
      const response = await getInscricoes(filters, config, url);
      inscricoes.value = response;
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error)
    } finally {
      loading.value = false
    }
  }
  
  const buscarCursos = async () => {
    try {
        loading.value = true;
        const data = await getCursos(filters, config);
        cursos.value = data
    } catch (error) {
        console.error('Erro ao buscar cursos:', error)
    }finally{
        loading.value = false;
    }
  }
  

  const buscarPolos = async () => {
    try {
        const data = await getPolos(config);
        polos.value = data
    } catch (error) {
        console.error('Erro ao buscar polos:', error)
    }
    }
  
  const verDetalhes = (id, hash) => {
    router.push(`/admin/inscricoes/${id}/${hash}`)
  }
  
  const mudarPagina = (url) => {
    if (!url) return
    const page = new URL(url).searchParams.get('page')
    filters.page = page
    buscarInscricoes(url)
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }
  
//   const exportarCSV = async () => {
//     try {
//       const response = await fetch('/api/inscricoes/export/', {
//         method: 'GET',
//         params: filters
//       })
//       const blob = await response.blob()
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = 'inscricoes.csv'
//       a.click()
//     } catch (error) {
//       console.error('Erro ao exportar CSV:', error)
//     }
//   }
  
  onMounted(async () => {
    await Promise.all([
      buscarInscricoes(),
      buscarCursos(),
      buscarPolos()
    ])
  })
  </script>