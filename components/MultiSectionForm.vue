<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg">
      <div class="max-w-4xl mx-auto p-4 sm:p-6 border-solid border-2 rounded">
        <div
          class="flex flex-wrap mb-6 sm:mb-8 border-b overflow-x-auto justify-center gap-2.5"
          v-if="!formSubmitted"
        >
          <div
            v-for="(section, index) in sections"
            :key="index"
            class="flex items-center mr-4 sm:mr-8 pb-2 whitespace-nowrap"
            :class="{ 'border-b-2 border-green-100': currentSection === index }"
          >
            <div
              class="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-1 sm:mr-2 text-xs sm:text-sm"
              :class="
                currentSection === index
                  ? 'bg-green-100 text-white'
                  : 'bg-gray-300 text-gray-600'
              "
            >
              {{ index + 1 }}
            </div>
            <span
              class="text-xs sm:text-sm"
              :class="currentSection === index ? 'text-pedro' : 'text-gray-500'"
            >
              {{ section.title }}
            </span>
          </div>
        </div>

        <form @submit.prevent="nextStep" class="space-y-4">
          <!-- Dados Pessoais - Informações básicas -->
          <div v-if="currentSection === 0 && currentStep === 0">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >E-mail <span class="text-red-500">*</span></label
                >
                <input
                  v-model="formData.email"
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  for="nacionalidade"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Nacionalidade <span class="text-red-500">*</span></label
                >
                <select
                  v-model="formData.nacionalidade"
                  id="nacionalidade"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                >
                  <option value="" disabled selected>Selecione</option>
                  <option value="1">Brasil</option>
                </select>
              </div>
              <div>
                <label
                  for="nome"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Nome <span class="text-red-500">*</span></label
                >
                <input
                  v-model="formData.nome"
                  id="nome"
                  placeholder="Nome completo"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  for="naturalidade"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Naturalidade <span class="text-red-500">*</span></label
                >
                <input
                  v-model="formData.naturalidade"
                  id="naturalidade"
                  placeholder="Município de nascimento"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  for="nomeSocial"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Nome social</label
                >
                <input
                  v-model="formData.nomeSocial"
                  id="nomeSocial"
                  placeholder="Nome completo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  for="telefone"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Telefone celular <span class="text-red-500">*</span></label
                >
                <input
                  v-model="formData.telefone"
                  id="telefone"
                  @input="maskTelefone"
                  placeholder="DDD + 9 números"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  for="nomeMae"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Nome da mãe <span class="text-red-500">*</span></label
                >
                <input
                  v-model="formData.nomeMae"
                  id="nomeMae"
                  placeholder="Nome completo"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  for="dataNascimento"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Data de nascimento <span class="text-red-500">*</span></label
                >
                <input
                  v-model="formData.dataNascimento"
                  id="dataNascimento"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div class="sm:col-span-2">
                <label
                  for="poloOfertante"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Polo ofertante <span class="text-red-500">*</span></label
                >
                <select
                  v-model="formData.poloOfertante"
                  id="poloOfertante"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                >
                  <option value="" disabled selected>Selecione</option>
                  <option value="1">Polo A</option>
                  <option value="2">Polo B</option>
                  <option value="3">Polo C</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Dados Pessoais - Documentos -->
          <div v-if="currentSection === 0 && currentStep === 1">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex gap-2.5 flex-col">
                <div class="sm:col-span-2">
                  <label
                    for="documento"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Número de documento (CPF ou Cédula Estrangeira)
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.documento"
                    id="documento"
                    placeholder="CPF ou Cédula estrangeira"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      v-model="formData.isCedulaEstrangeira"
                      class="form-checkbox h-5 w-4 text-green-600 accent-green-200"
                    />
                    <span class="ml-2 text-gray-700">Cédula Estrangeira</span>
                  </label>
                </div>
                <div class="sm:col-span-2">
                  <label
                    for="documentoUpload"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Envie o documento <span class="text-red-500">*</span>
                  </label>
                  <div
                    class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                  >
                    <div class="space-y-1 text-center">
                      <svg
                        class="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <div class="flex text-sm text-gray-600 flex-col">
                        <label
                          for="cpf-upload"
                          class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Clique para selecionar o arquivo</span>
                          <input
                            id="cpf-upload"
                            name="cpf-upload"
                            type="file"
                            class="sr-only"
                            accept="image/png, image/jpeg, image/jpg, .pdf"
                            required
                            @change="handleFileUpload($event, 'cpf')"
                          />
                        </label>
                        <p class="pl-1">ou arraste e solte</p>
                      </div>
                      <p v-if="!fileNames.cpf" class="text-xs text-gray-500">
                        PNG, JPG, JPEG, PDF até 10MB
                      </p>
                      <p v-else class="text-sm text-gray-700">
                        {{ fileNames.cpf }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex gap-2.5 flex-col">
                <div class="sm:col-span-2">
                  <label
                    for="registroGeral"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Registro Geral (RG ou Cédula estrangeira)
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.registroGeral"
                    id="registroGeral"
                    placeholder="RG ou Cédula estrangeira"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      v-model="formData.isRGCedulaEstrangeira"
                      class="form-checkbox h-5 w-4 text-green-600 accent-green-200"
                    />
                    <span class="ml-2 text-gray-700">Cédula Estrangeira</span>
                  </label>
                </div>
                <div class="sm:col-span-2">
                  <label
                    for="rgUpload"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Envie o RG <span class="text-red-500">*</span>
                  </label>
                  <div
                    class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                  >
                    <div class="space-y-1 text-center">
                      <svg
                        class="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <div class="flex text-sm text-gray-600 flex-col">
                        <label
                          for="rg-upload"
                          class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Clique para selecionar o arquivo</span>
                          <input
                            id="rg-upload"
                            name="rg-upload"
                            type="file"
                            class="sr-only"
                            accept="image/png, image/jpeg, image/jpg, .pdf"
                            required
                            @change="handleFileUpload($event, 'rg')"
                          />
                        </label>
                        <p class="pl-1">ou arraste e solte</p>
                      </div>
                      <p v-if="!fileNames.rg" class="text-xs text-gray-500">
                        PNG, JPG, PDF até 10MB
                      </p>
                      <p v-else class="text-sm text-gray-700">
                        {{ fileNames.rg }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Informações do Perfil -->
          <div v-if="currentSection === 1">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  for="genero"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gênero <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.genero"
                  id="genero"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="" disabled selected>Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                  <option value="nao">Não quero informar</option>
                </select>
              </div>
              <div>
                <label
                  for="necessidadesEspeciais"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Portador de necessidades especiais?
                  <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.necessidadesEspeciais"
                  id="necessidadesEspeciais"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="" disabled selected>Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label
                  for="estadoCivil"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Estado Civil <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.estadoCivil"
                  id="estadoCivil"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="" disabled selected>Selecione</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                </select>
              </div>
              <div v-if="formData.necessidadesEspeciais === 'sim'">
                <label
                  for="quaisNecessidades"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Se sim, quais?
                </label>
                <input
                  v-model="formData.quaisNecessidades"
                  id="quaisNecessidades"
                  type="text"
                  placeholder="Descreva a necessidade especial"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  for="rendaPerCapita"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Renda per capita <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.rendaPerCapita"
                  id="rendaPerCapita"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="" disabled selected>Selecione</option>
                  <option value="ate05sm">Até 0,5 salário mínimo</option>
                  <option value="05a1sm">0,5 a 1,0 salário mínimo</option>
                  <option value="1a15sm">1,0 a 1,5 salário mínimo</option>
                  <option value="15a25sm">1,5 a 2,5 salários mínimos</option>
                  <option value="25a35sm">2,5 a 3,5 salários mínimos</option>
                  <option value="mais35sm">
                    Acima de 3,5 salários mínimos
                  </option>
                  <option value="nao">Prefiro não informar</option>
                </select>
              </div>
              <div>
                <label
                  for="etnia"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Etnia <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.etnia"
                  id="etnia"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="" disabled selected>Selecione</option>
                  <option value="branco">Branco</option>
                  <option value="Preto">Preto</option>
                  <option value="pardo">Pardo</option>
                  <option value="amarelo">Amarelo</option>
                  <option value="indigena">Indígena</option>
                  <option value="nao">Não quero informar</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Endereço -->
          <div v-if="currentSection === 2">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label
                  for="areaUrbanaRural"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Você mora em área urbana ou rural?
                  <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.areaUrbanaRural"
                  id="areaUrbanaRural"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="" disabled selected>Selecione</option>
                  <option value="urbana">Urbana</option>
                  <option value="rural">Rural</option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <label
                  for="logradouro"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Logradouro <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.logradouro"
                  id="logradouro"
                  type="text"
                  required
                  placeholder="Logradouro"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  for="cep"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  CEP <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.cep"
                  @input="maskCEP"
                  id="cep"
                  type="text"
                  required
                  placeholder="CEP"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  for="bairro"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bairro <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.bairro"
                  id="bairro"
                  type="text"
                  required
                  placeholder="Bairro"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  for="cidade"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cidade <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.cidade"
                  id="cidade"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="" disabled selected>Selecione</option>
                  <option value="1">Cidade A</option>
                  <option value="2">Cidade B</option>
                  <option value="3">Cidade C</option>
                </select>
              </div>

              <div>
                <label
                  for="numero"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Número <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.numero"
                  id="numero"
                  type="text"
                  required
                  placeholder="Número"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label
                  for="estado"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Estado <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.estado"
                  id="estado"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="" disabled selected>Selecione</option>
                  <option value="1">Rio Grande do Sul</option>
                </select>
              </div>

              <div>
                <label
                  for="complemento"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Complemento <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.complemento"
                  id="complemento"
                  type="text"
                  required
                  placeholder="Complemento"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <!-- Histórico Educacional -->
          <div v-if="currentSection === 3 && !formSubmitted">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label
                  for="tipoEscola"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Estudou em escola pública ou privada?
                  <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.tipoEscola"
                  id="tipoEscola"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="" disabled selected>Selecione</option>
                  <option value="publica">Pública</option>
                  <option value="privada">Privada</option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <label
                  for="nivelEscolaridade"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nível de escolaridade <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.nivelEscolaridade"
                  id="nivelEscolaridade"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="" disabled selected>Selecione</option>
                  <option value="fundamental_i_completo">
                    Fundamental I - Completo (1º a 5º)
                  </option>
                  <option value="fundamental_i_incompleto">
                    Fundamental I - Incompleto (1º a 5º)
                  </option>
                  <option value="fundamental_ii_completo">
                    Fundamental II - Completo (6º a 9º)
                  </option>
                  <option value="fundamental_ii_incompleto">
                    Fundamental II - Incompleto (6º a 9º)
                  </option>
                  <option value="medio_completo">Médio - Completo</option>
                  <option value="medio_incompleto">Médio - Incompleto</option>
                  <option value="superior_completo">Superior - Completo</option>
                  <option value="superior_incompleto">
                    Superior - Incompleto
                  </option>
                  <option value="pos_graduacao_completo">
                    Pós-graduação - Completo
                  </option>
                  <option value="pos_graduacao_incompleto">
                    Pós-graduação - Incompleto
                  </option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <label
                  for="historicoEscolar"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Envie o histórico escolar <span class="text-red-500">*</span>
                </label>
                <div
                  class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                >
                  <div class="space-y-1 text-center">
                    <svg
                      class="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <div class="flex text-sm text-gray-600 flex-col">
                      <label
                        for="historico-upload"
                        class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Clique para selecionar o arquivo</span>
                        <input
                          id="historico-upload"
                          name="historico-upload"
                          type="file"
                          class="sr-only"
                          accept="application/pdf"
                          required
                          @change="handleFileUpload($event, 'historico')"
                        />
                      </label>
                      <p class="pl-1">ou arraste e solte</p>
                    </div>
                    <p
                      v-if="!fileNames.historico"
                      class="text-xs text-gray-500"
                    >
                      PDF até 10MB
                    </p>
                    <p v-else class="text-sm text-gray-700">
                      {{ fileNames.historico }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between mt-6" v-if="!formSubmitted">
            <button
              @click="previousStep"
              type="button"
              class="px-4 sm:px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              VOLTAR
            </button>
            <button
              type="submit"
              class="px-4 sm:px-6 py-2 bg-green-100 text-white rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {{
                currentSection === sections.length - 1
                  ? "ENVIAR INSCRIÇÃO"
                  : "CONTINUAR"
              }}
            </button>
          </div>
        </form>

        <!-- Tela de Confirmação -->
        <div v-if="formSubmitted" class="text-center">
          <svg
            class="mx-auto h-24 w-24 text-green-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Inscrição Enviada com Sucesso!
          </h2>
          <p class="text-gray-600 mb-4">
            Agradecemos pelo seu interesse. Enviamos mais informações para o seu
            e-mail.
          </p>
          <p class="text-gray-600">
            Fique atento à sua caixa de entrada para os próximos passos.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const fileNames = ref({
  cpf: "",
  rg: "",
});

const handleFileUpload = (event, fileType) => {
  const file = event.target.files[0];
  if (file) {
    fileNames.value[fileType] = file.name;
  }
};

const sections = [
  { title: "Dados Pessoais", steps: 2 },
  { title: "Informações do Perfil", steps: 1 },
  { title: "Endereço", steps: 1 },
  { title: "Histórico Educacional", steps: 1 },
];

const maskTelefone = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 2) {
    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
  }
  if (value.length > 10) {
    value = `${value.slice(0, 10)}-${value.slice(10)}`;
  }

  formData.telefone = value;
};

const validateTelefone = () => {
  const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
  return phoneRegex.test(formData.telefone);
};

const validateCPF = () => {
  // Remove caracteres não numéricos
  let cpf = formData.documento.replace(/\D/g, "");

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Elimina CPFs inválidos conhecidos
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let firstVerifier = (sum * 10) % 11;
  if (firstVerifier === 10 || firstVerifier === 11) firstVerifier = 0;
  if (firstVerifier !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let secondVerifier = (sum * 10) % 11;
  if (secondVerifier === 10 || secondVerifier === 11) secondVerifier = 0;
  if (secondVerifier !== parseInt(cpf.charAt(10))) return false;

  return true;
};

const maskCEP = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  if (value.length > 8) value = value.slice(0, 8);

  if (value.length > 5) {
    value = `${value.slice(0, 5)}-${value.slice(5)}`;
  }

  formData.cep = value;
};

const validateCEP = () => {
  const cepRegex = /^\d{5}-\d{3}$/;
  return cepRegex.test(formData.cep);
};

const currentSection = ref(0);
const currentStep = ref(0);
const formSubmitted = ref(false);

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

const nextStep = () => {
  if (currentSection.value === 0) {
    if (!validateTelefone()) {
      alert("Por favor, insira um número de telefone válido.");
      return;
    }
    if (currentStep.value == 1 && !formData.isCedulaEstrangeira)
      if (!validateCPF()) {
        alert("Por favor, insira um CPF válido.");
        return;
      }
  }

  if (currentSection.value === 2) {
    if (!validateCEP()) {
      alert("Por favor, insira um CEP válido.");
      return;
    }
  }

  if (currentSection.value < sections.length - 1) {
    if (currentStep.value < sections[currentSection.value].steps - 1) {
      currentStep.value++;
    } else {
      currentSection.value++;
      currentStep.value = 0;
    }
  } else if (
    currentSection.value === sections.length - 1 &&
    currentStep.value < sections[currentSection.value].steps - 1
  ) {
    currentStep.value++;
  } else {
    console.log("Formulário enviado:", formData);
    submitForm();
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
