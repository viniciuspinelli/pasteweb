// PasteWeb - Debug Version
console.log('✅ app.js carregado!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM pronto!');
    
    // Elementos do DOM
    const codeInput = document.getElementById('code-input');
    const saveBtn = document.getElementById('save-btn');
    const copyBtn = document.getElementById('copy-btn');
    const savedSection = document.getElementById('saved-section');
    const emptyState = document.getElementById('empty-state');
    const savedCode = document.getElementById('saved-code');
    const timestamp = document.getElementById('timestamp');
    const toast = document.getElementById('toast');
    
    // Debug: mostrar elementos encontrados
    console.log('codeInput:', !!codeInput);
    console.log('saveBtn:', !!saveBtn);
    console.log('copyBtn:', !!copyBtn);
    console.log('savedSection:', !!savedSection);
    
    if (!codeInput || !saveBtn) {
        console.error('❌ Elementos essenciais não encontrados!');
        alert('Erro: Elementos da página não encontrados. Recarregue a página.');
        return;
    }
    
    // Carregar código salvo
    console.log('🔄 Carregando código salvo...');
    loadSavedCode();
    
    // Event Listeners com debug
    saveBtn.addEventListener('click', function(e) {
        console.log('🖱️ Botão salvar clicado!');
        e.preventDefault();
        saveCode();
    });
    
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            console.log('🖱️ Botão copiar clicado!');
            e.preventDefault();
            copyCode();
        });
    }
    
    // Atalho Ctrl+Enter
    codeInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            console.log('⌨️ Ctrl+Enter pressionado');
            saveCode();
        }
    });
    
    // Auto-resize
    codeInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.max(250, this.scrollHeight) + 'px';
    });
    
    // Função para salvar código
    async function saveCode() {
        console.log('💾 Iniciando saveCode...');
        
        const code = codeInput.value;
        console.log('Código digitado:', code.substring(0, 50) + '...');
        
        if (!code || !code.trim()) {
            console.log('❌ Código vazio');
            showToast('❌ Por favor, cole um código primeiro!', 'error');
            return;
        }
        
        // Mostrar loading
        saveBtn.disabled = true;
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '💾 Salvando...';
        
        try {
            console.log('📤 Enviando POST para /api/code...');
            
            const response = await fetch('/api/code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: code.trim() })
            });
            
            console.log('📥 Resposta recebida:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Dados recebidos:', data);
                
                showToast('✅ Código salvo com sucesso!');
                codeInput.value = '';
                codeInput.style.height = '250px';
                displaySavedCode(data.code, data.timestamp);
            } else {
                const errorText = await response.text();
                console.error('❌ Erro na resposta:', errorText);
                throw new Error('Erro ' + response.status + ': ' + errorText);
            }
        } catch (error) {
            console.error('❌ Erro no fetch:', error);
            showToast('❌ Erro ao salvar: ' + error.message, 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    }
    
    // Função para carregar código
    async function loadSavedCode() {
        try {
            console.log('🔄 Buscando código em /api/code...');
            const response = await fetch('/api/code');
            
            console.log('📥 Status da resposta:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📋 Dados recebidos:', data);
                
                if (data.code && data.code.trim()) {
                    console.log('✅ Código encontrado, exibindo...');
                    displaySavedCode(data.code, data.timestamp);
                } else {
                    console.log('ℹ️ Nenhum código salvo');
                }
            } else {
                console.error('❌ Erro ao carregar:', response.status);
            }
        } catch (error) {
            console.error('❌ Erro no loadSavedCode:', error);
        }
    }
    
    // Função para exibir código
    function displaySavedCode(code, time) {
        console.log('🎨 Exibindo código...');
        
        if (!savedSection || !savedCode) {
            console.error('❌ Elementos de exibição não encontrados');
            return;
        }
        
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        savedSection.style.display = 'block';
        
        const escapedCode = escapeHtml(code);
        savedCode.innerHTML = '<code>' + escapedCode + '</code>';
        
        if (timestamp && time) {
            const date = new Date(time);
            timestamp.textContent = 'Salvo em: ' + date.toLocaleString('pt-BR');
        }
        
        console.log('✅ Código exibido com sucesso');
    }
    
    // Função para copiar
    async function copyCode() {
        if (!savedCode) return;
        
        const code = savedCode.textContent;
        
        try {
            await navigator.clipboard.writeText(code);
            showToast('📋 Código copiado!');
            
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ Copiado!';
                setTimeout(function() {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            }
        } catch (error) {
            console.error('Erro ao copiar:', error);
            showToast('❌ Erro ao copiar', 'error');
        }
    }
    
    // Toast
    function showToast(message, type) {
        console.log('🍞 Toast:', message);
        
        if (!toast) {
            alert(message);
            return;
        }
        
        toast.textContent = message;
        toast.className = 'toast show';
        
        if (type === 'error') {
            toast.classList.add('error');
        } else {
            toast.classList.remove('error');
        }
        
        setTimeout(function() {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    console.log('✅ Tudo inicializado!');
});