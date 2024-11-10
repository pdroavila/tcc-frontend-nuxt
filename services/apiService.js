//Esta função é responsável por buscar a lista de países da API https://restcountries.com/v3.1/all e retornar com os nomes traduzidos para o português, se disponíveis.
export const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const data = await response.json();

    return data
      .map((country) => ({
        value: country.cca2,
        label: country.translations.por?.common || country.name.common,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error("Erro ao buscar países:", error);
    throw error;
  }
};

//Esta função obtém a lista de estados brasileiros da API do IBGE, formatando-os para uso no sistema.
export const fetchEstados = async () => {
  try {
    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
    );
    const data = await response.json();
    return data.map((estado) => ({
      value: estado.sigla,
      label: estado.nome,
    }));
  } catch (error) {
    console.error("Erro ao carregar estados:", error);
    throw error;
  }
};

//Esta função busca uma lista de cidades de um estado específico na API do IBGE, usando a sigla do estado como parâmetro.
export const fetchCidades = async (estado) => {
  if (!estado) return [];
  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`
    );
    const data = await response.json();
    return data.map((cidade) => ({
      value: cidade.nome,
      label: cidade.nome,
    }));
  } catch (error) {
    console.error("Erro ao carregar cidades:", error);
    throw error;
  }
};

//Esta função busca informações de endereço com base no CEP informado, usando a API https://viacep.com.br/ws.
export const getCEP = async (cep) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (data.erro) {
      throw new Error("CEP não encontrado");
    }
    return data;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    throw error;
  }
};

//Esta função busca os polos associados a um curso específico, consultando o backend com o ID do curso fornecido.
export const fetchPolos = async (curso_id, config) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/cursos/${curso_id}/polos/`
    );
    const data = await response.json();

    if (data.erro) {
      throw new Error("Erro ao buscar polos");
    }

    data.map((polo) => {
      polo.label = polo.nome;
    });

    return data;
  } catch (error) {
    console.error("Erro aos buscar os polos:", error);
    throw error;
  }
};

//Esta função envia dados de inscrição de um candidato para o backend, criando uma nova inscrição no sistema.
export const sendInscricao = async (inscricao, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/inscricao/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inscricao),
    });

    if (response.status !== 201) {
      const errorData = await response.json();

      console.log(errorData);
      throw new Error(
        errorData.error || "Erro desconhecido ao enviar inscrição"
      );
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;
  } catch (error) {
    console.error("Erro ao enviar a inscricao: ", error);
    throw error;
  }
};

//Esta função recupera informações de um candidato e suas inscrições usando um hash único associado ao candidato.
export const fetchInscricoes = async (hash, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/candidatos/${hash}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;
  } catch (error) {
    console.error("Erro ao enviar a inscricao: ", error);
    throw error;
  }
};

//Esta função obtém detalhes específicos de uma inscrição com base no ID e hash, incluindo informações do curso e do candidato.
export const fetchInscricao = async (inscricaoId, hash, config) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/inscricoes/${inscricaoId}/${hash}`
    );

    if (!response.ok) {
      throw new Error(
        "Erro ao buscar a inscrição. Verifique o ID e tente novamente."
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar a inscrição:", error);
    throw new Error("Não foi possível carregar os dados da inscrição.");
  }
};

//Esta função rejeita uma inscrição de candidato, enviando o ID da inscrição e um motivo para o backend.
export const rejectInscription = async (id, userId, motivo, config) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/inscricoes/${id}/rejeitar/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ user_id: userId, motivo }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao rejeitar a inscrição.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao rejeitar a inscrição:", error);
    throw new Error("Não foi possível rejeitar da inscrição.");
  }
};

//Esta função aprova uma inscrição, atualizando o status no sistema com base no ID da inscrição.
export const approveInscription = async (id, userId, config) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/inscricoes/${id}/aprovar/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ user_id: userId }),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao aprovar a inscrição.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao aprovar a inscrição:", error);
    throw new Error("Não foi possível aprovar os dados da inscrição.");
  }
};

//Esta função atualiza os dados de uma inscrição e do candidato associado, incluindo endereço e histórico educacional.
export const updateInscricao = async (inscricao, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/inscricao/alterar/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inscricao),
    });

    if (response.status !== 200) {
      const errorData = await response.json();

      console.log(errorData);
      throw new Error(
        errorData.error || "Erro desconhecido ao atualizar inscrição"
      );
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;
  } catch (error) {
    console.error("Erro ao atualizar a inscricao: ", error);
    throw error;
  }
};

//Esta função realiza o login de um administrador, retornando tokens de autenticação se as credenciais forem válidas.
export const loginAdmin = async (loginData, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.error || "Erro desconhecido ao realizar login");
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    localStorage.setItem("user_id", data.user_id);
    return data;
  } catch (error) {
    console.error("Erro ao realizar login: ", error);
    throw error;
  }
};

//Esta função solicita a recuperação de senha de um administrador, enviando um e-mail de recuperação.
export const recoverSenha = async (email, config) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/recuperar-senha/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(
        errorData.error || "Erro desconhecido ao solicitar recuperação de senha"
      );
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao solicitar recuperação de senha: ", error);
  }
};

//Esta função permite que o administrador altere sua senha usando um token de recuperação.
export const updateSenha = async (payload, config) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/alterar-senha/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(
        errorData.message ||
          "Erro desconhecido ao solicitar a alteração de senha"
      );
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao solicitar a alteração de senha");
  }
};

//Esta função busca uma lista de cursos, podendo aplicar filtros opcionais de nome e data.
export const getCursos = async (filters, config) => {
  try {
    let queryParams = null;

    if (filters)
      queryParams = new URLSearchParams({
        ...(filters.nome && { nome: filters.nome }),
        ...(filters.dataInicial && { data_inicial: filters.dataInicial }),
        ...(filters.dataFinal && { data_final: filters.dataFinal }),
        ...(filters.polo && { polo: filters.polo }),
      }).toString();

    const response = await fetch(
      `${config.public.apiUrl}/cursos/${queryParams ? `?${queryParams}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(
        errorData.message || "Erro desconhecido ao solicitar os cursos"
      );
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao solicitar os cursos");
  }
};

//Esta função cria um novo curso no sistema, associando polos ao curso durante o processo.
export const postCursos = async (formData, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/curso-novo/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        nome: formData.value.nome,
        descricao: formData.value.descricao,
        prazo_inscricoes: formData.value.prazo_inscricoes,
        polos: formData.value.polos,
        carga_horaria: formData.value.carga_horaria,
        requisitos: formData.value.requisitos,
      }),
    });

    if (response.status !== 201) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(
        errorData.message || "Erro desconhecido ao criar o curso"
      );
    }

    let data = await response.json();
    console.log("Resposta da API:", data);

    data.message = "Curso criado com sucesso";

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao solicitar a criação do curso");
  }
};

//Esta função recupera todos os polos cadastrados no sistema para exibição.
export const getPolos = async (config, filters = null) => {
  try {
    let queryParams = null;

    if (filters)
      queryParams = new URLSearchParams({
        ...(filters.nome && { nome: filters.nome }),
        ...(filters.cidade && { cidade: filters.cidade }),
      }).toString();

    const response = await fetch(
      `${config.public.apiUrl}/polos/${queryParams ? `?${queryParams}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(
        errorData.message || "Erro desconhecido ao solicitar os polos"
      );
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao solicitar os polos");
  }
};

//Esta função busca detalhes de um curso específico com base no seu ID.
export const fetchCurso = async (config, cursoId) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/cursos/${cursoId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(
        errorData.message || "Erro desconhecido ao solicitar o curso"
      );
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao solicitar o curso");
  }
};

//Esta função atualiza os dados de um curso específico, incluindo polos associados.
export const updateCurso = async (cursoId, formData, config) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/cursos/${cursoId}/update/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          nome: formData.value.nome,
          descricao: formData.value.descricao,
          prazo_inscricoes: formData.value.prazo_inscricoes,
          polos: formData.value.polos,
          carga_horaria: formData.value.carga_horaria,
          requisitos: formData.value.requisitos,
        }),
      }
    );

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(
        errorData.message || "Erro desconhecido ao atualizar o curso"
      );
    }

    let data = await response.json();
    console.log("Resposta da API:", data);

    data.message = "Curso atualizado com sucesso";

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao solicitar a atualização do curso");
  }
};

//Esta função lista os usuários administradores do sistema, permitindo filtros como nome e e-mail.
export const getAdminUsers = async (filters, config) => {
  try {
    const queryParams = new URLSearchParams({
      ...(filters.nome && { nome: filters.nome }),
      ...(filters.email && { email: filters.email }),
    }).toString();

    const response = await fetch(
      `${config.public.apiUrl}/admin/usuarios${
        queryParams ? `?${queryParams}` : ""
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao buscar usuários");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar usuários administradores");
  }
};

// Esta função busca os dados de um administrador específico com base no seu ID.
export const getAdminUser = async (userId, config) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/usuarios/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao buscar usuário");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar dados do usuário");
  }
};

// Esta função cria um novo usuário administrador, associando permissões de telas.
export const createAdminUser = async (userData, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/usuarios/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        nome_completo: userData.nome_completo,
        telas: userData.telas,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao criar usuário");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao criar usuário administrador");
  }
};

// Esta função atualiza os dados de um usuário administrador, incluindo as permissões de acesso às telas.
export const updateAdminUser = async (userId, userData, config) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/usuarios/${userId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          ...(userData.email && { email: userData.email }),
          ...(userData.nome_completo && {
            nome_completo: userData.nome_completo,
          }),
          ...(userData.password && { password: userData.password }),
          ...(typeof userData.ativo !== "undefined" && {
            ativo: userData.ativo,
          }),
          ...(userData.telas && { telas: userData.telas }),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao atualizar usuário");
    }

    const data = await response.json();
    data.message = "Usuário atualizado com sucesso";
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao atualizar usuário administrador");
  }
};

// Esta função busca a lista de telas disponíveis no sistema, usada para configurar permissões de administradores.
export const getTelas = async (config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/telas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao buscar telas");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar telas do sistema");
  }
};

// Esta função recupera dados detalhados de um usuário administrador com base no ID fornecido.
export const getDados = async (config, id) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/usuarios/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao buscar telas");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar dados.");
  }
};

// Esta função lista inscrições de candidatos, aplicando filtros como candidato, curso, polo e data.
export const getInscricoes = async (filters, config, url) => {
  try {
    const urlBusca = url ? url : `${config.public.apiUrl}/admin/inscricoes`;

    const queryString = new URLSearchParams(filters).toString();
    const urlComFiltros = `${urlBusca}?${queryString}`;

    const response = await fetch(urlComFiltros, {
      method: "GET",
      params: filters,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao buscar inscricoes");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar inscricoes do sistema");
  }
};

// Esta função recupera o histórico de logs de uma inscrição específica, incluindo status e observações.
export const fetchHistoricoInscricao = async (id, config) => {
  const response = await fetch(
    `${config.public.apiUrl}/admin/inscricoes/${id}/historico/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar histórico da inscrição");
  }

  return await response.json();
};

// Esta função busca dados estatísticos do sistema, como inscrições por polo, distribuição de gênero e outros.
export const getGraficos = async (config, idPolo) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/graficos${
        idPolo ? `?id_polo=${idPolo}` : ``
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro HTTP!");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar os dados do grafico do sistema");
  }
};

// Esta função busca cidades no backend com base no nome da cidade fornecido, usada para autocompletar campos de cidades.
export const getCidades = async (config, cityName = null) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/buscar-cidades${
        cityName ? `?nome=${cityName}` : ""
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar cidades do sistema");
  }
};

export const postPolos = async (formData, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/polos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        nome: formData.value.nome,
        logradouro: formData.value.logradouro,
        numero: formData.value.numero,
        bairro: formData.value.bairro,
        cidade: formData.value.cidade,
      }),
    });

    if (response.status !== 201) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.message || "Erro desconhecido ao criar o polo");
    }

    let data = await response.json();
    console.log("Resposta da API:", data);

    data.message = "Polo criado com sucesso";

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao solicitar a criação do polo");
  }
};

export const updatePolo = async (poloId, userData, config) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/polos/${poloId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          ...(userData.value.nome && { nome: userData.value.nome }),
          ...(userData.value.logradouro && {
            logradouro: userData.value.logradouro,
          }),
          ...(userData.value.numero && { numero: userData.value.numero }),
          ...(userData.value.bairro && { bairro: userData.value.bairro }),
          ...(userData.value.cidade && { cidade: userData.value.cidade }),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao atualizar o polo");
    }

    const data = await response.json();
    data.message = "Polo atualizado com sucesso";
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao atualizar polo administrador");
  }
};

export const getPolo = async (poloId, config) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/polos/${poloId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(
        errorData.message || "Erro desconhecido ao buscar o polo"
      );
    }

    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao solicitar a busca do polo");
  }
};

export const deletePolo = async (poloId, config) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/polos/${poloId}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (response.status !== 204) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(
        errorData.message || "Erro desconhecido ao deletar o polo"
      );
    }

    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao solicitar a deletar do polo");
  }
};

export const estatisticasPolo = async (config, poloId = null) => {
  try {
    const response = await fetch(
      `${config.public.apiUrl}/admin/estatisticas${
        poloId ? `?polo_id=${poloId}` : ""
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(
        errorData.message || "Erro desconhecido ao buscar as estastisticas"
      );
    }

    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao solicitar as estastisticas");
  }
};

export const validateRG = async (config, base64) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/validar_rg/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64,
      }),
    });

    let data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao solicitar a validação");
  }
};

export const validateCPF = async (config, base64) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/validar_cpf/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64,
      }),
    });

    let data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao solicitar a validação");
  }
};
