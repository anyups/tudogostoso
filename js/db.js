import { openDB } from "idb";

let db;
async function criarDB(){
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction){
                switch  (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('receitas', {
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
    criarDB();
    document.getElementById('btnSalvar').addEventListener('click', addReceita);
});

async function addReceita() {
    let nome = document.getElementById("nome").value;
    let nomeDono = document.getElementById("nomeDono").value;
    let receita = document.getElementById("receita").value;
    const tx = await db.transaction('receitas', 'readwrite')
    const store = tx.objectStore('receitas');
    try {
        await store.add({ nome: nome, nomeDono: nomeDono, receita: receita });
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
    document.getElementById("nomeDono").value = '';
    document.getElementById("receita").value = '';
}

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("entrada");
    const titulo = document.getElementById("title");
    const categ = document.getElementById("categoria");
    const date = document.getElementById("data");
    const desc = document.getElementById("description");
    const listar = document.getElementById("resultados");
  
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const title = titulo.value;
        const categoria = categ.value;
        const data = date.value;
        const description = desc.value;

  
        if (title.trim() === "" || description.trim() === "" || categoria.trim() === "" || data.trim() === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }
  
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="note">
            <hr color="LightSteelBlue"></hr>
            <span>${title}:</span> 
            ${categoria} <br/>
            ${data} <br/>
            ${description}
            </div>
            <button class="excluir">excluir</button>
        `;
  
        listar.appendChild(li);
  
        titulo.value = "";
        desc.value = "";
  
        li.querySelector(".excluir").addEventListener("click", () => {
            listar.removeChild(li);
        });
    });
  });