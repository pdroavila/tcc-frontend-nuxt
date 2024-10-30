export const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const data = await response.json();

    return data
      .map(country => ({
        value: country.cca2,
        label: country.translations.por?.common || country.name.common
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    console.error('Erro ao buscar países:', error);
    throw error;
  }
};

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

export const fetchPolos = async (curso_id, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/cursos/${curso_id}/polos/`);
    const data = await response.json();

    if (data.erro) {
      throw new Error("Erro ao buscar polos");
    }

    data.map((polo) => {
      polo.label = polo.nome;
    })

    return data;
  } catch (error) {
    console.error("Erro aos buscar os polos:", error);
    throw error;
  }
}

export const sendInscricao = async (inscricao, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/inscricao/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inscricao),
    });

    if (response.status !== 201) {
      const errorData = await response.json();

      console.log(errorData)
      throw new Error(errorData.error || 'Erro desconhecido ao enviar inscrição');
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;

  } catch (error) {
    console.error("Erro ao enviar a inscricao: ", error);
    throw error;
  }
};

export const fetchInscricoes = async (hash, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/candidatos/${hash}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;

  } catch (error) {
    console.error("Erro ao enviar a inscricao: ", error);
    throw error;
  }
}


export const fetchInscricao = async (inscricaoId, hash, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/inscricoes/${inscricaoId}/${hash}`);

    if (!response.ok) {
      throw new Error('Erro ao buscar a inscrição. Verifique o ID e tente novamente.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar a inscrição:', error);
    throw new Error('Não foi possível carregar os dados da inscrição.');
  }
};

export const rejectInscription = async (id, userId, motivo, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/inscricoes/${id}/rejeitar/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({user_id: userId, motivo})
    });

    if (!response.ok) {
      throw new Error('Erro ao rejeitar a inscrição.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao rejeitar a inscrição:', error);
    throw new Error('Não foi possível rejeitar da inscrição.');
  }
};

export const approveInscription = async (id, userId, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/inscricoes/${id}/aprovar/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({user_id: userId})
    })

    if (!response.ok) {
      throw new Error('Erro ao aprovar a inscrição.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao aprovar a inscrição:', error);
    throw new Error('Não foi possível aprovar os dados da inscrição.');
  }
};

export const updateInscricao = async (inscricao, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/inscricao/alterar/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inscricao),
    });

    if (response.status !== 200) {
      const errorData = await response.json();

      console.log(errorData)
      throw new Error(errorData.error || 'Erro desconhecido ao atualizar inscrição');
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;

  } catch (error) {
    console.error("Erro ao atualizar a inscricao: ", error);
    throw error;
  }
}

export const loginAdmin = async (loginData, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.error || 'Erro desconhecido ao realizar login');
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user_id', data.user_id)
    return data;
  } catch (error) {
    console.error("Erro ao realizar login: ", error);
    throw error;
  }
};

export const recoverSenha = async (email, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/recuperar-senha/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.error || 'Erro desconhecido ao solicitar recuperação de senha');
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao solicitar recuperação de senha: ', error);
  }
};

export const updateSenha = async (payload, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/alterar-senha/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( payload ),
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.message || 'Erro desconhecido ao solicitar a alteração de senha');
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao solicitar a alteração de senha');
  }
};

export const getCursos = async (filters, config) => {
  try {

    const params = new URLSearchParams()
    if (filters.nome) params.append('nome', filters.nome)
    if (filters.dataInicial) params.append('data_inicial', filters.dataInicial)
    if (filters.dataFinal) params.append('data_final', filters.dataFinal)

    const response = await fetch(`${config.public.apiUrl}/cursos/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.message || 'Erro desconhecido ao solicitar os cursos');
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao solicitar os cursos');
  }
}

export const postCursos = async (formData, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/curso-novo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body:  JSON.stringify({
        nome: formData.value.nome,
        descricao: formData.value.descricao,
        prazo_inscricoes: formData.value.prazo_inscricoes,
        polos: formData.value.polos
      }),
    });

    if (response.status !== 201) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.message || 'Erro desconhecido ao criar o curso');
    }

    let data = await response.json();
    console.log("Resposta da API:", data);

    data.message = "Curso criado com sucesso";

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao solicitar a criação do curso');
  }
}

export const getPolos = async (config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/polos/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.message || 'Erro desconhecido ao solicitar os polos');
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao solicitar os polos');
  }
}

export const fetchCurso = async(config, cursoId) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/cursos/${cursoId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      }
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.message || 'Erro desconhecido ao solicitar o curso');
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao solicitar o curso');
  }
}


export const updateCurso = async (cursoId, formData, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/cursos/${cursoId}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body:  JSON.stringify({
        nome: formData.value.nome,
        descricao: formData.value.descricao,
        prazo_inscricoes: formData.value.prazo_inscricoes,
        polos: formData.value.polos
      }),
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(errorData.message || 'Erro desconhecido ao atualizar o curso');
    }

    let data = await response.json();
    console.log("Resposta da API:", data);

    data.message = "Curso atualizado com sucesso";
    
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao solicitar a atualização do curso');
  }
}

export const getAdminUsers = async (filters, config) => {
  try {
    const queryParams = new URLSearchParams({
      ...(filters.nome && { nome: filters.nome }),
      ...(filters.email && { email: filters.email })
    }).toString();

    const response = await fetch(`${config.public.apiUrl}/admin/usuarios${queryParams ? `?${queryParams}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar usuários');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar usuários administradores');
  }
}
// Buscar usuário específico
export const getAdminUser = async (userId, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/usuarios/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar usuário');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar dados do usuário');
  }
}

// Criar novo usuário admin
export const createAdminUser = async (userData, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/usuarios/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        nome_completo: userData.nome_completo,
        telas: userData.telas
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar usuário');
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao criar usuário administrador');
  }
}

// Atualizar usuário admin
export const updateAdminUser = async (userId, userData, config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/usuarios/${userId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        ...(userData.email && { email: userData.email }),
        ...(userData.nome_completo && { nome_completo: userData.nome_completo }),
        ...(userData.password && { password: userData.password }),
        ...(typeof userData.ativo !== 'undefined' && { ativo: userData.ativo }),
        ...(userData.telas && { telas: userData.telas })
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar usuário');
    }

    const data = await response.json();
    data.message = "Usuário atualizado com sucesso";
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao atualizar usuário administrador');
  }
}


export const getTelas = async (config) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/telas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar telas');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar telas do sistema');
  }
}

export const getDados = async (config, id) => {
  try {
    const response = await fetch(`${config.public.apiUrl}/admin/usuarios/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar telas');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar dados.');
  }
}

export const getInscricoes = async (filters, config, url) => {
  try {
    const urlBusca = url ? url : `${config.public.apiUrl}/admin/inscricoes`;

    const queryString = new URLSearchParams(filters).toString();
    const urlComFiltros = `${urlBusca}?${queryString}`;

    const response = await fetch(urlComFiltros, {
      method: 'GET',
      params: filters,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar inscricoes');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar inscricoes do sistema');
  }
}

export const fetchHistoricoInscricao = async (id, config) => {
  const response = await fetch(`${config.public.apiUrl}/admin/inscricoes/${id}/historico/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar histórico da inscrição')
  }

  return await response.json()
}