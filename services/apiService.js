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