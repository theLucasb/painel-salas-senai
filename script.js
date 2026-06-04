function obterDataLocal() {

    const agora = new Date();

    const ano = agora.getFullYear();

    const mes =
        String(agora.getMonth() + 1)
            .padStart(2, "0");

    const dia =
        String(agora.getDate())
            .padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

let dataAtualSistema =
    obterDataLocal();

function atualizarRelogio() {

    const agora = new Date();

    document.getElementById("horaAtual").textContent =
        agora.toLocaleTimeString("pt-BR");

    document.getElementById("dataAtual").textContent =
        agora
            .toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })
            .toUpperCase();

    const novaData =
        obterDataLocal();

    if (novaData !== dataAtualSistema) {

        console.log("Virada de dia detectada.");

        location.reload();
    }
}

async function carregarDados() {

    const agora = new Date();

    const horaAtual = agora.getHours();

/*     function estaNoHorarioDeAulas() {

        const hora =
            new Date().getHours();

        return hora >= 17 && hora < 22;
    }

    if (!estaNoHorarioDeAulas()) {

        mostrarModoInstitucional();

        return;
    } */

    try {

        const resposta = await fetch(
            `https://thelucasb.github.io/painel-salas-dados/dados.json?v=${Date.now()}`
        );

        const dados = await resposta.json();

        const hoje =
            obterDataLocal();

        const turmasHoje =
            dados.filter(
                item => item.data === hoje
            );

        document.getElementById("dataExibida")
            .innerHTML =
            `<strong>PROGRAMAÇÃO DE HOJE:</strong> ${new Date(hoje + "T12:00:00")
                .toLocaleDateString("pt-BR")}`;

        const total = turmasHoje.length;

        document.getElementById("contadorSalas")
            .textContent =
            total === 1
                ? "1 AMBIENTE OCUPADO"
                : `0${total} AMBIENTES OCUPADOS`;

        const ordemSalas = [
            "SALA 01",
            "SALA 02",
            "SALA 03",
            "SALA MÓVEL",
            "LAB. INFORMÁTICA",
            "LAB. AUTOMAÇÃO",
            "LAB. ELÉTRICA",
            "LAB. MECÂNICA"
        ];

        turmasHoje.sort((a, b) => {

            const posA =
                ordemSalas.indexOf(a.sala) === -1
                    ? 999
                    : ordemSalas.indexOf(a.sala);

            const posB =
                ordemSalas.indexOf(b.sala) === -1
                    ? 999
                    : ordemSalas.indexOf(b.sala);

            return posA - posB;
        });

        const container =
            document.getElementById("salasContainer");

        container.innerHTML = "";

        if (turmasHoje.length === 0) {

            container.innerHTML = `
                <div class="card sem-aulas">
                    <div class="sala">
                        SEM PROGRAMAÇÃO
                    </div>

                    <div class="turma">
                        Nenhuma aula programada para hoje.
                    </div>
                </div>
            `;

            document.getElementById("contadorSalas")
                .textContent =
                "0 ambientes ocupados";

            return;
        }

        turmasHoje.forEach(item => {

            container.innerHTML += `
                <div class="card">
                    <div class="sala">
                        ${item.sala}
                    </div>

                    <div class="turma">
                        ${item.turma.toUpperCase()}
                    </div>
                </div>
            `;
        });

        document.getElementById("ultimaAtualizacao")
            .innerText =
            `Atualizado às ${new Date()
                .toLocaleTimeString("pt-BR")}`;

    } catch (error) {

        console.error(error);

        document.getElementById("salasContainer")
            .innerHTML = `
                <div class="card">
                    <div class="turma">
                        Erro ao carregar dados.
                    </div>
                </div>
            `;
    }
}

function mostrarModoInstitucional() {

    document.getElementById("dataExibida")
        .innerHTML =
        "PAINEL INSTITUCIONAL";

    document.getElementById("contadorSalas")
        .innerHTML = "";

    document.getElementById("salasContainer")
        .innerHTML = `
            <div class="institucional">

                <img
                    src="img/Logo_Sistema_Fiep_Padrao_Azul_Fundo_Transparente.png"
                    class="logoInstitucional"
                >

                <h2>
                    Bem-vindo ao SENAI
                </h2>

                <p>
                    Educação profissional para transformar vidas.
                </p>

            </div>
        `;
}

atualizarRelogio();
carregarDados();

setInterval(
    atualizarRelogio,
    1000
);

setInterval(
    carregarDados,
    60000
);

setInterval(() => {

    location.reload();

}, 300000);