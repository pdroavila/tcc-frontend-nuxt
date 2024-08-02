export const maskTelefone = (value) => {
    // Verifica se o valor é undefined ou null
    if (value == null) {
      return '';
    }
  
    // Converte o valor para string, caso não seja
    let strValue = String(value);
  
    // Remove todos os caracteres não numéricos
    let cleaned = strValue.replace(/\D/g, "");
  
    // Limita o tamanho para 11 dígitos
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
  
    // Aplica a máscara
    if (cleaned.length > 2) {
      cleaned = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }
    if (cleaned.length > 10) {
      cleaned = `${cleaned.slice(0, 10)}-${cleaned.slice(10)}`;
    }
  
    return cleaned;
  };
  
  export const maskCPF = (value) => {
    // Verifica se o valor é undefined ou null
    if (value == null) {
      return '';
    }
  
    // Converte o valor para string, caso não seja
    let strValue = String(value);
  
    // Remove todos os caracteres não numéricos
    let cleaned = strValue.replace(/\D/g, "");
  
    // Limita o tamanho para 11 dígitos
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
  
    // Aplica a máscara
    if (cleaned.length > 9) {
      cleaned = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
    } else if (cleaned.length > 6) {
      cleaned = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    } else if (cleaned.length > 3) {
      cleaned = `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    }
  
    return cleaned;
  };
  
  export const maskCEP = (value) => {
    // Verifica se o valor é undefined ou null
    if (value == null) {
      return '';
    }
  
    // Converte o valor para string, caso não seja
    let strValue = String(value);
  
    // Remove todos os caracteres não numéricos
    let cleaned = strValue.replace(/\D/g, "");
  
    // Limita o tamanho para 8 dígitos
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
  
    // Aplica a máscara
    if (cleaned.length > 5) {
      cleaned = `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
  
    return cleaned;
  };