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
// --- SCRIPT PARA POPULAR O BANCO (LISTA ATUALIZADA DO CSV) ---
window.semearBanco = async () => {
    // Lista baseada no seu arquivo "Lista de Casamento.xlsx - Planilha2.csv"
    const listaAtualizada = [
        // --- SALA ---
        {
            nome: "Televisão",
            categoria: "SALA",
            status: "livre",
            imagem: "Imagens/Sala/Tv.jpg"
        },
        {
            nome: "Sofá (Entre em Contato para confirmar as medidas!)", // Dica: Edite este nome no Firebase depois se quiser tirar o parenteses
            categoria: "SALA",
            status: "livre",
            imagem: "Imagens/Sala/Sofa.jpg"
        },
        {
            nome: "Cortinas",
            categoria: "SALA",
            status: "livre",
            imagem: "Imagens/Sala/Cortina.jpg"
        },
        {
            nome: "Carpete",
            categoria: "SALA",
            status: "livre",
            imagem: "Imagens/Sala/CarpeteSala.jpg"
        },
        {
            nome: "Almofadas Decorativas",
            categoria: "SALA",
            status: "livre",
            imagem: "Imagens/Sala/Almofadas.jpg"
        },
        {
            nome: "Manta para Sofá",
            categoria: "SALA",
            status: "livre",
            imagem: "Imagens/Sala/MantaSofa.jpg"
        },

        // --- QUARTO ---
        {
            nome: "Jogo de Cama",
            categoria: "QUARTO",
            status: "livre",
            imagem: "Imagens/Quarto/JogoCama.jpg"
        },
        {
            nome: "Guarda-Roupa",
            categoria: "QUARTO",
            status: "livre",
            imagem: "Imagens/Quarto/GuardaRoupa.jpg"
        },
        {
            nome: "Cobertor ou Manta",
            categoria: "QUARTO",
            status: "livre",
            imagem: "Imagens/Quarto/Cobertor.jpg"
        },
        {
            nome: "Ferro de Passar",
            categoria: "QUARTO",
            status: "livre",
            imagem: "Imagens/Quarto/Ferro.jpg"
        },

        // --- COZINHA ---
        {
            nome: "Microondas",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Microondas"
        },
        {
            nome: "Forno Elétrico",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Forno"
        },
        {
            nome: "Processador de Alimentos",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Processador"
        },
        {
            nome: "Liquidificador",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Liquidificador"
        },
        {
            nome: "Jogo de Panelas Completo",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Jogo+de+Panelas"
        },
        {
            nome: "Tábuas de Corte",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Tábuas"
        },
        {
            nome: "Batedeira",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Batedeira"
        },
        {
            nome: "Jogo de Pratos",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Jogo+de+Pratos"
        },
        {
            nome: "Kit de Facas Completo",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Facas"
        },
        {
            nome: "Jogo de Copos",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Copos"
        },
        {
            nome: "Jogo de Taças",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Taças"
        },
        {
            nome: "Jogo de Talheres",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Talheres"
        },
        {
            nome: "Potes Herméticos",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Potes"
        },
        {
            nome: "Escorredor de Louças",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Escorredor"
        },
        {
            nome: "Garrafa de Café",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Garrafa+Café"
        },
        {
            nome: "Panos de Prato e Luva",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Panos+e+Luva"
        },
        {
            nome: "Kit Utensílios (Silicone)",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Utensílios"
        },
        {
            nome: "Abridor de Latas/Garrafas",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Abridor"
        },
        {
            nome: "Ralador e Peneiras",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Ralador"
        },
        {
            nome: "Formas de Bolo",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Formas"
        },
        {
            nome: "Travessas de Vidro",
            categoria: "COZINHA",
            status: "livre",
            imagem: "https://placehold.co/600x400/218838/FFF?text=Travessas"
        },

        // --- BANHEIRO ---
        {
            nome: "Toalhas de Rosto",
            categoria: "BANHEIRO",
            status: "livre",
            imagem: "https://placehold.co/600x400/007bff/FFF?text=Toalhas+Rosto"
        },
        {
            nome: "Toalhas de Banho",
            categoria: "BANHEIRO",
            status: "livre",
            imagem: "https://placehold.co/600x400/007bff/FFF?text=Toalhas+Banho"
        },
        {
            nome: "Cesto de Roupa e Lixeira",
            categoria: "BANHEIRO",
            status: "livre",
            imagem: "https://placehold.co/600x400/007bff/FFF?text=Cesto+e+Lixeira"
        },
        {
            nome: "Jogo de Tapetes (Box/Pia)",
            categoria: "BANHEIRO",
            status: "livre",
            imagem: "https://placehold.co/600x400/007bff/FFF?text=Tapetes"
        },
        {
            nome: "Kit Sobre a Pia",
            categoria: "BANHEIRO",
            status: "livre",
            imagem: "https://placehold.co/600x400/007bff/FFF?text=Kit+Pia"
        },
        {
            nome: "Escova Sanitária",
            categoria: "BANHEIRO",
            status: "livre",
            imagem: "https://placehold.co/600x400/007bff/FFF?text=Escova"
        },

        // --- ÁREA DE SERVIÇO ---
        {
            nome: "Vassoura, Rodo e Pá",
            categoria: "ÁREA SERV.",
            status: "livre",
            imagem: "https://placehold.co/600x400/6c757d/FFF?text=Limpeza"
        },
        {
            nome: "Baldes e Bacias",
            categoria: "ÁREA SERV.",
            status: "livre",
            imagem: "https://placehold.co/600x400/6c757d/FFF?text=Baldes"
        },
        {
            nome: "Tanquinho",
            categoria: "ÁREA SERV.",
            status: "livre",
            imagem: "https://placehold.co/600x400/6c757d/FFF?text=Tanquinho"
        },
        {
            nome: "Tábua de Passar",
            categoria: "ÁREA SERV.",
            status: "livre",
            imagem: "https://placehold.co/600x400/6c757d/FFF?text=Tábua+Passar"
        }
    ];

    let contador = 0;
    for (const item of listaAtualizada) {
        await addDoc(collection(db, "presentes"), item);
        contador++;
        console.log(`Enviado: ${item.nome}`);
    }
    
    alert(`Sucesso! ${contador} itens da planilha foram cadastrados.`);
};

carregarLista();