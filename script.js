let usuario = '';
let dados = {
  entradas: [],
  saidas: [],
  historico: []
};

function login() {
  const nome = document.getElementById('username').value;
  if (nome.trim() === '') return alert("Digite seu nome");
  usuario = nome;
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('user-name').textContent = usuario;
  carregarDados();
  atualizarGraficos();
}

function adicionarEntrada() {
  const valor = parseFloat(document.getElementById('entrada').value);
  if (!valor || valor <= 0) return;
  dados.entradas.push(valor);
  salvarDados();
  atualizarGraficos();
}

function adicionarSaida() {
  const valor = parseFloat(document.getElementById('saida').value);
  if (!valor || valor <= 0) return;
  dados.saidas.push(valor);
  salvarDados();
  atualizarGraficos();
}

function fecharMes() {
  const totalEntradas = dados.entradas.reduce((a, b) => a + b, 0);
  const totalSaidas = dados.saidas.reduce((a, b) => a + b, 0);
  const saldo = totalEntradas - totalSaidas;
  const mes = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  dados.historico.push({ mes, entradas: totalEntradas, saidas: totalSaidas, saldo });
  dados.entradas = [];
  dados.saidas = [];
  salvarDados();
  atualizarGraficos();
}

function salvarDados() {
  localStorage.setItem(`financas_${usuario}`, JSON.stringify(dados));
}

function carregarDados() {
  const salvo = localStorage.getItem(`financas_${usuario}`);
  if (salvo) {
    dados = JSON.parse(salvo);
  }
}

let graficoPizza, graficoBarra;

function atualizarGraficos() {
  const totalEntradas = dados.entradas.reduce((a, b) => a + b, 0);
  const totalSaidas = dados.saidas.reduce((a, b) => a + b, 0);

  if (graficoPizza) graficoPizza.destroy();
  graficoPizza = new Chart(document.getElementById('graficoPizza'), {
    type: 'doughnut',
    data: {
      labels: ['Entradas', 'Saídas'],
      datasets: [{
        data: [totalEntradas, totalSaidas],
        backgroundColor: ['#4CAF50', '#F44336']
      }]
    }
  });

  const labels = dados.historico.map(h => h.mes);
  const entradasHist = dados.historico.map(h => h.entradas);
  const saidasHist = dados.historico.map(h => h.saidas);

  if (graficoBarra) graficoBarra.destroy();
  graficoBarra = new Chart(document.getElementById('graficoBarra'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Entradas',
          data: entradasHist,
          backgroundColor: '#4CAF50'
        },
        {
          label: 'Saídas',
          data: saidasHist,
          backgroundColor: '#F44336'
        }
      ]
    }
  });
}
