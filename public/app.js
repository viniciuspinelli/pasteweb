// Smooth scrolling para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obter dados do formulário
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Mostrar loading
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        try {
            // Simulação de envio (substitua com sua API real)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mostrar sucesso
            alert('Mensagem enviada com sucesso!');
            contactForm.reset();
            
        } catch (error) {
            // Mostrar erro
            alert('Erro ao enviar mensagem. Tente novamente.');
            console.error('Erro:', error);
        } finally {
            // Restaurar botão
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// Animação de entrada para elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animação aos cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Verificar status da API
async function checkApiStatus() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('API Status:', data);
        return data;
    } catch (error) {
        console.error('API não disponível:', error);
        return null;
    }
}

// Verificar status ao carregar a página
checkApiStatus();