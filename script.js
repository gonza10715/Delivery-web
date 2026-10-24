const restaurantes = [
    {
        nombre: "Pizzería Don Juan",
        tipo: "Pizzas 🍕",
        menu: [
            { nombre: "Pizza Muzza", precio: 3500 },
            { nombre: "Napolitana", precio: 4200 },
            { nombre: "Porción", precio: 1200 }
            
        ]
    },
        {
        nombre: "Ídolo Burger",
        tipo: "Hamburguesas premium 🍔",
        menu: [
            { nombre: "Burger Ídolo", precio: 5500 },
            { nombre: "Doble queso", precio: 6200 },
            { nombre: "Papas Messi", precio: 2500 }
        ]
    },
    {
        nombre: "La Positiva",
        tipo: "Comida casera 🍝",
        menu: [
            { nombre: "Milanesa con papas", precio: 4800 },
            { nombre: "Fideos bolognesa", precio: 4200 },
            { nombre: "Empanadas x6", precio: 3600 }
        ]
    },
    {
        nombre: "La Papa Frita de Messi",
        tipo: "Fast food ⚽🍟",
        menu: [
            { nombre: "Super papas cheddar", precio: 3800 },
            { nombre: "Combo Messi", precio: 5900 },
            { nombre: "Papas clásicas", precio: 2200 }
        ]
    },
    {
        nombre: "La Casa Local",
        tipo: "Parrilla & bodegón 🥩",
        menu: [
            { nombre: "Asado completo", precio: 7800 },
            { nombre: "Bondiola", precio: 6200 },
            { nombre: "Choripán", precio: 3200 }
        ]
    },
    {
        nombre: "Sabores Express",
        tipo: "Comida rápida 🚀",
        menu: [
            { nombre: "Wrap pollo", precio: 4100 },
            { nombre: "Tacos x3", precio: 3900 },
            { nombre: "Combo express", precio: 5200 }
        ]
    },
    {
        nombre: "Burger House",
        tipo: "Hamburguesas 🍔",
        menu: [
            { nombre: "Clásica", precio: 4000 },
            { nombre: "Doble", precio: 5200 },
            { nombre: "Papas", precio: 1800 }
        ]
    },
    {
        nombre: "Parrilla El Gaucho",
        tipo: "Parrilla 🥩",
        menu: [
            { nombre: "Asado", precio: 6500 },
            { nombre: "Vacío", precio: 7000 },
            { nombre: "Entraña", precio: 7500 }
        ]
    },
    {
        nombre: "Shawarma King",
        tipo: "Shawarma 🌯",
        menu: [
            { nombre: "Shawarma pollo", precio: 4500 },
            { nombre: "Shawarma carne", precio: 4800 }
        ]
    },
    {
        nombre: "Dulce Tentación",
        tipo: "Pastelería 🍰",
        menu: [
            { nombre: "Cheesecake", precio: 3200 },
            { nombre: "Torta chocolate", precio: 3500 }
        ]
    },
    {
        nombre: "Helados Polar",
        tipo: "Heladería 🍦",
        menu: [
            { nombre: "1/4 kg", precio: 2800 },
            { nombre: "1/2 kg", precio: 5000 }
        ]
        
    }
];

const listaRestaurantes = document.getElementById("lista-restaurantes");
const menuItems = document.getElementById("menu-items");
const listaCarrito = document.getElementById("lista-carrito");
const buscador = document.getElementById("buscador");

const btnPagar = document.getElementById("btn-pagar");
const modal = document.getElementById("pago-modal");
const cerrarModal = document.getElementById("cerrar-modal");
const btnTarjeta = document.getElementById("btn-tarjeta");
const btnEfectivo = document.getElementById("btn-efectivo");
const btnMp = document.getElementById("btn-mp");
const formTarjeta = document.getElementById("form-tarjeta");
const mensajePago = document.getElementById("mensaje-pago");

const menuBtn = document.getElementById("menu-btn");
const menuNav = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
    menuNav.style.display = menuNav.style.display === "block" ? "none" : "block";
});

function mostrarRestaurantes(filtro = "") {
    listaRestaurantes.innerHTML = "";

    restaurantes.filter(r => r.nombre.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(rest => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <h3>${rest.nombre}</h3>
                <p>${rest.tipo}</p>
                <button>Ver menú</button>
            `;

            card.querySelector("button").addEventListener("click", () => {
                mostrarMenu(rest);
            });

            listaRestaurantes.appendChild(card);
        });
}

function mostrarMenu(restaurante) {
    menuItems.innerHTML = `<h3>${restaurante.nombre}</h3>`;

    restaurante.menu.forEach(item => {
        const div = document.createElement("div");
        div.className = "menu-card";

        div.innerHTML = `
            <h4>${item.nombre}</h4>
            <p>$${item.precio}</p>
            <button>Agregar al carrito</button>
        `;

        div.querySelector("button").addEventListener("click", () => {
            agregarAlCarrito(item.nombre, item.precio);
        });

        menuItems.appendChild(div);
    });
}

function agregarAlCarrito(nombre, precio) {
    const li = document.createElement("li");
    li.textContent = `${nombre} - $${precio}`;
    listaCarrito.appendChild(li);
}

btnPagar.addEventListener("click", () => {
    modal.style.display = "flex";
});

cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
    formTarjeta.style.display = "none";
    mensajePago.textContent = "";
});

btnTarjeta.addEventListener("click", () => {
    formTarjeta.style.display = "block";
    mensajePago.textContent = "";
});

btnEfectivo.addEventListener("click", () => {
    mensajePago.textContent = "Simulación de efectivo completada. No existe un pedido real 💵";
});

btnMp.addEventListener("click", () => {
    mensajePago.textContent = "Simulación de Mercado Pago. No se realiza ninguna transferencia 📱";
});

buscador.addEventListener("input", e => {
    mostrarRestaurantes(e.target.value);
});

mostrarRestaurantes();
function mostrarPago() {
    document.getElementById("form-pago").style.display = "block";
}

function pagar() {
    document.getElementById("form-pago").style.display = "none";
    document.getElementById("confirmacion").style.display = "block";
}

function pagarEfectivo() {
    alert("Pago en efectivo simulado. No se enviará ningún pedido 🚴‍♂️");
}

function pagarMP() {
    alert("Mercado Pago simulado: no se abrirá ninguna pasarela ni se cobrará dinero.");
}

const simularTarjeta = document.getElementById("simular-tarjeta");
if (simularTarjeta) simularTarjeta.addEventListener("click", () => {
    mensajePago.textContent = "Pago simulado. No se cobró dinero ni se creó ningún pedido.";
});
