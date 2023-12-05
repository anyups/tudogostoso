import { openDB } from "idb";

let db;
async function bancoDB(){
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction){
                switch  (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('receita', {
                            keyPath: 'nome'
                        });
                        store.createIndex('id', 'id');
                        console.log("banco de dados criado!");
                }
            }
        });
        console.log("banco de dados aberto!");
    }catch (e) {
        console.log('Erro ao criar/abrir banco: ' + e.message);
    }
}

window.addEventListener('DOMContentLoaded', async event =>{
    bancoDB();
    document.getElementById('cadastrar').addEventListener('click', novaReceita);
});

async function novaReceita() {
    let nome = document.getElementById("nome").value;
    let nomeDono = document.getElementById("nomeDono").value;
    let descricao = document.getElementById("descricao").value;
    const tx = await db.transaction('receita', 'readwrite')
    const store = tx.objectStore('receita');
    try {
        await store.add({ nome: nome, descricao: descricao, nomeDono: nomeDono });
        await tx.done;
        limparCampos();
        console.log('Receita adicionada com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar receita:', error);
        tx.abort();
    }
}

function limparCampos() {
    document.getElementById("nome").value = '';
    document.getElementById("descricao").value = '';
    document.getElementById("nomeDono").value = '';
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cadastro");
    const nome = document.getElementById("name");
    const dono = document.getElementById("nomeDono");
    const desc = document.getElementById("description");
    const listar = document.getElementById("cadastros");
  
    form.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const name = nome.value;
        const nomeDono = dono.value;
        const description = desc.value;

  
        if (name.trim() === "" || description.trim() === "" || nomeDono.trim() === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }
  
        const li = document.createElement("li");
        li.innerHTML = `
        <hr color="orange"></hr>
            <div class="receita">
            <span>${name}</span> <br/>
            receita por: ${nomeDono} <br/>
            ${description}
            </div>
            <button class="excluir">excluir</button>
        `;
  
        listar.appendChild(li);
  
        nome.value = "";
        desc.value = "";
  
        li.querySelector(".excluir").addEventListener("click", () => {
            listar.removeChild(li);
        });
    });
  });