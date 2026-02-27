// Gerenciamento de estado
let jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
let historico = JSON.parse(localStorage.getItem('historico')) || {};

// Elementos do DOM
const formPresenca = document.getElementById('formPresenca');
const listaConfirmados = document.getElementById('listaConfirmados');
const contadorConfirmados = document.getElementById('contadorConfirmados');
const btnSortear = document.getElementById('btnSortear');
const resultadoSorteio = document.getElementById('resultadoSorteio');

// Estatísticas
const statTotal = document.getElementById('statTotal');
const statUnicos = document.getElementById('statUnicos');
const statMensalistas = document.getElementById('statMensalistas');
const statAvulsos = document.getElementById('statAvulsos');
const rankingList = document.getElementById('rankingList');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    atualizarInterface();
    atualizarEstatisticas();
    atualizarRanking();
});

// Adicionar jogador
formPresenca.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    const genero = document.querySelector('input[name="genero"]:checked').value;
    
    if (!nome) return;
    
    // Verificar se já existe
    if (jogadores.some(j => j.nome.toLowerCase() === nome.toLowerCase())) {
        alert('Este jogador já confirmou presença!');
        return;
    }
    
    const jogador = {
        id: Date.now(),
        nome,
        tipo,
        genero,
        data: new Date().toISOString()
    };
    
    jogadores.push(jogador);
    salvarDados();
    
    // Atualizar histórico para ranking
    if (!historico[nome]) {
        historico[nome] = { nome, presencas: 0, genero };
    }
    historico[nome].presencas++;
    salvarHistorico();
    
    // Limpar formulário
    document.getElementById('nome').value = '';
    
    // Atualizar interface
    atualizarInterface();
    atualizarEstatisticas();
    atualizarRanking();
    
    // Esconder resultado do sorteio
    resultadoSorteio.classList.add('hidden');
});

// Remover jogador
function removerJogador(id) {
    jogadores = jogadores.filter(j => j.id !== id);
    salvarDados();
    atualizarInterface();
    atualizarEstatisticas();
    resultadoSorteio.classList.add('hidden');
}

// Atualizar interface
function atualizarInterface() {
    // Atualizar contador
    contadorConfirmados.textContent = jogadores.length;
    
    // Atualizar botão sortear
    btnSortear.disabled = jogadores.length < 2;
    
    // Atualizar lista
    if (jogadores.length === 0) {
        listaConfirmados.innerHTML = '<p class="empty-state">Nenhum jogador confirmado ainda</p>';
        return;
    }
    
    listaConfirmados.innerHTML = jogadores.map(jogador => `
        <div class="jogador-card">
            <div class="jogador-info">
                <div class="jogador-avatar ${jogador.genero === 'M' ? 'masculino' : 'feminino'}">
                    ${jogador.nome.charAt(0).toUpperCase()}
                </div>
                <div class="jogador-detalhes">
                    <h4>${jogador.nome}</h4>
                    <span>${jogador.genero === 'M' ? '👨 Masculino' : '👩 Feminino'}</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="jogador-tipo ${jogador.tipo}">${jogador.tipo}</span>
                <button class="btn-remover" onclick="removerJogador(${jogador.id})" title="Remover">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Sortear times
btnSortear.addEventListener('click', () => {
    if (jogadores.length < 2) {
        alert('Precisa de pelo menos 2 jogadores para sortear!');
        return;
    }
    
    const times = sortearTimes(jogadores);
    exibirTimes(times);
});

function sortearTimes(jogadores) {
    // Separar por gênero
    const homens = [...jogadores].filter(j => j.genero === 'M').sort(() => Math.random() - 0.5);
    const mulheres = [...jogadores].filter(j => j.genero === 'F').sort(() => Math.random() - 0.5);
    
    // Determinar número de times (máximo 4)
    const numTimes = Math.min(4, Math.ceil(jogadores.length / 4));
    const times = Array.from({ length: numTimes }, () => ({ homens: [], mulheres: [] }));
    
    // Distribuir homens
    homens.forEach((jogador, index) => {
        times[index % numTimes].homens.push(jogador);
    });
    
    // Distribuir mulheres
    mulheres.forEach((jogador, index) => {
        times[index % numTimes].mulheres.push(jogador);
    });
    
    return times;
}

function exibirTimes(times) {
    const coresTime = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'];
    const iconesTime = ['fa-shield-alt', 'fa-bolt', 'fa-fire', 'fa-star'];
    
    resultadoSorteio.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; color: var(--text);">
            <i class="fas fa-trophy" style="color: var(--warning);"></i> 
            Times Sorteados
        </h3>
        <div class="times-grid">
            ${times.map((time, index) => `
                <div class="time-card time-${index + 1}">
                    <h4>
                        <i class="fas ${iconesTime[index]}"></i>
                        Time ${index + 1}
                    </h4>
                    <ul class="time-jogadores">
                        ${[...time.homens, ...time.mulheres].map(jogador => `
                            <li>
                                <i class="fas ${jogador.genero === 'M' ? 'fa-male' : 'fa-female'}"></i>
                                ${jogador.nome}
                            </li>
                        `).join('')}
                    </ul>
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid var(--border); font-size: 0.85rem; color: var(--text-light);">
                        <i class="fas fa-male"></i> ${time.homens.length} homens | 
                        <i class="fas fa-female"></i> ${time.mulheres.length} mulheres | 
                        <i class="fas fa-users"></i> ${time.homens.length + time.mulheres.length} total
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    resultadoSorteio.classList.remove('hidden');
    resultadoSorteio.scrollIntoView({ behavior: 'smooth' });
}

// Atualizar estatísticas
function atualizarEstatisticas() {
    const total = jogadores.length;
    const nomesUnicos = [...new Set(jogadores.map(j => j.nome.toLowerCase()))].length;
    const mensalistas = jogadores.filter(j => j.tipo === 'mensalista').length;
    const avulsos = jogadores.filter(j => j.tipo === 'avulso').length;
    
    // Animação de contador
    animarContador(statTotal, parseInt(statTotal.textContent), total);
    animarContador(statUnicos, parseInt(statUnicos.textContent), nomesUnicos);
    animarContador(statMensalistas, parseInt(statMensalistas.textContent), mensalistas);
    animarContador(statAvulsos, parseInt(statAvulsos.textContent), avulsos);
}

function animarContador(elemento, de, para) {
    const duracao = 500;
    const inicio = performance.now();
    
    function atualizar(tempoAtual) {
        const progresso = Math.min((tempoAtual - inicio) / duracao, 1);
        const valor = Math.floor(de + (para - de) * progresso);
        elemento.textContent = valor;
        
        if (progresso < 1) {
            requestAnimationFrame(atualizar);
        }
    }
    
    requestAnimationFrame(atualizar);
}

// Atualizar ranking
function atualizarRanking() {
    const ranking = Object.values(historico)
        .sort((a, b) => b.presencas - a.presencas)
        .slice(0, 10);
    
    if (ranking.length === 0) {
        rankingList.innerHTML = '<p class="empty-state">Nenhum dado disponível</p>';
        return;
    }
    
    rankingList.innerHTML = ranking.map((jogador, index) => `
        <div class="ranking-item">
            <div class="ranking-posicao ${index < 3 ? 'top-' + (index + 1) : 'outros'}">
                ${index + 1}
            </div>
            <div class="jogador-avatar ${jogador.genero === 'M' ? 'masculino' : 'feminino'}" style="width: 40px; height: 40px; font-size: 0.9rem;">
                ${jogador.nome.charAt(0).toUpperCase()}
            </div>
            <div class="ranking-info">
                <h4>${jogador.nome}</h4>
                <span>${jogador.genero === 'M' ? 'Masculino' : 'Feminino'}</span>
            </div>
            <div class="ranking-presencas">
                <i class="fas fa-check-circle"></i>
                ${jogador.presencas} presenças
            </div>
        </div>
    `).join('');
}

// Persistência
function salvarDados() {
    localStorage.setItem('jogadores', JSON.stringify(jogadores));
}

function salvarHistorico() {
    localStorage.setItem('historico', JSON.stringify(historico));
}

// Limpar tudo (função utilitária)
function limparTudo() {
    if (confirm('Tem certeza que deseja limpar todos os dados?')) {
        jogadores = [];
        historico = {};
        localStorage.removeItem('jogadores');
        localStorage.removeItem('historico');
        atualizarInterface();
        atualizarEstatisticas();
        atualizarRanking();
        resultadoSorteio.classList.add('hidden');
    }
}

// Exportar para uso global (para os botões onclick)
window.removerJogador = removerJogador;
window.limparTudo = limparTudo;