<template>
  <!-- Ajustando o fundo e centralização -->
  <div class="flex items-center justify-center bg-gray-100" style="min-height: calc(100vh - 4rem);"> <!-- Altura calculada -->
    <div class="w-full max-w-4xl p-4 sm:p-6 bg-white rounded-lg shadow-lg">
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
import { ref, onBeforeMount, toRaw } from "vue";
import ProgressBar from "~/components/ProgressBar.vue";
import PersonalInfo from "~/components/PersonalInfo.vue";
import ProfileInfo from "~/components/ProfileInfo.vue";
import AddressInfo from "~/components/AddressInfo.vue";
import EducationInfo from "~/components/EducationInfo.vue";
import ConfirmationScreen from "~/components/ConfirmationScreen.vue";
import { sections, initialFormData } from "~/constants/formData";
import { sendInscricao } from "~/services/apiService";
import { useToast } from "vue-toastification";

const toast = useToast();
const route = useRoute();
const currentSection = ref(0);
const currentStep = ref(0);
const formSubmitted = ref(false);
const formData = ref({ ...initialFormData }); // Define formData inicial
const config = useRuntimeConfig()

const resetFormData = () => {
  formData.value = { ...initialFormData }; // Reset formData para seu estado inicial
};

onBeforeMount(() => {
  resetFormData(); // Limpa o formulário toda vez que a view é montada
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
  try {
    let form = toRaw(formData.value); // Acessa formData sem a reatividade
    let inscricao = {
      "candidato": {
        "email": form.email,
        "nome_completo": form.nome_completo,
        "nome_social": form.nome_social,
        "nome_mae": form.nome_mae,
        "cpf": form.cpf,
        "anexo_cpf": form.anexo_cpf,
        "registro_geral": form.registro_geral,
        "anexo_rg": form.anexo_rg,
        "nacionalidade": form.nacionalidade,
        "naturalidade": form.naturalidade,
        "data_nascimento": form.data_nascimento,
        "telefone_celular": form.telefone_celular,
        "polo_ofertante": form.polo_ofertante,
        "genero": form.genero,
        "estado_civil": form.estado_civil,
        "portador_necessidades_especiais": form.portador_necessidades_especiais,
        "necessidade_especial": form.necessidade_especial,
        "renda_per_capita": form.renda_per_capita,
        "etnia": form.etnia,
        "cpf_cedula_estrangeira": form.cpf_cedula_estrangeira ? 1 : 0,
        "rg_cedula_estrangeira": form.rg_cedula_estrangeira ? 1 : 0
      },
      "curso": route.params.id
    };
    
    const respostaInscricao = await sendInscricao(inscricao, config);

    formSubmitted.value = true;
  } catch (error) {
    console.error('Erro ao enviar a inscrição:', error);
    toast.error(error.message);
  }
};
</script>
