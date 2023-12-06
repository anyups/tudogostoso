import { openDB } from "idb";


//registrando a service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        let reg;
        reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
  
        console.log('Service worker registrada! 😎', reg);
      } catch (err) {
        console.log('😥 Service worker registro falhou: ', err);
      }
    });
  }
  
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
});

async function novaReceita(foto) {
    let nome = document.getElementById("nome").value;
    let nomeDono = document.getElementById("nomeDono").value;
    let descricao = document.getElementById("descricao").value;
    const tx = await db.transaction('receita', 'readwrite')
    const store = tx.objectStore('receita');
    try {
        await store.add({ nome: nome, descricao: descricao, nomeDono: nomeDono, foto: foto });
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
            <div class="receita">
            <span>${name}</span> <br/>
            receita por: ${nomeDono} <br/>
            ${description}
            </div>
            <button class="excluir">excluir</button>
        `;
  
        listar.appendChild(li);
  
        nome.value = "";
        dono.value = "";
        desc.value = "";
  
        li.querySelector(".excluir").addEventListener("click", () => {
            listar.removeChild(li);
        });
    });
  });


  // configurando as constraintes do video stream
var constraints = { video: { facingMode: "user" }, audio: false };
// capturando os elementos em tela
const cameraView = document.querySelector("#camera--view"),
  cameraOutput = document.querySelector("#camera--output"),
  cameraSensor = document.querySelector("#camera--sensor"),
  cameraTrigger = document.querySelector("#camera--trigger")

//Estabelecendo o acesso a camera e inicializando a visualização
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      let track = stream.getTracks[0]
      cameraView.srcObject = stream;
    })
    .catch(function (error) {
      console.error("Ocorreu um Erro.", error);
    });
}

// Função para tirar foto
cameraTrigger.onclick = function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutput.classList.add("taken");
};

// carrega imagem de camera quando a janela carregar
window.addEventListener("load", cameraStart, false);

  