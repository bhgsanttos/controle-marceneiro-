let usuario = '';
let dados = {
  projetos: [],
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

function salvar() {
  const cliente = document.getElementById('cliente').value;
  const projeto = document.getElementById('projeto').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const material = document.getElementById('material').value;
  const custo = parseFloat(document.getElementById('custo').value);
  const data = document.getElementById('data').value;
  const observacao = document.getElementById('observacao').value;

  if (!cliente || !projeto || isNaN(valor) || isNaN(custo)) return alert("Preencha todos os campos!");

  dados.projetos.push({ cliente, projeto, valor, material, custo, data, observacao });
  salvarDados();
  atualizarGraficos();
}

function fecharMes() {
  const totalRecebido = dados.projetos.reduce((a, b) => a + b.valor, 0);
  const totalCusto = dados.projetos.reduce((a, b) => a + b.custo, 0);
  const saldo = totalRecebido - totalCusto;
  const mes = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

  dados.historico.push({ mes, totalRecebido, totalCusto, saldo });
  dados.projetos = [];
  salvarDados();
  atualizarGraficos();
}

function salvarDados() {
  localStorage.setItem(`marceneiro_${usuario}`, JSON.stringify(dados));
}

function carregarDados() {
  const salvo = localStorage.getItem(`marceneiro_${usuario}`);
  if (salvo) dados = JSON.parse(salvo);
}

let graficoPizza, graficoBarra;

function atualizarGraficos() {
  const recebido = dados.projetos.reduce((a, b) => a + b.valor, 0);
  const custo = dados.projetos.reduce((a, b) => a + b.custo, 0);

  if (graficoPizza) graficoPizza.destroy();
  graficoPizza = new Chart(document.getElementById('graficoPizza'), {
    type: 'pie',
    data: {
      labels: ['Recebido', 'Custo'],
      datasets: [{
        data: [recebido, custo],
        backgroundColor: ['#4CAF50', '#f44336']
      }]
    }
  });

  if (graficoBarra) graficoBarra.destroy();
  graficoBarra = new Chart(document.getElementById('graficoBarra'), {
    type: 'bar',
    data: {
      labels: dados.historico.map(h => h.mes),
      datasets: [
        {
          label: 'Recebido',
          data: dados.historico.map(h => h.totalRecebido),
          backgroundColor: '#4CAF50'
        },
        {
          label: 'Custos',
          data: dados.historico.map(h => h.totalCusto),
          backgroundColor: '#f44336'
        }
      ]
    }
  });
}
