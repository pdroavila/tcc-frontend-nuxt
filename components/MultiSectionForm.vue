<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg">
      <div class="max-w-4xl mx-auto p-4 sm:p-6 border-solid border-2 rounded">
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import ProgressBar from "~/components/ProgressBar.vue";
import PersonalInfo from "~/components/PersonalInfo.vue";
import ProfileInfo from "~/components/ProfileInfo.vue";
import AddressInfo from "~/components/AddressInfo.vue";
import EducationInfo from "~/components/EducationInfo.vue";
import ConfirmationScreen from "~/components/ConfirmationScreen.vue";
import { sections, formData } from "~/constants/formData";

const currentSection = ref(0);
const currentStep = ref(0);
const formSubmitted = ref(false);

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

const submitForm = () => {
  console.log("Formulário enviado:", formData);
  formSubmitted.value = true;
};
</script>
