// Seleciona os elementos do formulário e containers de exibição
const form = document.getElementById("vehicle-form");
const listDiv = document.getElementById("vehicle-list");
const totalDiv = document.querySelector(".total");

document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', () => {
        input.value = input.value.toUpperCase();
    });
});

// Objeto para armazenar os veículos organizados por categoria
const vehicles = {};

// Função que retorna o dia de rodízio baseado no último dígito da placa
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

// Função para exibir conteúdo adicional (como um iframe)
function renderIframe() {
    const container = document.getElementById("iframe-container");
    if (!container) return;

    container.innerHTML = "";

    const iframe = document.createElement("iframe");
    iframe.src = "https://exemplo.com";
    iframe.width = "100%";
    iframe.height = "300";
    iframe.sandbox = "allow-scripts";
    iframe.title = "Conteúdo externo";

    container.appendChild(iframe);
}

// Função para exibir os veículos e o total
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

    const textoVeiculo = totalVeiculos === 0
        ? "Nenhum veículo"
        : totalVeiculos === 1
            ? "1 veículo"
            : `${totalVeiculos} veículos`;

    const textoDisponivel = totalVeiculos <= 1 ? "disponível" : "disponíveis";

    totalDiv.textContent = `📊 ${textoVeiculo} ${textoDisponivel} para locação`;

    renderIframe();

    const widget = document.querySelector(".find-widget");
    if (widget) {
        widget.setAttribute("inert", "");
    }
}

// Evento ao submeter formulário
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

window.removeItem = function (categoria, index) {
    const confirmar = confirm("Tem certeza que deseja apagar este item?");
    if (!confirmar) return;

    // Remove do array imediatamente
    vehicles[categoria].splice(index, 1);

    // Se a categoria estiver vazia, exclui-a antes de renderizar
    const isCategoriaVazia = vehicles[categoria].length === 0;
    if (isCategoriaVazia) delete vehicles[categoria];

    // Atualiza a lista com os dados já alterados
    render();

    // Após renderizar, remove visualmente o item e o cabeçalho (se necessário)
    const headers = document.querySelectorAll(".category");
    const header = Array.from(headers).find(h => h.textContent.includes(categoria));

    if (isCategoriaVazia && header) {
        header.classList.add("fade-out");
        header.addEventListener("transitionend", () => {
            header.remove();
        });
    } else {
        const vehicleElements = document.querySelectorAll(`[data-categoria="${categoria}"]`);
        const vehicleElement = vehicleElements[index];
        if (vehicleElement) {
            vehicleElement.classList.add("fade-out");
            vehicleElement.addEventListener("transitionend", () => {
                vehicleElement.remove();
            });
        } else {
            alert("O item foi removido.");
        }
    }
};
