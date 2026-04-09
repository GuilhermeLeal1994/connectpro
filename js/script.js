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

function selecionarTipo(t, event) {
    tipo = t;

    document.querySelectorAll(".tipos button").forEach(btn => {
        btn.style.background = "#ddd";
        btn.style.color = "black";
    });

    if (event && event.target) {
        event.target.style.background = "#1e90ff";
        event.target.style.color = "white";
    }
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

async function enviarForm() {
    const nome = document.getElementById("nome")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value.trim();

    if (!email || !senha) {
        alert("Preencha os campos!");
        return false;
    }

    try {
        if (modo === "cadastro") {
            if (!nome) {
                alert("Preencha o nome!");
                return false;
            }

            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    tipo
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Erro ao cadastrar.");
                return false;
            }

            alert("Cadastro realizado com sucesso!");
            window.location.href = "login.html";
            return false;
        } else {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    senha,
                    tipo
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Erro ao fazer login.");
                return false;
            }

            localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));

            alert(`Bem-vindo ${data.usuario.nome}!`);
            window.location.href = "index.html";
            return false;
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar com servidor");
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

    if (!nome || !email || !msg || msg.length < 10) {
        alert("Preencha corretamente!");
        return false;
    }

    alert("Mensagem enviada com sucesso!");
    return true;
}

/* LOAD HEADER + FOOTER */

document.addEventListener("DOMContentLoaded", function () {

    const botoesTipo = document.querySelectorAll(".tipos button");
    if (botoesTipo.length > 0) {
        botoesTipo[0].style.background = "#1e90ff";
        botoesTipo[0].style.color = "white";
    }

    /* HEADER */
    fetch("header.html")
        .then(res => res.text())
        .then(data => {
            const header = document.getElementById("header");
            if (header) {
                header.innerHTML = data;

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
        })
        .catch(error => console.error("Erro ao carregar header:", error));

    /* FOOTER */
    fetch("footer.html")
        .then(res => res.text())
        .then(data => {
            const footer = document.getElementById("footer");
            if (footer) footer.innerHTML = data;
        })
        .catch(error => console.error("Erro ao carregar footer:", error));
});