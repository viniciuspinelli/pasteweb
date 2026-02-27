const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// Armazenamento em memória (simples e eficaz)
let savedCode = {
    code: '',
    timestamp: null
};

// API - Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        hasCode: !!savedCode.code
    });
});

// API - Salvar código
app.post('/api/code', (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code || typeof code !== 'string') {
            return res.status(400).json({ 
                error: 'Código inválido',
                message: 'O campo code é obrigatório e deve ser uma string'
            });
        }
        
        // Salvar código com timestamp
        savedCode = {
            code: code,
            timestamp: new Date().toISOString()
        };
        
        console.log('✅ Código salvo:', new Date().toLocaleString('pt-BR'));
        
        res.json({
            success: true,
            message: 'Código salvo com sucesso',
            timestamp: savedCode.timestamp,
            codeLength: code.length
        });
        
    } catch (error) {
        console.error('❌ Erro ao salvar código:', error);
        res.status(500).json({ 
            error: 'Erro interno',
            message: 'Não foi possível salvar o código'
        });
    }
});

// API - Obter código salvo
app.get('/api/code', (req, res) => {
    res.json({
        code: savedCode.code,
        timestamp: savedCode.timestamp,
        hasCode: !!savedCode.code
    });
});

// API - Limpar código (opcional)
app.delete('/api/code', (req, res) => {
    savedCode = {
        code: '',
        timestamp: null
    };
    
    console.log('🗑️ Código removido');
    
    res.json({
        success: true,
        message: 'Código removido com sucesso'
    });
});

// Catch-all - Serve index.html para rotas não-API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🚀 PasteWeb rodando!');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
    console.log('💡 Como usar:');
    console.log('   1. Acesse a página no navegador');
    console.log('   2. Cole seu código no textarea');
    console.log('   3. Clique em "Salvar Código"');
    console.log('   4. Acesse de outro PC e copie o código!');
});