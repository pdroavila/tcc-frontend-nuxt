export function formData() {
    const formData = reactive({
        email: "",
        nacionalidade: "",
        nome: "",
        naturalidade: "",
        nomeSocial: "",
        telefone: "",
        nomeMae: "",
        poloOfertante: "",
        dataNascimento: "",
        documento: "",
        isCedulaEstrangeira: false,
        registroGeral: "",
        isRGCedulaEstrangeira: false,
        genero: "",
        necessidadesEspeciais: "",
        estadoCivil: "",
        quaisNecessidades: "",
        rendaPerCapita: "",
        etnia: "",
        areaUrbanaRural: "",
        logradouro: "",
        cep: "",
        bairro: "",
        cidade: "",
        numero: "",
        estado: "",
        complemento: "",
        tipoEscola: "",
        nivelEscolaridade: "",
      });

      const sections = [
        { title: "Dados Pessoais", steps: 2 },
        { title: "Informações do Perfil", steps: 1 },
        { title: "Endereço", steps: 1 },
        { title: "Histórico Educacional", steps: 1 },
      ];

      return {formData, sections}
}