// 📍 Altere aqui o idioma destino da tradução (ex: 'pt', 'es', 'fr', etc.)
const targetLang = 'pt'; 

// ✅ Detecta a plataforma atual
function getCurrentPlatform() {
    const hostname = window.location.hostname;
    if (hostname.includes('play.max.com')) return 'hbomax';
    if (hostname.includes('netflix.com')) return 'netflix';
    return 'unknown';
}

// ✅ Captura os elementos de legenda com base na plataforma
function getSubtitleElements() {
    const platform = getCurrentPlatform();

    if (platform === 'hbomax') {
        return document.querySelectorAll('.TextCue-Fuse-Web-Play__sc-1wvp621-4');
    }

    if (platform === 'netflix') {
        // 📍 Este é o seletor para as legendas da Netflix
        return document.querySelectorAll('.player-timedtext-text-container span span');
    }

    return [];
}

// ✅ Tradução dinâmica com idioma alvo configurável
async function translateTextMyMemory(text, langTo = 'pt') {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt|${langTo}`;

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
            return "Erro na tradução";
        }
    } catch (error) {
        console.error("❌ Erro ao tentar traduzir com MyMemory:", error);
        return "Erro na tradução";
    }
}

// ✅ Captura e traduz legenda atual
async function captureSubtitle() {
    const subtitleElements = getSubtitleElements();

    if (subtitleElements.length > 0) {
        const subtitleText = Array.from(subtitleElements)
            .map(el => el.innerText.trim())
            .join(' ');

        console.log("📝 Legenda capturada:", subtitleText);

        const translatedText = await translateTextMyMemory(subtitleText, targetLang);

        if (translatedText && translatedText !== "Erro na tradução") {
            console.log("🔄 Legenda traduzida:", translatedText);
            showPopup(translatedText);
        } else {
            console.log("⚠️ Erro ao traduzir.");
        }
    } else {
        console.log("⚠️ Nenhuma legenda encontrada.");
    }
}

// ✅ Exibe o popup com a tradução
function showPopup(translatedText) {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    const parent = fullscreenElement || document.body;

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

// ✅ Esconde o popup
function hidePopup() {
    const popup = document.getElementById('translationPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// ✅ Verifica se está em tela cheia
function isFullScreen() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
}

// ✅ Espera o vídeo carregar e escuta os eventos
function waitForVideo() {
    const video = document.querySelector('video');

    if (video) {
        console.log("🎥 Vídeo encontrado!");

        video.addEventListener('pause', () => {
            console.log("⏸️ Vídeo pausado!");
            captureSubtitle();
        });

        video.addEventListener('play', () => {
            console.log("▶️ Vídeo reproduzindo!");
            hidePopup();
        });

        document.addEventListener('fullscreenchange', () => {
            if (!isFullScreen()) hidePopup();
        });

        video.addEventListener('webkitfullscreenchange', () => {
            if (!isFullScreen()) hidePopup();
        });
    } else {
        setTimeout(waitForVideo, 500);
    }
}

// ✅ Inicia o processo
waitForVideo();
