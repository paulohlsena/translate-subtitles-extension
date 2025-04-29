// Função para traduzir texto usando a API do MyMemory
async function translateTextMyMemory(text) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Erro ao buscar tradução: ${res.status}`);
        }

        const data = await res.json();
        if (data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText;
        } else {
            console.warn("⚠️ Tradução não encontrada.");
            return "Erro na tradução"; // Caso não encontre tradução
        }
    } catch (error) {
        console.error("❌ Erro ao tentar traduzir com MyMemory:", error);
        return "Erro na tradução"; // Caso ocorra erro na requisição
    }
}

// Função de captura de legendas e exibição do popup
async function captureSubtitle() {
    const subtitleElements = document.querySelectorAll('.TextCue-Fuse-Web-Play__sc-1wvp621-4');

    if (subtitleElements.length > 0) {
        const subtitleText = Array.from(subtitleElements)
            .map(el => el.innerText.trim())
            .join(' ');

        console.log("📝 Legenda capturada:", subtitleText);

        // Traduz a legenda usando a função de tradução MyMemory
        const translatedText = await translateTextMyMemory(subtitleText);

        if (translatedText && translatedText !== "Erro na tradução") {
            console.log("🔄 Legenda traduzida:", translatedText);
            showPopup(translatedText); // Exibe o popup com a tradução
        } else {
            console.log("⚠️ Erro ao traduzir.");
        }
    } else {
        console.log("⚠️ Nenhuma legenda encontrada.");
    }
}

// Função para exibir o popup com a tradução
function showPopup(translatedText) {
    // Usa o contêiner em tela cheia se disponível
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

    // Usa o body como fallback
    const parent = fullscreenElement || document.body;

    // Tenta encontrar popup já existente dentro do parent
    let popup = parent.querySelector('#translationPopup');

    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'translationPopup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        popup.style.color = 'white';
        popup.style.fontSize = '16px';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        popup.style.zIndex = '2147483647';
        popup.style.pointerEvents = 'none';
        popup.style.display = 'block';
        parent.appendChild(popup);
    }

    popup.innerText = translatedText;
    popup.style.display = 'block';
}


// Função para esconder o popup
function hidePopup() {
    const popup = document.getElementById('translationPopup');
    if (popup) {
        popup.style.display = 'none'; // Esconde o popup
    }
}

// Verifica se o vídeo está em tela cheia
function isFullScreen() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
}

// Espera o vídeo carregar
function waitForVideo() {
    const video = document.querySelector('video');

    if (video) {
        console.log("🎥 Vídeo encontrado!");

        video.addEventListener('pause', () => {
            console.log("⏸️ Vídeo pausado!");
            captureSubtitle(); // Chama a função que captura e traduz a legenda
        });

        video.addEventListener('play', () => {
            console.log("▶️ Vídeo reproduzindo!");
            hidePopup(); // Esconde o popup quando o vídeo voltar a rodar
        });

        // Detecta quando entra em tela cheia
        document.addEventListener('fullscreenchange', () => {
            if (!isFullScreen()) {
                hidePopup(); // Esconde o popup quando sai da tela cheia
            }
        });
        
        // Detecta a entrada e saída de tela cheia
        video.addEventListener('webkitfullscreenchange', () => {
            if (!isFullScreen()) {
                hidePopup();
            }
        });
    } else {
        setTimeout(waitForVideo, 500); // Tenta novamente em 500ms caso o vídeo não seja encontrado
    }
}

// Começa a procurar o vídeo
waitForVideo();