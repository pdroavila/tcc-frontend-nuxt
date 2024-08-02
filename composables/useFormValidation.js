import { ref } from 'vue'

export function useFormValidation() {
  const errors = ref({})

  const validateTelefone = (telefone) => {
    const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/
    return phoneRegex.test(telefone)
  }

  const validateCPF = (cpf) => {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    return cpfRegex.test(cpf)
  }

  const validateCEP = (cep) => {
    const cepRegex = /^\d{5}-\d{3}$/
    return cepRegex.test(cep)
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateRequired = (value) => {
    return value !== null && value !== undefined && value !== ''
  }

  const validateForm = (formData, currentSection, currentStep) => {
    errors.value = {}

    if (currentSection === 0) {
      if (currentStep === 0) {
        if (!validateRequired(formData.email)) {
          errors.value.email = 'O email é obrigatório'
        } else if (!validateEmail(formData.email)) {
          errors.value.email = 'Por favor, insira um email válido'
        }

        if (!validateRequired(formData.telefone)) {
          errors.value.telefone = 'O telefone é obrigatório'
        } else if (!validateTelefone(formData.telefone)) {
          errors.value.telefone = 'Por favor, insira um número de telefone válido'
        }

        // Adicione mais validações para os outros campos da primeira etapa
      } else if (currentStep === 1) {
        if (!validateRequired(formData.documento)) {
          errors.value.documento = 'O CPF é obrigatório'
        } else if (!validateCPF(formData.documento)) {
          errors.value.documento = 'Por favor, insira um CPF válido'
        }

        // Adicione mais validações para os outros campos da segunda etapa
      }
    } else if (currentSection === 1) {
      // Validações para a seção de Informações do Perfil
      if (!validateRequired(formData.genero)) {
        errors.value.genero = 'O gênero é obrigatório'
      }

      // Adicione mais validações para os outros campos desta seção
    } else if (currentSection === 2) {
      // Validações para a seção de Endereço
      if (!validateRequired(formData.cep)) {
        errors.value.cep = 'O CEP é obrigatório'
      } else if (!validateCEP(formData.cep)) {
        errors.value.cep = 'Por favor, insira um CEP válido'
      }

      // Adicione mais validações para os outros campos de endereço
    } else if (currentSection === 3) {
      // Validações para a seção de Histórico Educacional
      if (!validateRequired(formData.tipoEscola)) {
        errors.value.tipoEscola = 'Este campo é obrigatório'
      }

      // Adicione mais validações para os outros campos desta seção
    }

    // Se houver erros, exiba-os no console
    if (Object.keys(errors.value).length > 0) {
      console.log('Erros de validação:', errors.value);
    }

    return Object.keys(errors.value).length === 0
  }

  return {
    errors,
    validateForm
  }
}