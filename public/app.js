const apiURL = 'http://localhost:3000/destinos';

// Função para exibir mensagens
function displayMessage(mensagem) {
    const msg = document.getElementById('msg');
    if(msg) msg.innerHTML = '<div class="alert alert-warning my-2">' + mensagem + '</div>';
}

// ===================== GET / READ =====================
function iniciarCards(){
    const container = document.getElementById('cards-container');
    fetch(apiURL)
      .then(res => res.json())
      .then(destinos => {
        container.innerHTML = "";
        destinos.forEach(destino => {
            container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${destino.imagem}" class="card-img-top" alt="${destino.titulo}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${destino.titulo}</h5>
                        <p><strong>Local:</strong> ${destino.local}</p>
                        <p><strong>Preço:</strong> R$ ${destino.preco}</p>
                        <div class="mt-auto d-flex justify-content-between">
                            <button class="btn btn-warning btn-sm" onclick="editarDestino(${destino.id})">Editar destino</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteDestinos(${destino.id}, iniciarCards)">Excluir</button>
                        </div>
                    </div>
                </div>
            </div>`;
        });
      })
      .catch(err => {
        console.error(err);
        displayMessage("Erro ao carregar destinos");
      });
}

function iniciarCarrossel(){
    const carouselIndicators = document.querySelector('.carousel-indicators');
    const carouselInner = document.querySelector('.carousel-inner');
    fetch(apiURL)
      .then(res => res.json())
      .then(dados => {
        carouselIndicators.innerHTML = "";
        carouselInner.innerHTML = "";
        dados.forEach((destino, index) => {
            // Indicadores
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target','#carouselExampleControls');
            indicator.setAttribute('data-bs-slide-to', index);
            if(index===0) indicator.classList.add('active');
            carouselIndicators.appendChild(indicator);
            
            // Slides
            const slide = document.createElement('div');
            slide.className = `carousel-item ${index===0 ? 'active':''}`;
            slide.innerHTML = `
                <img src="${destino.imagem}" class="d-block w-100" alt="${destino.titulo}">
                <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
                    <h5>${destino.titulo}</h5>
                    <p>${destino.descricao}</p>
                </div>`;
            carouselInner.appendChild(slide);
        });
      });
}

// ===================== POST / CREATE =====================
function cadastrarDestino(event){
    event.preventDefault();

    const destino = {
        titulo: document.getElementById('titulo').value,
        local: document.getElementById('local').value,
        imagem: document.getElementById('imagem').value,
        preco: parseFloat(document.getElementById('preco').value),
        distancia: document.getElementById('distancia').value,
        nota: parseFloat(document.getElementById('nota').value),
        estrelas: parseInt(document.getElementById('estrelas').value),
        wifi: document.getElementById('wifi').value === 'true',
        voo: document.getElementById('voo').value,
        hospedagem: document.getElementById('hospedagem').value,
        descricao: document.getElementById('descricao').value
    };

    fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(destino)
    })
    .then(res => res.json())
    .then(() => {
        displayMessage("Destino cadastrado com sucesso!");
        document.getElementById('formCadastrar').reset();
        iniciarCards();
        iniciarCarrossel();
    })
    .catch(err => {
        console.error(err);
        displayMessage("Erro ao cadastrar destino");
    });
}

// ===================== DELETE =====================
function deleteDestinos(id, refreshFunction){
    if(!confirm("Deseja realmente excluir este destino?")) return;

    fetch(`${apiURL}/${id}`, { method:'DELETE' })
    .then(() => {
        displayMessage("Destino removido com sucesso");
        refreshFunction && refreshFunction();
    })
    .catch(err => {
        console.error(err);
        displayMessage("Erro ao remover destino");
    });
}

// ===================== PUT / UPDATE =====================
function editarDestino(id){
    window.location.href = "editar.html?id=" + id;
}

function carregarDestinoParaEdicao(){
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if(!id) return;

    fetch(`${apiURL}/${id}`)
    .then(res => res.json())
    .then(destino => {
        document.getElementById("id").value = destino.id;
        document.getElementById("titulo").value = destino.titulo;
        document.getElementById("local").value = destino.local;
        document.getElementById("imagem").value = destino.imagem;
        document.getElementById("preco").value = destino.preco;
        document.getElementById("distancia").value = destino.distancia;
        document.getElementById("nota").value = destino.nota;
        document.getElementById("estrelas").value = destino.estrelas;
        document.getElementById("wifi").value = destino.wifi;
        document.getElementById("voo").value = destino.voo;
        document.getElementById("hospedagem").value = destino.hospedagem;
        document.getElementById("descricao").value = destino.descricao;
    });
}

function salvarEdicao(event){
    event.preventDefault();
    const id = document.getElementById("id").value;

    const destinoAtualizado = {
        titulo: document.getElementById("titulo").value,
        local: document.getElementById("local").value,
        imagem: document.getElementById("imagem").value,
        preco: parseFloat(document.getElementById("preco").value),
        distancia: document.getElementById("distancia").value,
        nota: parseFloat(document.getElementById("nota").value),
        estrelas: parseInt(document.getElementById("estrelas").value),
        wifi: document.getElementById("wifi").value === 'true',
        voo: document.getElementById("voo").value,
        hospedagem: document.getElementById("hospedagem").value,
        descricao: document.getElementById("descricao").value
    };

    fetch(`${apiURL}/${id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(destinoAtualizado)
    })
    .then(res => res.json())
    .then(() => {
        alert("Destino atualizado com sucesso!");
        window.location.href = "index.html";
    })
    .catch(err => {
        console.error(err);
        displayMessage("Erro ao atualizar destino");
    });
}

// ===================== Inicialização =====================
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('cards-container')){
        iniciarCards();
        iniciarCarrossel();
    }

    if(document.getElementById('formCadastrar')){
        document.getElementById('formCadastrar').addEventListener('submit', cadastrarDestino);
    }

    if(document.getElementById('formEditar')){
        carregarDestinoParaEdicao();
        document.getElementById('formEditar').addEventListener('submit', salvarEdicao);
    }
});




