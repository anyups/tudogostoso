import { openDB } from "idb";

let db;

async function createDB() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('receitas', {
                            keyPath: 'nome'
                        });
                        store.createIndex('id', 'id');
                        showResult("Banco de dados criado!");
                }
            }
        });
        showResult("Banco de dados aberto.");
    } catch (e) {
        showResult("Erro ao criar o banco de dados: " + e.message)
    }
}

window.addEventListener("DOMContentLoaded", async event => {
    createDB();
    document.getElementById("input").addEventListener("input", getData);
    document.getElementById("btnSalvar").addEventListener("click", addData);
    document.getElementById("btnListar").addEventListener("click", getData);
});

async function getData() {
    if (db == undefined) {
        showResult("O banco de dados está fechado");
        return;
    }

    const tx = await db.transaction('receitas', 'readonly')
    const store = tx.objectStore('receitas');
    const value = await store.getAll();
    if (value) {
        showResult("Dados do banco: " + JSON.stringify(value))
    } else {
        showResult("Não há nenhum dado no banco!")
    }
}


async function addData() {
    const tx = await db.transaction('receitas', 'readwrite');
    const store = tx.objectStore('receitas');
    store.add({ nome: getElementById("nome"),
                autor: getElementById("nomeDono"),
                receita: getElementById("receita")});
    await tx.done;
    return limpar;
}
function limpar(){
    getElementById("nome") = '',
    getElementById("nomeDono") = '',
    getElementById("receita") = ''
}


function showResult(text) {
    document.querySelector(addData5).innerHTML = text;
}