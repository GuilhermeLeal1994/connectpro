/* MENU LOGIN */

function toggleMenu() {
    const menu = document.getElementById("menuLogin");
    if (!menu) return;

    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

/* Fecha ao clicar fora */
window.addEventListener("click", function (event) {
    const menu = document.getElementById("menuLogin");

    if (menu && !event.target.closest(".login-dropdown")) {
        menu.style.display = "none";
    }
});

/* LISTA DE PROFISSIONAIS */

const profissionais = [
    { nome: "Guilherme", tipo: "Personal" },
    { nome: "Matheus", tipo: "Medicina" },
    { nome: "João", tipo: "Anestesia" },
    { nome: "Eduardo", tipo: "Farmacia" },
    { nome: "Maryele", tipo: "Psicologo" },
    { nome: "Ana Luiza", tipo: "Fisioterapia" },
    { nome: "Rebeca", tipo: "Nutricionista" },




];

/* FILTRO (MATCHING) */

function filtrar(tipo) {
    const filtrados = profissionais.filter(p => p.tipo === tipo);
    renderResultados(filtrados);
}

/* BUSCA */

function buscar() {
    const input = document.getElementById("busca");
    if (!input) return;

    const termo = input.value.toLowerCase();

    const filtrados = profissionais.filter(p =>
        p.tipo.toLowerCase().includes(termo)
    );

    renderResultados(filtrados);
}

/* RENDER PADRÃO */

function renderResultados(lista) {
    const resultado = document.getElementById("resultados");
    if (!resultado) return;

    resultado.innerHTML = "";

    if (lista.length === 0) {
        resultado.innerHTML = "<p>Nenhum profissional encontrado.</p>";
        return;
    }

    lista.forEach(p => {
        resultado.innerHTML += `
        <div class="card">
            <h3>${p.nome}</h3>
            <p>${p.tipo}</p>
            <button onclick="favoritar('${p.nome}')">❤️ Favoritar</button>
        </div>`;
    });
}

/* FAVORITAR */

function favoritar(nome) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (!favoritos.includes(nome)) {
        favoritos.push(nome);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        alert("Adicionado aos favoritos!");
    } else {
        alert("Já está nos favoritos!");
    }
}

/* LOGIN / CADASTRO */

let tipo = "cliente";
let modo = "login";

function selecionarTipo(t) {
    tipo = t;

    // feedback visual (opcional)
    document.querySelectorAll(".tipos button").forEach(btn => {
        btn.style.background = "#ddd";
    });

    event.target.style.background = "#1e90ff";
    event.target.style.color = "white";
}

function alternarModo() {
    const nomeInput = document.getElementById("nome");
    const titulo = document.getElementById("titulo");
    const botao = document.querySelector("form button");

    if (!nomeInput || !titulo || !botao) return;

    if (modo === "login") {
        modo = "cadastro";
        nomeInput.style.display = "block";
        titulo.innerText = "Cadastro";
        botao.innerText = "Cadastrar";
    } else {
        modo = "login";
        nomeInput.style.display = "none";
        titulo.innerText = "Login";
        botao.innerText = "Entrar";
    }
}

function enviarForm() {
    const nome = document.getElementById("nome")?.value || "";
    const email = document.getElementById("email")?.value;
    const senha = document.getElementById("senha")?.value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (!email || !senha) {
        alert("Preencha os campos!");
        return false;
    }

    /* CADASTRO */
    if (modo === "cadastro") {

        if (nome === "") {
            alert("Digite seu nome!");
            return false;
        }

        const existe = usuarios.find(u => u.email === email);

        if (existe) {
            alert("Usuário já existe!");
            return false;
        }

        usuarios.push({ nome, email, senha, tipo });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        alert("Cadastro realizado com sucesso!");
        return false;

    /* LOGIN */
    } else {

        const usuario = usuarios.find(u =>
            u.email === email &&
            u.senha === senha &&
            u.tipo === tipo
        );

        if (!usuario) {
            alert("Login inválido!");
            return false;
        }

        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        alert(`Bem-vindo ${usuario.nome}!`);

        window.location.href = "index.html"; // 🔥 REDIRECIONA

        return false;
    }
}

/* LOGOUT */
function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

/* CONTATO */

function validarForm() {
    const nome = document.getElementById("nome")?.value;
    const email = document.getElementById("email")?.value;
    const msg = document.getElementById("mensagem")?.value;

    if (!nome || !email || msg.length < 10) {
        alert("Preencha corretamente!");
        return false;
    }

    alert("Mensagem enviada com sucesso!");
    return true;
}

/* LOAD HEADER + FOOTER */

document.addEventListener("DOMContentLoaded", function () {

    /* HEADER */
    fetch("header.html")
        .then(res => res.text())
        .then(data => {
            const header = document.getElementById("header");
            if (header) {
                header.innerHTML = data;

                // Atualiza usuário logado
                const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

                if (usuario) {
                    const nomeHeader = document.getElementById("nomeHeader");
                    const menuLogado = document.getElementById("menuLogado");
                    const menuDeslogado = document.getElementById("menuDeslogado");

                    if (nomeHeader) nomeHeader.innerText = usuario.nome;
                    if (menuLogado) menuLogado.style.display = "block";
                    if (menuDeslogado) menuDeslogado.style.display = "none";
                }
            }
        });

    /* FOOTER */
    fetch("footer.html")
        .then(res => res.text())
        .then(data => {
            const footer = document.getElementById("footer");
            if (footer) footer.innerHTML = data;
        });

});