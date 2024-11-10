<template>
  <div
    class="flex items-center justify-center bg-gray-100"
    style="min-height: calc(100vh - 4rem)"
  >
    <!-- Altura calculada -->
    <div class="w-full max-w-4xl p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <div
        v-if="isSubmitting"
        class="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50"
      >
        <Loader />
      </div>
      <ProgressBar
        :sections="sections"
        :currentSection="currentSection"
        v-if="!formSubmitted"
      />

      <PersonalInfo
        v-if="currentSection === 0"
        :formData="formData"
        :currentStep="currentStep"
        @next="nextStep"
        @previous="previousStep"
      />
      <ProfileInfo
        v-if="currentSection === 1"
        :formData="formData"
        @next="nextStep"
        @previous="previousStep"
      />
      <AddressInfo
        v-if="currentSection === 2"
        :formData="formData"
        @next="nextStep"
        @previous="previousStep"
      />
      <EducationInfo
        v-if="currentSection === 3 && !formSubmitted"
        :formData="formData"
        @next="submitForm"
        @previous="previousStep"
      />

      <ConfirmationScreen v-if="formSubmitted" />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps, watch } from "vue";
import ProgressBar from "~/components/ProgressBar.vue";
import PersonalInfo from "~/components/PersonalInfo.vue";
import ProfileInfo from "~/components/ProfileInfo.vue";
import AddressInfo from "~/components/AddressInfo.vue";
import EducationInfo from "~/components/EducationInfo.vue";
import ConfirmationScreen from "~/components/ConfirmationScreen.vue";
import { sections, initialFormData } from "~/constants/formData";
import { sendInscricao, updateInscricao } from "~/services/apiService";
import { useToast } from "vue-toastification";
import Loader from "~/components/Loader.vue";
import { useRouter } from "vue-router";

const props = defineProps({
  courseId: String,
  initialData: Object,
  hash: [String, null],
});

const router = useRouter();
const toast = useToast();
const currentSection = ref(0);
const currentStep = ref(0);
const formSubmitted = ref(false);
const isSubmitting = ref(false);
const formData = ref({ ...initialFormData });
const inscricao_id = ref(0);
const config = useRuntimeConfig();

const mapInitialDataToFormData = (initialData) => {
  if (!initialData || !initialData.candidato) return initialFormData;

  const candidato = initialData.candidato;

  let naturalidade_nome = "";
  let naturalidade_id = null;
  if (candidato.naturalidade) {
    naturalidade_nome = candidato.naturalidade;
  }

  inscricao_id.value = initialData.id;

  return {
    ...initialFormData,
    email: candidato.email,
    nome_completo: candidato.nome_completo,
    nome_social: candidato.nome_social,
    nome_mae: candidato.nome_mae,
    cpf: candidato.cpf,
    anexo_cpf: candidato.anexo_cpf,
    registro_geral: candidato.registro_geral,
    anexo_rg: candidato.anexo_rg,
    data_nascimento: candidato.data_nascimento,
    telefone_celular: candidato.telefone_celular,
    genero: candidato.genero,
    estado_civil: candidato.estado_civil,
    cpf_cedula_estrangeira: candidato.cpf_cedula_estrangeira ? 1 : 0,
    rg_cedula_estrangeira: candidato.rg_cedula_estrangeira ? 1 : 0,
    portador_necessidades_especiais: candidato.portador_necessidades_especiais,
    necessidade_especial: candidato.necessidade_especial,
    renda_per_capita: candidato.renda_per_capita,
    etnia: candidato.etnia,
    nacionalidade: candidato.nacionalidade ? candidato.nacionalidade : "",
    naturalidade: naturalidade_id,
    naturalidade_nome: naturalidade_nome,
    polo_ofertante: candidato.polo_ofertante,
    polo_options: initialData.polo_options ? initialData.polo_options : null,
    area: candidato.endereco.area,
    logradouro: candidato.endereco.logradouro,
    cep: candidato.endereco.cep,
    bairro: candidato.endereco.bairro,
    cidade: candidato.endereco.cidade,
    numero: candidato.endereco.numero,
    estado: candidato.endereco.estado,
    complemento: candidato.endereco.complemento,
    tipo_escola: candidato.historico_educacional.tipo_escola,
    nivel_escolaridade: candidato.historico_educacional.nivel_escolaridade,
    anexo_historico_escolar:
      candidato.historico_educacional.anexo_historico_escolar,
    alteracao: true,
  };
};

watch(
  () => props.initialData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = mapInitialDataToFormData(newData);
    }
  },
  { immediate: true }
);

const resetFormData = () => {
  formData.value = { ...initialFormData };
};

onMounted(() => {
  if (!props.initialData || Object.keys(props.initialData).length === 0) {
    resetFormData();
  }
});

const nextStep = () => {
  if (currentSection.value < sections.length - 1) {
    if (currentStep.value < sections[currentSection.value].steps - 1) {
      currentStep.value++;
    } else {
      currentSection.value++;
      currentStep.value = 0;
    }
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  } else if (currentSection.value > 0) {
    currentSection.value--;
    currentStep.value = sections[currentSection.value].steps - 1;
  }
};

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    let form = formData.value;
    let inscricao = {
      candidato: {
        // outros todos os campos do formulário
        ...form,
      },
      curso: props.courseId,
      inscricao_id: inscricao_id.value,
    };

    if (form.alteracao) {
      await updateInscricao(inscricao, config);
      toast.success("Inscrição atualizada com sucesso.");
      return router.push({ path: `/acesso/${props.hash}` });
    }

    await sendInscricao(inscricao, config);
    formSubmitted.value = true;
    toast.success("Inscrição realizada com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar a inscrição:", error);
    toast.error(error.message);
  } finally {
    isSubmitting.value = false; // Termina o loading
  }
};
</script>
