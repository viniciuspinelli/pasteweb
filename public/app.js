// PasteWeb - Compartilhamento de código entre PCs
// Aguarda o DOM estar completamente carregado

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM - com verificação de segurança
    const codeInput = document.getElementById('code-input');
    const saveBtn = document.getElementById('save-btn');
    const copyBtn = document.getElementById('copy-btn');
    const savedSection = document.getElementById('saved-section');
    const emptyState = document.getElementById('empty-state');
    const savedCode = document.getElementById('saved-code');
    const timestamp = document.getElementById('timestamp');
    const toast = document.getElementById('toast');
    
    // Verificar se elementos críticos existem
    if (!codeInput || !saveBtn) {
        console.error('Elementos essenciais não encontrados!');
        return;
    }
    
    // Carregar código salvo ao iniciar
    loadSavedCode();
    
    // Event Listeners
    saveBtn.addEventListener('click', saveCode);
    
    if (copyBtn) {
        copyBtn.addEventListener('click', copyCode);
    }
    
    // Atalho de teclado: Ctrl+Enter para salvar
    codeInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            saveCode();
        }
    });
    
    // Auto-resize textarea
    codeInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.max(250, this.scrollHeight) + 'px';
    });
    
    // Função para salvar código
    async function saveCode() {
        const code = codeInput.value.trim();
        
        if (!code) {
            showToast('❌ Por favor, cole um código primeiro!', 'error');
            return;
        }
        
        // Mostrar loading
        saveBtn.disabled = true;
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '💾 Salvando...';
        
        try {
            const response = await fetch('/api/code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: code })
            });
            
            if (response.ok) {
                const data = await response.json();
                showToast('✅ Código salvo com sucesso!');
                codeInput.value = '';
                codeInput.style.height = '250px';
                displaySavedCode(data.code || code, data.timestamp);
            } else {
                throw new Error('Erro ao salvar');
            }
        } catch (error) {
            console.error('Erro:', error);
            showToast('❌ Erro ao salvar. Tente novamente.', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    }
    
    // Função para carregar código salvo
    async function loadSavedCode() {
        try {
            const response = await fetch('/api/code');
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.code && data.code.trim()) {
                    displaySavedCode(data.code, data.timestamp);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar código:', error);
        }
    }
    
    // Função para exibir código salvo
    function displaySavedCode(code, time) {
        if (!savedSection || !savedCode) {
            console.error('Elementos de exibição não encontrados');
            return;
        }
        
        // Esconder empty state se existir
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // Mostrar seção de código salvo
        savedSection.style.display = 'block';
        
        // Escapar HTML para exibição segura
        const escapedCode = escapeHtml(code);
        savedCode.innerHTML = '<code>' + escapedCode + '</code>';
        
        // Atualizar timestamp
        if (timestamp && time) {
            const date = new Date(time);
            timestamp.textContent = 'Salvo em: ' + date.toLocaleString('pt-BR');
        }
    }
    
    // Função para copiar código
    async function copyCode() {
        if (!savedCode) return;
        
        const code = savedCode.textContent;
        
        try {
            await navigator.clipboard.writeText(code);
            showToast('📋 Código copiado!');
            
            // Efeito visual no botão
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ Copiado!';
                setTimeout(function() {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            }
        } catch (error) {
            console.error('Erro ao copiar:', error);
            showToast('❌ Erro ao copiar. Selecione manualmente.', 'error');
        }
    }
    
    // Função para mostrar toast
    function showToast(message, type) {
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
    
    // Função para escapar HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});