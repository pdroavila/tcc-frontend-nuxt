import axios from 'axios';

const API_URL = 'https://restcountries.com/v3.1/all';

export const fetchCountries = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.map(country => ({
      value: country.cca2,
      label: country.translations.por.common || country.name.common
    })).sort((a, b) => a.label.localeCompare(b.label));
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

export const buscarCEP = async (cep) => {
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