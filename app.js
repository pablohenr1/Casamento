import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, onSnapshot } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- SUAS CONFIGURAÇÕES (Mantenha as suas aqui!) ---
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
const listaElement = document.getElementById('lista-presentes');
let itemSelecionadoId = null;

// VERIFICAÇÃO DE ADMINISTRADOR
// Se a URL for "index.html?admin=pablo", vira admin
const urlParams = new URLSearchParams(window.location.search);
const souAdmin = urlParams.get('admin') === 'pablo';

if (souAdmin) {
    document.querySelector('header p').innerHTML += ' <br><span style="background:yellow; color:black; padding:2px 5px">👑 MODO ADMINISTRADOR ATIVO</span>';
}

function carregarLista() {
    onSnapshot(collection(db, "presentes"), (snapshot) => {
        listaElement.innerHTML = ''; 

        snapshot.forEach((doc) => {
            const item = doc.data();
            const id = doc.id;
            const estaReservado = item.status === 'reservado';

            // Define a imagem (usa uma padrão se não tiver)
            const imagemUrl = item.imagem || 'https://via.placeholder.com/300x200?text=Presente';

            const card = document.createElement('div');
            card.className = `card ${estaReservado ? 'reservado' : ''}`;
            
            // HTML do Card com Imagem
            let botaoHtml = '';
            
            // Lógica do Botão vs Admin
            if (estaReservado) {
                if (souAdmin) {
                    // Admin vê quem deu
                    botaoHtml = `<div class="admin-info">🎁 Dado por: ${item.reservado_por}</div>`;
                } else {
                    // Visitante só vê que está indisponível
                    botaoHtml = `<button class="btn-presentear" disabled>Indisponível (Já comprado)</button>`;
                }
            } else {
                botaoHtml = `<button class="btn-presentear" onclick="abrirModal('${id}')">Presentear 🎁</button>`;
            }

            card.innerHTML = `
                <img src="${imagemUrl}" alt="${item.nome}" class="card-img">
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

// ... (MANTENHA AS FUNÇÕES abrirModal, btn-cancelar, btn-confirmar IGUAIS) ...
window.abrirModal = (id) => {
    itemSelecionadoId = id;
    document.getElementById('modal').classList.remove('hidden');
};
// ... etc ...

// --- SCRIPT ATUALIZADO COM IMAGENS ---
// Rode window.semearBanco() no console DEPOIS de limpar o banco antigo
window.semearBanco = async () => {
    // DICA: Para ficar bonito, substitua essas URLs por links de imagens reais (Google Imagens, Magalu, etc)
    // Ou baixe as imagens, coloque numa pasta "img" e use: imagem: "img/batedeira.jpg"
    
    const presentesReais = [
        { 
            nome: "Televisão", 
            categoria: "Sala", 
            status: "livre",
            imagem: "Imagens/Sala/Tv.jpg" 
        },
        { 
            nome: "Sofá", 
            categoria: "Sala", 
            status: "livre",
            imagem: "Imagens/Sala/Sofa.jpg" 
        },
        { 
            nome: "Jogo de Panelas", 
            categoria: "Cozinha", 
            status: "livre",
            imagem: "https://img.freepik.com/fotos-gratis/panelas-de-cozinha_144627-40455.jpg?size=626&ext=jpg"
        },
        { 
            nome: "Aspirador de Pó", 
            categoria: "Sala", 
            status: "livre",
            imagem: "https://img.freepik.com/fotos-premium/aspirador-de-po-domestico-moderno-em-fundo-branco_410516-2917.jpg?size=626&ext=jpg"
        },
        // Adicione os outros itens seguindo esse modelo...
    ];

    for (const item of presentesReais) {
        await addDoc(collection(db, "presentes"), item);
    }
    alert("Presentes com fotos cadastrados!");
};

carregarLista();