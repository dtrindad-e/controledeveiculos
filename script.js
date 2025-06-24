const vehicles = {};

function getRodizio(placa) {
    const final = placa.slice(-1);
    const dias = {
        "1": "Segunda-feira", "2": "Segunda-feira",
        "3": "Terça-feira", "4": "Terça-feira",
        "5": "Quarta-feira", "6": "Quarta-feira",
        "7": "Quinta-feira", "8": "Quinta-feira",
        "9": "Sexta-feira", "0": "Sexta-feira"
    };
    return dias[final] || "Desconhecido";
}

const form = document.getElementById("vehicle-form");
const listDiv = document.getElementById("vehicle-list");
const totalDiv = document.querySelector(".total");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const categoria = document.getElementById("categoria").value.toUpperCase();
    const modelo = document.getElementById("modelo").value;
    const placa = document.getElementById("placa").value;

    if (!vehicles[categoria]) vehicles[categoria] = [];

    vehicles[categoria].push({ modelo, placa });

    form.reset();
    render();
});

function render() {
    listDiv.innerHTML = "";
    let totalVeiculos = 0;

    const categoriasOrdenadas = Object.keys(vehicles).sort();

    for (const categoria of categoriasOrdenadas) {
        const header = document.createElement("div");
        header.className = "category";
        header.textContent = `Grupo: ${categoria} | Total: ${vehicles[categoria].length}`;
        listDiv.appendChild(header);

        vehicles[categoria].forEach((v, i) => {
            const item = document.createElement("div");
            item.className = "vehicle";
            item.innerHTML = `
                • ${v.modelo} (${v.placa})
                (Rodízio: ${getRodizio(v.placa)})
                <span onclick="removeItem('${categoria}', ${i})">🗑</span>`;
            listDiv.appendChild(item);
            totalVeiculos++;
        });
    }

    let textoVeiculo;
    if (totalVeiculos === 0) {
        textoVeiculo = "nenhum veículo";
    } else if (totalVeiculos === 1) {
        textoVeiculo = "1 Veículo";
    } else {
        textoVeiculo = `${totalVeiculos} Veículos`;
    }

    let textoDisponivel;
    if (totalVeiculos === 1) {
        textoDisponivel = "disponível";
    } else {
        textoDisponivel = "disponíveis";
    }

    totalDiv.textContent = `📊 ${textoVeiculo} ${textoDisponivel} para locação!`;
}
