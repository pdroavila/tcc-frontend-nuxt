// composables/useFormValidation.js
import { ref } from 'vue'

export function useFormValidation() {
  const errors = ref({})

  const validateTelefone = (telefone) => {
    const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/
    return phoneRegex.test(telefone)
  }

  const validateCPF = (cpf) => {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, "")

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false

    // Elimina CPFs inválidos conhecidos
    if (/^(\d)\1{10}$/.test(cpf)) return false

    // Validação do primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let firstVerifier = (sum * 10) % 11
    if (firstVerifier === 10 || firstVerifier === 11) firstVerifier = 0
    if (firstVerifier !== parseInt(cpf.charAt(9))) return false

    // Validação do segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i)
    }
    let secondVerifier = (sum * 10) % 11
    if (secondVerifier === 10 || secondVerifier === 11) secondVerifier = 0
    if (secondVerifier !== parseInt(cpf.charAt(10))) return false

    return true
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

  const validateForm = (formData) => {
    errors.value = {}

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

    if (!validateRequired(formData.documento)) {
      errors.value.documento = 'O CPF é obrigatório'
    } else if (!validateCPF(formData.documento)) {
      errors.value.documento = 'Por favor, insira um CPF válido'
    }

    if (!validateRequired(formData.cep)) {
      errors.value.cep = 'O CEP é obrigatório'
    } else if (!validateCEP(formData.cep)) {
      errors.value.cep = 'Por favor, insira um CEP válido'
    }

    // Adicione mais validações conforme necessário

    return Object.keys(errors.value).length === 0
  }

  return {
    errors,
    validateTelefone,
    validateCPF,
    validateCEP,
    validateEmail,
    validateRequired,
    validateForm
  }
}