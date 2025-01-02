<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div
        v-if="loading"
        class="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50"
      >
        <Loader />
      </div>

      <h1 class="text-2xl font-bold mb-6">Detalhes da Inscrição</h1>

      <div v-if="inscricao" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Informações Pessoais -->
        <div class="md:col-span-1">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-lg font-medium mb-4 border-b pb-2">
              Informações Pessoais
            </h2>
            <div class="space-y-3">
              <!-- Nome Completo -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >Nome Completo</span
                >
                <span class="text-gray-900">{{
                  inscricao.candidato?.nome_completo || "-"
                }}</span>
              </div>
              <!-- Nome Social -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >Nome Social</span
                >
                <span class="text-gray-900">{{
                  inscricao.candidato?.nome_social || "-"
                }}</span>
              </div>
              <!-- Nome da Mãe -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >Nome da Mãe</span
                >
                <span class="text-gray-900">{{
                  inscricao.candidato?.nome_mae || "-"
                }}</span>
              </div>
              <!-- Email -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium">Email</span>
                <span class="text-gray-900">{{
                  inscricao.candidato?.email || "-"
                }}</span>
              </div>
              <!-- CPF -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium">CPF</span>
                <span class="text-gray-900">{{
                  inscricao.candidato?.cpf || "-"
                }}</span>
              </div>
              <!-- CPF é Cédula Estrangeira -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >CPF é Cédula Estrangeira</span
                >
                <span class="text-gray-900">{{
                  getSimNaoLabel(inscricao.candidato?.cpf_cedula_estrangeira) ||
                  "-"
                }}</span>
              </div>
              <!-- RG -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium">RG</span>
                <span class="text-gray-900">{{
                  inscricao.candidato?.registro_geral || "-"
                }}</span>
              </div>
              <!-- RG é Cédula Estrangeira -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >RG é Cédula Estrangeira</span
                >
                <span class="text-gray-900">{{
                  getSimNaoLabel(inscricao.candidato?.rg_cedula_estrangeira) ||
                  "-"
                }}</span>
              </div>
              <!-- Data de Nascimento -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >Data de Nascimento</span
                >
                <span class="text-gray-900">{{
                  formatDate(inscricao.candidato?.data_nascimento) || "-"
                }}</span>
              </div>
              <!-- Telefone -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium">Telefone</span>
                <span class="text-gray-900">{{
                  inscricao.candidato?.telefone_celular || "-"
                }}</span>
              </div>
              <!-- Nacionalidade -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >Nacionalidade</span
                >
                <span class="text-gray-900">{{
                  getCountryName(inscricao.candidato?.nacionalidade) || "-"
                }}</span>
              </div>
              <!-- Naturalidade -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >Naturalidade</span
                >
                <span class="text-gray-900">{{
                  inscricao.candidato?.naturalidade || "-"
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Informações Adicionais -->
        <div class="md:col-span-1">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-lg font-medium mb-4 border-b pb-2">
              Informações Adicionais
            </h2>
            <div class="space-y-3">
              <!-- Gênero -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium">Gênero</span>
                <span class="text-gray-900">{{
                  getGeneroLabel(inscricao.candidato?.genero) || "-"
                }}</span>
              </div>
              <!-- Estado Civil -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >Estado Civil</span
                >
                <span class="text-gray-900">{{
                  getEstadoCivilLabel(inscricao.candidato?.estado_civil) || "-"
                }}</span>
              </div>
              <!-- PNE -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium">PNE</span>
                <span class="text-gray-900">{{
                  getSimNaoLabel(
                    inscricao.candidato?.portador_necessidades_especiais
                  ) || "-"
                }}</span>
              </div>
              <!-- Necessidade Especial -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >Necessidade Especial</span
                >
                <span class="text-gray-900">{{
                  inscricao.candidato?.necessidade_especial || "-"
                }}</span>
              </div>
              <!-- Renda Per Capita -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >Renda Per Capita</span
                >
                <span class="text-gray-900">{{
                  getRendaLabel(inscricao.candidato?.renda_per_capita) || "-"
                }}</span>
              </div>
              <!-- Etnia -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium">Etnia</span>
                <span class="text-gray-900">{{
                  getEtniaLabel(inscricao.candidato?.etnia) || "-"
                }}</span>
              </div>
              <!-- Endereço -->
              <div class="mt-4">
                <h3 class="text-md font-medium mb-2">Endereço</h3>
                <div class="space-y-2">
                  <!-- Logradouro -->
                  <div class="flex flex-col">
                    <span class="text-gray-600 text-sm font-medium"
                      >Logradouro</span
                    >
                    <span class="text-gray-900">{{
                      inscricao.candidato?.endereco?.logradouro || "-"
                    }}</span>
                  </div>
                  <!-- Número -->
                  <div class="flex flex-col">
                    <span class="text-gray-600 text-sm font-medium"
                      >Número</span
                    >
                    <span class="text-gray-900">{{
                      inscricao.candidato?.endereco?.numero || "-"
                    }}</span>
                  </div>
                  <!-- Complemento -->
                  <div class="flex flex-col">
                    <span class="text-gray-600 text-sm font-medium"
                      >Complemento</span
                    >
                    <span class="text-gray-900">{{
                      inscricao.candidato?.endereco?.complemento || "-"
                    }}</span>
                  </div>
                  <!-- Bairro -->
                  <div class="flex flex-col">
                    <span class="text-gray-600 text-sm font-medium"
                      >Bairro</span
                    >
                    <span class="text-gray-900">{{
                      inscricao.candidato?.endereco?.bairro || "-"
                    }}</span>
                  </div>
                  <!-- Cidade -->
                  <div class="flex flex-col">
                    <span class="text-gray-600 text-sm font-medium"
                      >Cidade</span
                    >
                    <span class="text-gray-900">{{
                      inscricao.candidato?.endereco?.cidade || "-"
                    }}</span>
                  </div>
                  <!-- Estado -->
                  <div class="flex flex-col">
                    <span class="text-gray-600 text-sm font-medium"
                      >Estado</span
                    >
                    <span class="text-gray-900">{{
                      inscricao.candidato?.endereco?.estado || "-"
                    }}</span>
                  </div>
                  <!-- CEP -->
                  <div class="flex flex-col">
                    <span class="text-gray-600 text-sm font-medium">CEP</span>
                    <span class="text-gray-900">{{
                      inscricao.candidato?.endereco?.cep || "-"
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="md:col-span-1">
          <!-- Seção de Anexos -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h2 class="text-lg font-medium mb-4 border-b pb-2">
              Anexos
              <p class="text-xs">
                os campos com
                <span class="text-red-500 font-bold">*</span> requerem uma maior
                atenção na validação.
              </p>
            </h2>
            <div class="space-y-2">
              <div class="relative">
                <button
                  @click="openAttachment(inscricao.candidato?.anexo_cpf)"
                  @mouseover="
                    hoveredAnexo = getAnexoUrl(inscricao.candidato?.anexo_cpf)
                  "
                  @mouseleave="hoveredAnexo = ''"
                  class="w-full text-left p-2 hover:bg-gray-100 rounded"
                >
                  <i class="fas fa-file-pdf mr-2"></i> CPF
                  <span
                    v-if="!inscricao.candidato.validacao_anexo_cpf"
                    class="text-red-500 font-bold"
                    >*</span
                  >
                </button>
                <div
                  v-if="
                    hoveredAnexo === getAnexoUrl(inscricao.candidato?.anexo_cpf)
                  "
                  class="absolute left-full top-0 ml-2 p-2 bg-white border shadow-lg z-10"
                  style="width: 200px"
                >
                  <img :src="hoveredAnexo" class="max-w-full max-h-full" />
                </div>
              </div>

              <div class="relative">
                <button
                  @click="openAttachment(inscricao.candidato?.anexo_rg)"
                  @mouseover="
                    hoveredAnexo = getAnexoUrl(inscricao.candidato?.anexo_rg)
                  "
                  @mouseleave="hoveredAnexo = ''"
                  class="w-full text-left p-2 hover:bg-gray-100 rounded"
                >
                  <i class="fas fa-file-pdf mr-2"></i> RG
                  <span
                    v-if="!inscricao.candidato.validacao_anexo_rg"
                    class="text-red-500 font-bold"
                    >*</span
                  >
                </button>
                <div
                  v-if="
                    hoveredAnexo === getAnexoUrl(inscricao.candidato?.anexo_rg)
                  "
                  class="absolute left-full top-0 ml-2 p-2 bg-white border shadow-lg z-10"
                  style="width: 200px"
                >
                  <img :src="hoveredAnexo" class="max-w-full max-h-full" />
                </div>
              </div>

              <div class="relative">
                <button
                  @click="
                    openAttachment(
                      inscricao.candidato?.historico_educacional
                        .anexo_historico_escolar
                    )
                  "
                  @mouseover="
                    hoveredAnexo = getAnexoUrl(
                      inscricao.candidato?.historico_educacional
                        .anexo_historico_escolar
                    )
                  "
                  @mouseleave="hoveredAnexo = ''"
                  class="w-full text-left p-2 hover:bg-gray-100 rounded"
                >
                  <i class="fas fa-file-pdf mr-2"></i> Histórico Escolar
                </button>
                <div
                  v-if="
                    hoveredAnexo ===
                    getAnexoUrl(
                      inscricao.candidato?.historico_educacional
                        .anexo_historico_escolar
                    )
                  "
                  class="absolute left-full top-0 ml-2 p-2 bg-white border shadow-lg z-10"
                  style="width: 200px"
                >
                  <img :src="hoveredAnexo" class="max-w-full max-h-full" />
                </div>
              </div>
            </div>
          </div>

          <!-- Informações Educacionais -->
          <div class="bg-gray-50 p-4 rounded-lg mt-4">
            <h2 class="text-lg font-medium mb-4 border-b pb-2">
              Informações Educacionais
            </h2>
            <div class="space-y-3">
              <!-- Tipo de Escola -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >Tipo de Escola</span
                >
                <span class="text-gray-900">{{
                  getTipoEscolaLabel(
                    inscricao.candidato?.historico_educacional.tipo_escola
                  ) || "-"
                }}</span>
              </div>
              <!-- Nível de Escolaridade -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >Nível de Escolaridade</span
                >
                <span class="text-gray-900">{{
                  getEscolaridadeLabel(
                    inscricao.candidato?.historico_educacional
                      .nivel_escolaridade
                  ) || "-"
                }}</span>
              </div>
              <!-- Curso -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium">Curso</span>
                <span class="text-gray-900">{{
                  inscricao.curso?.nome || "-"
                }}</span>
              </div>
              <!-- Polo -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium">Polo</span>
                <span class="text-gray-900">{{
                  inscricao.polo_options?.find(
                    (p) => p.id === inscricao.candidato?.polo_ofertante
                  )?.label || "-"
                }}</span>
              </div>
              <!-- Situação -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium">Situação</span>
                <span class="text-gray-900">{{
                  getStatusLabel(inscricao.status) || "-"
                }}</span>
              </div>
              <!-- Data da Inscrição -->
              <div class="flex flex-col">
                <span class="text-gray-600 text-sm font-medium"
                  >Data da Inscrição</span
                >
                <span class="text-gray-900">{{
                  formatDate(inscricao.data_criacao) || "-"
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="mt-6 flex justify-end gap-2">
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          @click="openHistoricoModal"
        >
          Ver Histórico
        </button>
        <button
          class="px-4 py-2 bg-green-100 text-white rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400"
          :disabled="isApproveDisabled"
          @click="aprovarInscricao"
        >
          Aprovar
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
          :disabled="isRejectDisabled"
          @click="showRejectModal = true"
        >
          Recusar
        </button>
        <NuxtLink
          to="/admin/inscricoes"
          class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </NuxtLink>
      </div>
    </div>

    <!-- Modal de Recusa -->
    <Modal v-if="showRejectModal" @close="showRejectModal = false">
      <template #header>
        <h2 class="text-lg font-medium">Recusar Inscrição</h2>
      </template>
      <template #body>
        <div class="space-y-4">
          <div>
            <label for="reason" class="block text-gray-600 font-medium"
              >Motivo da Recusa:</label
            >
            <textarea
              id="reason"
              v-model="rejectReason"
              class="w-full border rounded-md p-2"
              rows="3"
            ></textarea>
          </div>
        </div>
      </template>
      <template #footer>
        <button
          class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          @click="showRejectModal = false"
        >
          Cancelar
        </button>
        <button
          class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          @click="rejeitarInscricao"
        >
          Recusar
        </button>
      </template>
    </Modal>

    <!-- Modal de Anexo -->
    <Modal v-if="showAttachmentModal" @close="showAttachmentModal = false">
      <template #header>
        <h2 class="text-lg font-medium">Anexo</h2>
      </template>
      <template #body>
        <div class="flex items-center justify-center h-[80vh]">
          <img
            :src="currentAttachmentUrl"
            alt="Anexo"
            class="max-h-full max-w-full object-contain"
          />
        </div>
      </template>
    </Modal>

    <!-- Modal de Histórico -->
    <Modal v-if="showHistoricoModal" @close="showHistoricoModal = false">
      <template #header>
        <h2 class="text-lg font-medium">Histórico da Inscrição</h2>
      </template>
      <template #body>
        <div class="space-y-4">
          <div v-if="historico.length === 0">
            <p>Não há registros de histórico para esta inscrição.</p>
          </div>
          <div v-else>
            <ul class="space-y-2">
              <li v-for="log in historico" :key="log.id" class="border-b pb-2">
                <p>
                  <strong>Data:</strong> {{ formatDateTime(log.data_registro) }}
                </p>
                <p><strong>Status:</strong> {{ log.status_display }}</p>
                <p>
                  <strong>Usuário:</strong> {{ log.usuario_nome || "Sistema" }}
                </p>
                <p>
                  <strong>Observações:</strong>
                  {{ log.observacoes || "Nenhuma" }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template #footer>
        <button
          class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          @click="showHistoricoModal = false"
        >
          Fechar
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  generoOptions,
  estadoCivilOptions,
  simNaoOptions,
  rendaOptions,
  etniaOptions,
  tipoEscolaOptions,
  escolaridadeOptions,
} from "~/constants/formOptions";
import {
  fetchCountries,
  rejectInscription,
  fetchInscricao,
  approveInscription,
  fetchHistoricoInscricao,
} from "~/services/apiService"; // Importa a função para buscar países
import Modal from "~/components/Modal.vue";
import Loader from "~/components/Loader.vue";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();
const route = useRoute();
const inscricao = ref(null);
const loading = ref(true);
const showRejectModal = ref(false);
const rejectReason = ref("");
const showAttachmentModal = ref(false);
const currentAttachmentUrl = ref("");
const countryList = ref([]);
const config = useRuntimeConfig();
const { id, hash } = route.params;
const userId = ref(null);
const showHistoricoModal = ref(false);
const historico = ref([]);
const { verifyScreenAccess } = useAuth();

const hoveredAnexo = ref("");

const getAnexoUrl = (attachment) => {
  if (!attachment) return "";
  return `${config.public.apiUrl}/media-image/${attachment}`;
};

// Computed properties to determine button states
const isApproveDisabled = computed(() => {
  if (loading.value || !inscricao.value) return true;
  return inscricao.value.status === "1";
});

const isRejectDisabled = computed(() => {
  if (loading.value || !inscricao.value) return true;
  return inscricao.value.status === "2";
});

const getStatusLabel = (status) => {
  switch (status) {
    case "0":
      return "Aguardando Análise";
    case "1":
      return "Aprovada";
    case "2":
      return "Rejeitada";
    case "3":
      return "Aprovada (Sem Análise)";
    default:
      return "Desconhecido";
  }
};

const getGeneroLabel = (value) => {
  const option = generoOptions.find((o) => o.value === value);
  return option ? option.label : "Desconhecido";
};

const getEstadoCivilLabel = (value) => {
  const option = estadoCivilOptions.find((o) => o.value === value);
  return option ? option.label : "Desconhecido";
};

const getSimNaoLabel = (value) => {
  const option = simNaoOptions.find((o) => o.value === value);
  return option ? option.label : "Desconhecido";
};

const getRendaLabel = (value) => {
  const option = rendaOptions.find((o) => o.value === value);
  return option ? option.label : "Desconhecido";
};

const getEtniaLabel = (value) => {
  const option = etniaOptions.find((o) => o.value === value);
  return option ? option.label : "Desconhecido";
};

const getTipoEscolaLabel = (value) => {
  const option = tipoEscolaOptions.find((o) => o.value === value);
  return option ? option.label : "Desconhecido";
};

const getEscolaridadeLabel = (value) => {
  const option = escolaridadeOptions.find((o) => o.value === value);
  return option ? option.label : "Desconhecido";
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
};

const openAttachment = (attachment) => {
  if (!attachment) return;
  currentAttachmentUrl.value = `${config.public.apiUrl}/media-image/${attachment}`;
  showAttachmentModal.value = true;
};

const rejeitarInscricao = async () => {
  try {
    if (!rejectReason.value.trim()) {
      toast.warning("Por favor, informe o motivo da recusa.");
      return;
    }

    loading.value = true;
    showRejectModal.value = false;
    const response = await rejectInscription(
      id,
      userId.value,
      rejectReason.value,
      config
    );
    toast.success("Inscrição rejeitada com sucesso.");
    router.push(`/admin/inscricoes/`);
  } catch (error) {
    console.error("Erro ao rejeitar inscrição:", error);
    toast.error("Erro ao rejeitar inscrição. Tente novamente.");
  } finally {
    loading.value = false;
  }
};

const aprovarInscricao = async () => {
  try {
    loading.value = true;
    const response = await approveInscription(id, userId.value, config);
    toast.success("Inscrição aprovada com sucesso.");
    router.push(`/admin/inscricoes/`);
  } catch (error) {
    console.error("Erro ao aprovar inscrição:", error);
    toast.error("Erro ao aprovar inscrição. Tente novamente.");
  } finally {
    loading.value = false;
  }
};

const getCountryName = (code) => {
  const country = countryList.value.find((c) => c.value === code);
  return country ? country.label : "Desconhecido";
};

const fetchCountryList = async () => {
  try {
    countryList.value = await fetchCountries();
  } catch (error) {
    console.error("Erro ao buscar lista de países:", error);
  }
};

const openHistoricoModal = async () => {
  try {
    loading.value = true;
    showHistoricoModal.value = true;

    // Faça a requisição para obter o histórico
    const response = await fetchHistoricoInscricao(id, config);
    historico.value = response;
  } catch (error) {
    console.error("Erro ao obter histórico:", error);
    toast.error("Erro ao obter histórico. Tente novamente.");
    showHistoricoModal.value = false;
  } finally {
    loading.value = false;
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "-";
  const date = new Date(dateTimeString);
  return date.toLocaleString("pt-BR");
};

onMounted(async () => {
  try {
    await verifyScreenAccess("/admin/inscricoes");
    await fetchCountryList();
    inscricao.value = await fetchInscricao(id, hash, config);
    userId.value = localStorage.getItem("user_id");
  } catch (error) {
    console.error("Erro desconhecido: " + error);
  } finally {
    loading.value = false;
  }
});
</script>
