import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ------------------------------------------------------------------
// ⚠️ COLE SUA CONFIGURAÇÃO DO FIREBASE AQUI
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyClI9Lg4IXjHtwZetZxgKdv55sSF-jRSg8",
  authDomain: "casamento-kathleenpablo.firebaseapp.com",
  projectId: "casamento-kathleenpablo",
  storageBucket: "casamento-kathleenpablo.firebasestorage.app",
  messagingSenderId: "82624101006",
  appId: "1:82624101006:web:7a19f6917d697cbeeea7df",
  measurementId: "G-TNSD3ZBS2C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ... (Mantenha as variáveis globais e funções de Admin, carregarLista, filtrar e Modal iguais ao anterior) ...
const listaElement = document.getElementById('lista-presentes');
let itemSelecionadoId = null;
let categoriaAtual = 'todos'; 
const urlParams = new URLSearchParams(window.location.search);
const souAdmin = urlParams.get('admin') === 'pablo';

if (souAdmin) { document.querySelector('footer p').innerHTML += ' | 🔓 Modo Admin Ativo'; }

function carregarLista() {
    const q = query(collection(db, "presentes"), orderBy("nome"));
    onSnapshot(q, (snapshot) => {
        listaElement.innerHTML = ''; 
        if (snapshot.empty) { listaElement.innerHTML = '<div class="loading">Nenhum presente encontrado.</div>'; return; }

        snapshot.forEach((doc) => {
            const item = doc.data();
            const id = doc.id;
            const estaReservado = item.status === 'reservado';

            if (categoriaAtual !== 'todos' && !item.categoria.toLowerCase().includes(categoriaAtual.toLowerCase())) { return; }

            let botaoHtml = '';
            let classeReservado = estaReservado ? 'reservado' : '';

            if (estaReservado) {
                if (souAdmin) {
                    botaoHtml = `<div style="background:#fff3cd; color:#856404; padding:10px; font-size:0.8rem; margin-top:auto;">🎁 Dado por: <strong>${item.reservado_por}</strong></div>`;
                } else {
                    botaoHtml = `<button class="btn-presentear" disabled style="background-color:#ccc; cursor:default;">Já Escolhido ❤️</button>`;
                }
            } else {
                botaoHtml = `<button class="btn-presentear" onclick="abrirModal('${id}', '${item.nome}')">Presentear 🎁</button>`;
            }

            const card = document.createElement('div');
            card.className = `card ${classeReservado}`;
            // Adicionei um evento onerror para caso a imagem da internet falhe, carregar uma padrão
            card.innerHTML = `
                <img src="${item.imagem}" alt="${item.nome}" class="card-img" loading="lazy" onerror="this.src='https://placehold.co/600x400?text=Foto+Indisponível'">
                <div class="card-content">
                    <span class="tag">${item.categoria}</span>
                    <h3>${item.nome}</h3>
                    ${botaoHtml}
                </div>
            `;
            listaElement.appendChild(card);
        });
    });
}

// ... (Mantenha as funções filtrar e modal iguais) ...
window.filtrar = (categoria) => {
    categoriaAtual = categoria;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    carregarLista();
};

const modal = document.getElementById('modal');
const nomeItemModal = document.getElementById('nome-item-modal');
const inputNome = document.getElementById('nome-convidado');

window.abrirModal = (id, nomeItem) => {
    itemSelecionadoId = id;
    nomeItemModal.innerText = nomeItem; 
    modal.classList.remove('hidden');
    inputNome.focus();
};

document.getElementById('btn-cancelar').addEventListener('click', () => { modal.classList.add('hidden'); itemSelecionadoId = null; });

document.getElementById('btn-confirmar').addEventListener('click', async () => {
    const nome = inputNome.value.trim();
    if (!nome) { alert("Por favor, digite seu nome!"); return; }
    
    const btnConfirmar = document.getElementById('btn-confirmar');
    btnConfirmar.innerText = "Salvando...";
    btnConfirmar.disabled = true;

    try {
        await updateDoc(doc(db, "presentes", itemSelecionadoId), {
            status: 'reservado',
            reservado_por: nome,
            data_reserva: new Date().toISOString()
        });
        alert("Obrigado! Sua reserva foi confirmada.");
        modal.classList.add('hidden');
        inputNome.value = ''; 
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao reservar.");
    } finally {
        btnConfirmar.innerText = "CONFIRMAR RESERVA";
        btnConfirmar.disabled = false;
    }
});


// --- SCRIPT ATUALIZADO COM FOTOS REAIS (Unsplash/LoremFlickr) ---
window.semearBanco = async () => {
    if (!confirm("Isso vai apagar a lista atual e cadastrar tudo de novo. Confirma?")) return;

    // Usei palavras-chave em inglês nas URLs para garantir que a busca ache fotos boas
    const listaComFotos = [
        // --- SALA ---
        { nome: "Televisão", categoria: "SALA", status: "livre", imagem: "https://images.unsplash.com/photo-1593784653277-947194300e5c?w=600&q=80" },
        { nome: "Sofá (Verificar Medida)", categoria: "SALA", status: "livre", imagem: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
        { nome: "Cortinas", categoria: "SALA", status: "livre", imagem: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80" },
        { nome: "Carpete/Tapete", categoria: "SALA", status: "livre", imagem: "https://images.unsplash.com/photo-1534349762913-961f7776530f?w=600&q=80" },
        { nome: "Almofadas Decorativas", categoria: "SALA", status: "livre", imagem: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80" },
        { nome: "Manta para Sofá", categoria: "SALA", status: "livre", imagem: "https://images.unsplash.com/photo-1580301762395-98074900c3b8?w=600&q=80" },

        // --- QUARTO ---
        { nome: "Jogo de Cama", categoria: "QUARTO", status: "livre", imagem: "https://images.unsplash.com/photo-1522771753018-be8071e563d4?w=600&q=80" },
        { nome: "Guarda-Roupa (Medidas)", categoria: "QUARTO", status: "livre", imagem: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=80" },
        { nome: "Cobertor ou Manta", categoria: "QUARTO", status: "livre", imagem: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&q=80" },
        { nome: "Ferro de Passar", categoria: "QUARTO", status: "livre", imagem: "https://images.unsplash.com/photo-1530962386762-11110b642e12?w=600&q=80" }, // Foto ilustrativa de lavanderia

        // --- COZINHA ---
        { nome: "Microondas", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1585659722983-3a675bad5c91?w=600&q=80" },
        { nome: "Forno Elétrico", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=600&q=80" },
        { nome: "Processador de Alimentos", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1585241772183-5034873752d5?w=600&q=80" },
        { nome: "Liquidificador", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1570222094114-28a9d8896aca?w=600&q=80" },
        { nome: "Jogo de Panelas", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1584990347449-a0846b1e00ae?w=600&q=80" },
        { nome: "Tábuas de Corte", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1534939561126-855f866540b9?w=600&q=80" },
        { nome: "Batedeira", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1574360773950-70685600b5bb?w=600&q=80" },
        { nome: "Jogo de Pratos", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1603195861986-8c057936171d?w=600&q=80" },
        { nome: "Kit de Facas", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&q=80" },
        { nome: "Jogo de Copos", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1575486745585-17793d56d953?w=600&q=80" },
        { nome: "Jogo de Taças", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1586548902888-29239fb8c1f0?w=600&q=80" },
        { nome: "Jogo de Talheres", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1586414777322-921c172d80d2?w=600&q=80" },
        { nome: "Potes Herméticos", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1512356181113-853a59d79782?w=600&q=80" },
        { nome: "Escorredor de Louças", categoria: "COZINHA", status: "livre", imagem: "https://plus.unsplash.com/premium_photo-1663126298656-33616be83c32?w=600&q=80" },
        { nome: "Garrafa de Café", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1543351520-2c7009419266?w=600&q=80" },
        { nome: "Panos de Prato", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1583329065609-b68dfa44138e?w=600&q=80" },
        { nome: "Kit Utensílios Silicone", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1590412354784-5f532a818c32?w=600&q=80" },
        { nome: "Abridor de Garrafas", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1616429392264-8848148b60b7?w=600&q=80" },
        { nome: "Ralador e Peneiras", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1590589321528-971936384a63?w=600&q=80" },
        { nome: "Formas de Bolo", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1590589321528-971936384a63?w=600&q=80" },
        { nome: "Travessas de Vidro", categoria: "COZINHA", status: "livre", imagem: "https://images.unsplash.com/photo-1579586177112-9c3d42bc2245?w=600&q=80" },

        // --- BANHEIRO ---
        { nome: "Toalhas de Rosto/Banho", categoria: "BANHEIRO", status: "livre", imagem: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&q=80" },
        { nome: "Cesto de Roupa e Lixeira", categoria: "BANHEIRO", status: "livre", imagem: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80" },
        { nome: "Jogo de Tapetes", categoria: "BANHEIRO", status: "livre", imagem: "https://images.unsplash.com/photo-1576426863848-c21f5fc67255?w=600&q=80" },
        { nome: "Kit Sobre a Pia", categoria: "BANHEIRO", status: "livre", imagem: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&q=80" },
        { nome: "Escova Sanitária", categoria: "BANHEIRO", status: "livre", imagem: "https://images.unsplash.com/photo-1585676766348-73546765275e?w=600&q=80" },

        // --- ÁREA DE SERVIÇO ---
        { nome: "Vassoura, Rodo e Pá", categoria: "ÁREA SERV.", status: "livre", imagem: "https://images.unsplash.com/photo-1527515673510-955a6d57a4fb?w=600&q=80" },
        { nome: "Baldes e Bacias", categoria: "ÁREA SERV.", status: "livre", imagem: "https://images.unsplash.com/photo-1516945719310-b9745d064d78?w=600&q=80" },
        { nome: "Tanquinho", categoria: "ÁREA SERV.", status: "livre", imagem: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&q=80" },
        { nome: "Tábua de Passar", categoria: "ÁREA SERV.", status: "livre", imagem: "https://images.unsplash.com/photo-1481559419139-49dd1914eb9a?w=600&q=80" }
    ];

    let contador = 0;
    // Cadastra um por um
    for (const item of listaComFotos) {
        await addDoc(collection(db, "presentes"), item);
        contador++;
        console.log(`Enviado: ${item.nome}`);
    }
    alert(`Sucesso! ${contador} itens com FOTOS REAIS foram cadastrados. Recarregue a página.`);
};

carregarLista();