let produtos = [];
let carrinho = [];

fetch("produtos.json")
  .then(r => r.json())
  .then(data => {
    produtos = data;
    renderCategories();
    renderProducts(produtos);
  });

function renderCategories() {
  const cats = [...new Set(produtos.map(p => p.categoria))];
  const el = document.getElementById("categories");

  el.innerHTML = `<div class="cat" onclick="renderProducts(produtos)">🔥 Todos</div>` +
    cats.map(c => `<div class="cat" onclick="filterCategory('${c}')">${c}</div>`).join("");
}

function filterCategory(cat) {
  const filtered = produtos.filter(p => p.categoria === cat);
  renderProducts(filtered);
}

function renderProducts(lista) {
  const el = document.getElementById("products");
  el.innerHTML = lista.map(p => `
    <div class="product">
      <h4>${p.nome}</h4>
      <small>${p.unidade}</small>
      <div class="price">R$ ${p.preco.toFixed(2)}</div>
      <button onclick="addCart(${p.id})">Adicionar</button>
    </div>
  `).join("");
}

document.getElementById("search").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = produtos.filter(p => p.nome.toLowerCase().includes(term));
  renderProducts(filtered);
});

function addCart(id) {
  const item = carrinho.find(i => i.id === id);
  if(item) item.qtd += 1;
  else carrinho.push({...produtos.find(p => p.id === id), qtd: 1});

  updateCart();
}

function updateCart() {
  document.getElementById("cartCount").innerText = carrinho.reduce((s,i)=>s+i.qtd,0);

  const items = document.getElementById("cartItems");
  items.innerHTML = carrinho.map(i => `
    <div class="cart-item">
      <div>
        <strong>${i.nome}</strong><br>
        <small>${i.unidade}</small><br>
        <small>Qtd: ${i.qtd}</small>
      </div>
      <div>
        <strong>R$ ${(i.preco*i.qtd).toFixed(2)}</strong><br>
        <button onclick="removeCart(${i.id})">➖</button>
      </div>
    </div>
  `).join("");

  const total = carrinho.reduce((s,i)=> s + i.preco*i.qtd,0);
  document.getElementById("cartTotal").innerText = total.toFixed(2);
}

function removeCart(id){
  const item = carrinho.find(i=>i.id===id);
  if(!item) return;
  item.qtd--;
  if(item.qtd<=0) carrinho = carrinho.filter(i=>i.id!==id);
  updateCart();
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
}

function finalizarPedido(){
  if(carrinho.length===0) return alert("Carrinho vazio!");

  const nome = document.getElementById("nome").value;
  const whats = document.getElementById("whats").value;
  const endereco = document.getElementById("endereco").value;
  const bairro = document.getElementById("bairro").value;
  const obs = document.getElementById("obs").value;

  if(!nome || !whats || !endereco || !bairro){
    return alert("Preencha nome, whatsapp, endereço e bairro.");
  }

  const total = carrinho.reduce((s,i)=> s + i.preco*i.qtd,0);

  let msg = `Olá, WF Super Compras!%0A%0A`;
  msg += `🧾 *NOVO PEDIDO*%0A`;
  msg += `👤 Nome: ${nome}%0A`;
  msg += `📲 WhatsApp: ${whats}%0A`;
  msg += `📍 Endereço: ${endereco}%0A`;
  msg += `🏘 Bairro: ${bairro}%0A%0A`;

  msg += `🛒 *Itens:*%0A`;
  carrinho.forEach(i => {
    msg += `- ${i.nome} (${i.unidade}) x${i.qtd} = R$ ${(i.preco*i.qtd).toFixed(2)}%0A`;
  });

  msg += `%0A💰 Total: R$ ${total.toFixed(2)}%0A`;
  msg += `💳 Pagamento: *Na entrega*%0A`;
  if(obs) msg += `📝 Obs: ${obs}%0A`;

  window.open(`https://wa.me/5531993957145?text=${msg}`, "_blank");
}