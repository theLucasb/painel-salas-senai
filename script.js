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

        const resposta = await fetch('https://thelucasb.github.io/painel-salas-dados/dados.json')

        const dados = await resposta.json();

        const hoje = new Date().toISOString().split("T")[0];

        const turmasHoje = dados.filter(item => item.data === hoje);

        const container =
            document.getElementById("salasContainer");

        container.innerHTML = "";

        if(turmasHoje.length === 0){

            container.innerHTML = `
                <div class="card">
                    <div class="turma">
                        Nenhuma turma cadastrada para hoje.
                    </div>
                </div>
            `;

            return;
        }

        turmasHoje.forEach(item => {

            container.innerHTML += `
                <div class="card">
                    <div class="sala">
                        ${item.sala}
                    </div>

                    <div class="turma">
                        ${item.turma}
                    </div>
                </div>
            `;
        });

    } catch(error){

        console.error(error);

    }
}

atualizarRelogio();
carregarDados();

setInterval(atualizarRelogio,1000);

setInterval(carregarDados,30000);