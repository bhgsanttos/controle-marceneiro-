// Usuário logado
let usuarioAtual = null;
let dadosUsuarios = {}; // Vai guardar usuários e senhas
let dadosProjetos = {}; // Guardar projetos por usuário

// ---------------------- AUTENTICAÇÃO -----------------------

function carregarUsuarios() {
  const json = localStorage.getItem('usuarios');
  dadosUsuarios = json ? JSON.parse(json) : {};
}

function salvarUsuarios() {
  localStorage.setItem('usuarios', JSON.stringify(dadosUsuarios));
}

function carregarProjetos() {
  if (!usuarioAtual) return;
  const json = localStorage.getItem('projetos_' + usuarioAtual);
  dadosProjetos = json ? JSON.parse(json) : [];
}

function salvarProjetos() {
  if (!usuarioAtual) return;
  localStorage.setItem('projetos_' + usuarioAtual, JSON.stringify(dadosProjetos));
}

function mostrarLogin() {
  document.getElementById('auth-page').style.display = 'block';
  document.getElementById('register-page').style.display = 'none';
  document.getElementById('dashboard').style.display = 'none';
}

function mostrarCadastro() {
  document.getElementById('auth-page').style.display = 'none';
  document.getElementById('register-page').style.display = 'block';
  document.getElementById('dashboard').style.display = 'none';
}

function fazerCadastro() {
  carregarUsuarios();
  const user = document.getElementById('register-username').value.trim();
  const pass = document.getElementById('register-password').value;
  const passConf = document.getElementById('register-password-confirm').value;
  if (!user || !pass) return alert('Preencha usuário e senha');
  if (pass !== passConf) return alert('Senhas não conferem');
  if (dadosUsuarios[user]) return alert('Usuário já existe');
  dadosUsuarios[user] = pass;
  salvarUsuarios();
  alert('Cadastro realizado com sucesso! Faça login.');
  mostrarLogin();
}

function fazerLogin() {
  carregarUsuarios();
  const user = document.getElementById('login-username').value.trim();
  const pass = document.getElementById('login-password').value;
  if (dadosUsuarios[user] && dadosUsuarios[user] === pass) {
    usuarioAtual = user;
    iniciarDashboard();
  } else {
    alert('Usuário ou senha incorretos');
  }
}

function logout() {
  usuarioAtual = null;
  mostrarLogin();
  limparCampos();
}

function iniciarDashboard() {
  carregarProjetos();
  document.getElementById('user-display').textContent = usuarioAtual;
  document.getElementById('auth-page').style.display = 'none';
  document.getElementById('register-page').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  atualizarHistorico();
  limparCampos();
}

// --------------------- PROJETOS ------------------------

function salvarProjeto() {
  const cliente = document.getElementById('cliente').value.trim();
  const nomeProjeto = document.getElementById('nome-projeto').value.trim();
  const valorRecebido = parseFloat(document.getElementById('valor-recebido').value) || 0;
  const material = document.getElementById('material').value.trim();
  const custoMaterial = parseFloat(document.getElementById('custo-material').value) || 0;
  const gastoGasolina = parseFloat(document.getElementById('gasto-gasolina').value) || 0;
  const gastoPedagio = parseFloat(document.getElementById('gasto-pedagio').value) || 0;
  const gastoEstacionamento = parseFloat(document.getElementById('gasto-estacionamento').value) || 0;
  const gastoAguaLuz = parseFloat(document.getElementById('gasto-agua-luz').value) || 0;
  const observacoes = document.getElementById('observacoes').value.trim();
  const dataProjeto = document.getElementById('data-projeto').value;

  if (!cliente || !nomeProjeto) return alert('Preencha nome do cliente e do projeto');

  const totalDespesas = custoMaterial + gastoGasolina + gastoPedagio + gastoEstacionamento + gastoAguaLuz;
  const lucro = valorRecebido - totalDespesas;

  const projeto = {
    cliente,
    nomeProjeto,
    valorRecebido,
    material,
    custoMaterial,
    gastoGasolina,
    gastoPedagio,
    gastoEstacionamento,
    gastoAguaLuz,
    totalDespesas,
    lucro,
    observacoes,
    dataProjeto
  };

  dadosProjetos.push(projeto);
  salvarProjetos();
  atualizarHistorico();
  limparCampos();
  mostrarResumo(projeto);
}

// Mostra o resumo do projeto atual
function mostrarResumo(proj) {
  const resumo = `
    Valor recebido: R$ ${proj.valorRecebido.toFixed(2)}<br>
    Total despesas: R$ ${proj.totalDespesas.toFixed(2)}<br>
    Lucro estimado: R$ ${proj.lucro.toFixed(2)}
  `;
  document.getElementById('resumo-projeto').innerHTML = resumo;
}

// Atualiza lista de projetos realizados
function atualizarHistorico() {
  const ul = document.getElementById('historico-projetos');
  ul.innerHTML = '';
  if(dadosProjetos.length === 0){
    ul.innerHTML = '<li>Nenhum projeto cadastrado.</li>';
    document.getElementById('resumo-projeto').textContent = 'Preencha os campos para ver o resumo';
    return;
  }
  dadosProjetos.forEach((p, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${p.nomeProjeto}</strong> (Cliente: ${p.cliente})<br>
    Valor recebido: R$ ${p.valorRecebido.toFixed(2)}<br>
    Lucro: R$ ${p.lucro.toFixed(2)}<br>
    Data: ${p.dataProjeto || 'Não informado'}`;
    ul.appendChild(li);
  });
}

// Limpa os campos do formulário de cadastro
function limparCampos() {
  const campos = ['cliente','nome-projeto','valor-recebido','material','custo-material','gasto-gasolina','gasto-pedagio','gasto-estacionamento','gasto-agua-luz','observacoes','data-projeto'];
  campos.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = '';
  });
  document.getElementById('resumo-projeto').textContent = 'Preencha os campos para ver o resumo';
}

// -------------------- CALCULADORA -----------------------

let calcExpressao = '';

function calcInput(val){
  calcExpressao += val;
  document.getElementById('calc-display').value = calcExpressao;
}

function calcClear(){
  calcExpressao = '';
  document.getElementById('calc-display').value = '';
}

function calcCalculate(){
  try {
    const resultado = eval(calcExpressao);
    document.getElementById('calc-display').value = resultado;
    calcExpressao = resultado.toString();
  } catch {
    document.getElementById('calc-display').value = 'Erro';
    calcExpressao = '';
  }
}

// Inicialização
mostrarLogin();
