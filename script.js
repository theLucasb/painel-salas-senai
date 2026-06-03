function atualizarRelogio() {

    const agora = new Date();

    document.getElementById("horaAtual").textContent =
        agora.toLocaleTimeString("pt-BR");

    document.getElementById("dataAtual").textContent =
        agora.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
}

async function carregarDados() {

    try {

        const resposta = await fetch(
            `https://thelucasb.github.io/painel-salas-dados/dados.json?v=${Date.now()}`
        );

        const dados = await resposta.json();

        const hoje = new Date()
            .toISOString()
            .split("T")[0];

        let turmasHoje = dados.filter(
            item => item.data === hoje
        );

        let dataExibida = hoje;

        if (turmasHoje.length === 0) {

            const datasDisponiveis =
                [...new Set(dados.map(item => item.data))]
                    .sort();

            const proximaData =
                datasDisponiveis.find(
                    data => data >= hoje
                );

            if (proximaData) {

                dataExibida = proximaData;

                turmasHoje = dados.filter(
                    item => item.data === proximaData
                );
            }
        }

        document.getElementById("dataExibida")
            .innerHTML =
            `<strong>Programação:</strong> ${new Date(dataExibida + "T12:00:00")
                .toLocaleDateString("pt-BR")}`;

        document.getElementById("contadorSalas")
            .textContent =
            `${turmasHoje.length} ambientes ocupados`;

        const ordemSalas = [
            "SALA 01",
            "SALA 02",
            "SALA 03",
            "SALA MÓVEL",
            "LAB. INFORMÁTICA",
            "LAB. AUTOMAÇÃO",
            "LAB. ELÉTRICA",
            "LAB. MECÂNICA",
            "LA. MECÂNICA"
        ];

        turmasHoje.sort((a, b) => {

            const posA = ordemSalas.indexOf(a.sala);
            const posB = ordemSalas.indexOf(b.sala);

            return posA - posB;
        });

        const container =
            document.getElementById("salasContainer");

        container.innerHTML = "";

        if (turmasHoje.length === 0) {

            container.innerHTML = `
                <div class="card">
                    <div class="turma">
                        Nenhuma aula encontrada.
                    </div>
                </div>
            `;

            return;
        }

        turmasHoje.forEach(item => {

            const classe =
                item.sala.includes("LAB")
                    ? "card laboratorio"
                    : "card";

            container.innerHTML += `
                <div class="${classe}">
                    <div class="sala">
                        ${item.sala}
                    </div>

                    <div class="turma">
                        ${item.turma}
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

atualizarRelogio();
carregarDados();

setInterval(atualizarRelogio, 1000);

setInterval(carregarDados, 60000);

setInterval(() => {
    location.reload();
}, 300000);