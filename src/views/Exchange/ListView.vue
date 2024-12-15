<script setup>
import { ref, onMounted } from "vue";
import { useApiStore } from "../../stores/api";

const apiStore = useApiStore();
const transactions = ref([]);

const formatCurrency = (value, locale = 'en-US') => {
  if (value === null || value === undefined) return '0.00'; // Retorna '0.00' se o valor for nulo ou indefinido
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

onMounted(async () => {
  try {
    const result = await apiStore.listAllExchangesByUser();
    transactions.value = result;  
  } catch (error) {
    console.error("Error loading transactions:", error);
  }
});
</script>

<template>
  <div>
    <h1 class="title">Lista de Transações Efetuadas</h1>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>Moeda Origem</th>
          <th>Total Original</th>
          <th>Câmbio utilizado</th>
          <th>Taxa (%)</th>
          <th>Moeda Destino</th>
          <th>Total Convertido</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td>{{ transaction.origin_code }}</td>
          <td>R$ {{ formatCurrency(transaction.total_origin_value, 'pt-BR') }}</td>
          <td>{{ transaction.bid_value }}</td>
          <td>{{ transaction.tax }}</td>
          <td>{{ transaction.converted_code }}</td>
          <td>{{ formatCurrency(transaction.total_converted_value) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

table, th, td {
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
