<script setup>
import { ref, onMounted, watch } from "vue";
import { useApiStore } from "../../stores/api";

const apiStore = useApiStore();
const coins = ref([]);
const showModal = ref(false);
const modalData = ref(null);
const convertedValue = ref("");
const errorMessage = ref(""); 

const formatCoins = (data) => {
  return Object.values(data).map((item) => ({
    origin: item.code,
    destinationCoin: item.codein,
    name: item.name,
    bid: item.bid,
  }));
};

onMounted(() => {
  apiStore.getCoins()
  if (apiStore.coinData) {
    coins.value = formatCoins(apiStore.coinData);
  }
});

watch(
  () => apiStore.coinData,
  (newValue) => {
    coins.value = formatCoins(newValue);
  }
);

const exchageCoin = (coin) => {
  modalData.value = coin;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  modalData.value = null;
  convertedValue.value = "";
  errorMessage.value = ""
};

const sendExchange = async (e) => {
  e.preventDefault();

  if (convertedValue.value <= 50 || convertedValue.value === "") {
    errorMessage.value = "O valor deve ser maior que 50.";
    return;
  } else {
    errorMessage.value = "";
  }

  if (convertedValue.value) {
    try {
      const result = await apiStore.exchangeCoins(
        convertedValue.value,
        modalData.value.destinationCoin
      );

      modalData.value.grossValue = result?.total_converted_value.toFixed(2) || "0.00";
      modalData.value.tax = result?.tax || 0;
    } catch (error) {
      alert("Erro ao realizar conversão. Por favor, tente novamente.");
      console.error(error);
    }
  }
};
</script>

<template>
  <div>
    <h1 class="title">Conversão de Moeda</h1>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>Nomes das Moedas</th>
          <th>Sigla Moeda Origem</th>
          <th>Sigla Moeda Destino</th>
          <th>Câmbio</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coin in coins" :key="coin.name">
          <td>{{ coin.name }}</td>
          <td>{{ coin.origin }}</td>
          <td>{{ coin.destinationCoin }}</td>
          <td>{{ coin.bid }}</td>
          <td>
            <button class="btn" @click="exchageCoin(coin)">Converter Moeda</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <h2>Converter Moeda</h2>
        <p>
          <strong>De:</strong> {{ modalData.origin }} <strong>para:</strong> {{ modalData.destinationCoin }}
        </p>

        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Sigla Moeda Origem</th>
              <th>Sigla Moeda Destino</th>
              <th>Câmbio</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ modalData.origin }}</td>
              <td>{{ modalData.destinationCoin }}</td>
              <td>{{ modalData.bid }}</td>
            </tr>
          </tbody>
        </table>

        <form @submit="sendExchange">
          <label for="valor">Insira o valor a ser convertido:</label>
          <input
            id="valor"
            type="number"
            step="any"
            class="input-box"
            v-model="convertedValue"
            placeholder="Digite o valor"
          />

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <div class="button-group">
            <button type="submit" class="btn">Enviar Conversão</button>
            <button type="button" class="btn btn-secondary fechar-btn" @click="closeModal">Fechar</button>
          </div>
        </form>

        <div v-if="modalData.grossValue" class="result-conversion">
          <p>
            <strong>Taxa aplicada:</strong> {{ modalData.tax }}%
          </p>
          <p>
            <strong>Valor convertido em {{ modalData.destinationCoin }}:</strong> {{ modalData.grossValue }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  margin: 5px;
  font-size: 14px;
}

.btn:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.input-box {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  margin: 10px 0;
  font-size: 14px;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.modal h2 {
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
}

.modal table {
  width: 100%;
  margin: 10px 0;
  border-collapse: collapse;
}

.result-conversion {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  text-align: center;
}

.result-conversion p {
  margin: 5px 0;
  font-size: 16px;
  color: #333;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.button-group .fechar-btn {
    margin-left: auto;
  }
</style>
