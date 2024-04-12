import axios from 'axios';

interface IViaCepResponse {
  erro: boolean;
  uf: string;
  localidade: string;
  logradouro: string;
  bairro: string;
  cep: string;
}

export const getAddressFromCep = async (cep: string) => {
  const { data } = await axios.get<IViaCepResponse>(
    `https://viacep.com.br/ws/${cep}/json/`,
  );

  return data;
};
