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
        { nome: "Televisão", categoria: "SALA", status: "livre", imagem: "Imagens/Sala/Tv.jpg" },
        { nome: "Sofá (Verificar Medida)", categoria: "SALA", status: "livre", imagem: "Imagens/Sala/Sofa.jpg" },
        { nome: "Cortinas", categoria: "SALA", status: "livre", imagem: "Imagens/Sala/Cortina.jpg" },
        { nome: "Carpete/Tapete", categoria: "SALA", status: "livre", imagem: "Imagens/Sala/CarpeteSala.jpg" },
        { nome: "Almofadas Decorativas", categoria: "SALA", status: "livre", imagem: "Imagens/Sala/Almofadas.jpg" },
        { nome: "Manta para Sofá", categoria: "SALA", status: "livre", imagem: "Imagens/Sala/MantaSofa.jpg" },

        // --- QUARTO ---
        { nome: "Jogo de Cama", categoria: "QUARTO", status: "livre", imagem: "Imagens/Quarto/JogoCama.jpg" },
        { nome: "Guarda-Roupa (Medidas)", categoria: "QUARTO", status: "livre", imagem: "Imagens/Quarto/GuardaRoupa.jpg" },
        { nome: "Cobertor ou Manta", categoria: "QUARTO", status: "livre", imagem: "Imagens/Quarto/Cobertor.jpg" },
        { nome: "Ferro de Passar", categoria: "QUARTO", status: "livre", imagem: "Imagens/Quarto/Ferro.jpg" }, 

        // --- COZINHA ---
        { nome: "Microondas", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Microondas.jpg" },
        { nome: "Forno Elétrico", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/FornoEletrico.jpg" },
        { nome: "Processador de Alimentos", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Processador.jpg" },
        { nome: "Liquidificador", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Liquidificador.jpg" },
        { nome: "Jogo de Panelas", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Panelas.jpg" },
        { nome: "Tábuas de Corte", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Tabuas.jpg" },
        { nome: "Batedeira", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Batedeira.jpg" },
        { nome: "Jogo de Pratos", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Pratos.jpg" },
        { nome: "Kit de Facas", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Facas.jpg" },
        { nome: "Jogo de Copos", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/JogoCopos.jpg" },
        { nome: "Jogo de Taças", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/JogoTacas.jpg" },
        { nome: "Jogo de Talheres", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/JogoTalher.jpg" },
        { nome: "Potes Herméticos", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/PotesHermeticos.jpg" },
        { nome: "Escorredor de Louças", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Escorredor.jpg" },
        { nome: "Garrafa de Café", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/GarrafaCafe.jpg" },
        { nome: "Panos de Prato", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Panos.jpg" },
        { nome: "Kit Utensílios Silicone", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/KitUtensilios.jpg" },
        { nome: "Abridor de Garrafas", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Abridor.jpg" },
        { nome: "Ralador e Peneiras", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Ralador.jpg" },
        { nome: "Formas de Bolo", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Formas.jpg" },
        { nome: "Travessas de Vidro", categoria: "COZINHA", status: "livre", imagem: "Imagens/Cozinha/Travessas.jpg" },

        // --- BANHEIRO ---
        
        { nome: "Cesto de Roupa e Lixeira", categoria: "BANHEIRO", status: "livre", imagem: "Imagens/Banheiro/Cesto.jpg" },
        { nome: "Jogo de Tapetes", categoria: "BANHEIRO", status: "livre", imagem: "Imagens/Banheiro/Jogo de Tapetes.jpg" },
        { nome: "Kit Sobre a Pia", categoria: "BANHEIRO", status: "livre", imagem: "Imagens/Banheiro/Porta SaboneteEscova.jpg" },
        { nome: "Escova Sanitária", categoria: "BANHEIRO", status: "livre", imagem: "Imagens/Banheiro/EscovaSanitaria.jpg" },
        { nome: "Toalhas de Banho", categoria: "BANHEIRO", status: "livre", imagem: "Imagens/Banheiro/ToalhasBanho.jpg" },

        // --- ÁREA DE SERVIÇO ---
        { nome: "Vassoura, Rodo e Pá", categoria: "ÁREA SERV.", status: "livre", imagem: "Imagens/AreaServ/VassouraRodoPa.jpg" },
        { nome: "Baldes e Bacias", categoria: "ÁREA SERV.", status: "livre", imagem: "Imagens/AreaServ/BaldesBacias.jpg" },
        { nome: "Tanquinho", categoria: "ÁREA SERV.", status: "livre", imagem: "Imagens/AreaServ/Tanquinho.jpg" },
        { nome: "Tábua de Passar", categoria: "ÁREA SERV.", status: "livre", imagem: "Imagens/AreaServ/Tabua.jpg" }
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