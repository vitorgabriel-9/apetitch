import { useLocation, useNavigate } from "react-router-dom"; // Lê dados recebidos e navega entre telas.
import { useState } from "react"; // Guarda valores que podem mudar na tela.
import { clearRestaurantCart } from "../../services/cartService"; // Limpa o carrinho após confirmar o pedido.
import { createOrder, updateOrderStatus } from "../../services/orderService"; // Cria pedidos e atualiza seus status.

import "./Delivery.css"; // Carrega os estilos visuais desta página.

// Este tipo descreve os dados que chegam da tela de comparação.
type DeliveryData = {
  restaurantId: string; // Identifica o restaurante dono do carrinho.
  restaurantName: string; // Nome exibido no resumo da entrega.
  deliveryName: string; // Nome da modalidade escolhida.
  fee: number; // Taxa de entrega em número.
  time: string; // Prazo de entrega ou tempo de preparo.
  mode: "apetitch" | "partner" | "pickup"; // Limita as modalidades possíveis.
  orderId?: number; // Só existe depois de o pedido ser confirmado.
  checkout?: {
    itemCount: number; // Quantidade total de itens do carrinho.
    items: string[]; // Produtos escolhidos, já em formato de texto.
    total: number; // Valor total do pedido.
  };
};

const DELIVERY_SUMMARY_KEY = "apetitch:delivery-summary"; // Chave usada para salvar a entrega temporariamente no navegador.

function getStoredDelivery(): DeliveryData | null { // Busca a entrega salva se a página for atualizada.
  try { // Tenta ler o sessionStorage sem deixar um possível erro quebrar a tela.
    const savedDelivery = window.sessionStorage.getItem(DELIVERY_SUMMARY_KEY); // Lê o texto salvo pela chave acima.
    return savedDelivery ? (JSON.parse(savedDelivery) as DeliveryData) : null; // Converte o texto em objeto ou retorna null.
  } catch { // Executa se o dado salvo for inválido, por exemplo.
    return null; // Sem dado válido, informa que não existe entrega para mostrar.
  }
}

// Cada item é uma etapa visual da entrega.
const deliverySteps = [
  "Pedido confirmado", // Índice 0 da timeline.
  "Em preparação", // Índice 1 da timeline.
  "Pronto para sair", // Índice 2 da timeline.
  "Pedido entregue", // Índice 3 e última etapa.
];

export function Delivery() { // Componente que representa a tela de entrega.
  const navigate = useNavigate(); // Função usada para mudar de rota.
  const location = useLocation(); // Objeto com informações da rota atual.

  // `location.state` contém os dados enviados pela tela anterior.
  // O sessionStorage é um plano B caso a página seja atualizada.
  const [delivery, setDelivery] = useState<DeliveryData | null>(
    () => (location.state as DeliveryData | null) ?? getStoredDelivery() // Usa os dados da tela anterior; sem eles, busca o backup salvo.
  );
  const [currentStep, setCurrentStep] = useState(0); // Começa na primeira etapa da entrega.
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Começa com as notificações marcadas.

  // Se alguém abrir /entrega diretamente, não existem dados para mostrar.
  if (!delivery) { // Protege a tela quando alguém abre /entrega sem escolher uma modalidade.
    return (
      <main className="delivery-not-found"> {/* Área visual do estado sem entrega. */}
        <span>🛵</span> {/* Ícone ilustrativo. */}
        <h1>Nenhuma entrega selecionada</h1> {/* Título do aviso. */}
        <p>Compare uma modalidade de entrega antes de abrir este resumo.</p> {/* Explica o próximo passo. */}
        <button type="button" onClick={() => navigate("/home")}> {/* Volta para a Home ao clicar. */}
          Voltar para a Home
        </button>
      </main>
    );
  }

  // A partir daqui existe uma entrega válida; o alias mantém essa garantia nos callbacks.
  const deliveryData = delivery; // Apelido: daqui em diante TypeScript sabe que delivery não é null.
  const isPickup = delivery.mode === "pickup"; // True quando a modalidade é retirada no local.
  const isFinished = currentStep === deliverySteps.length - 1; // True quando a etapa atual é a última da lista.

  function finishCheckout() { // Decide a ação do botão principal da página.
    if (!deliveryData.checkout) { // Se não recebeu carrinho, não é possível confirmar um pedido.
      navigate(`/restaurante/${deliveryData.restaurantId}`); // Volta ao restaurante para a pessoa escolher itens.
      return; // Encerra a função neste caso.
    }

    if (deliveryData.orderId) { // Se já há pedido criado, não cria outro igual.
      navigate("/pedidos"); // Apenas abre a página “Meus pedidos”.
      return; // Encerra a função neste caso.
    }

    const order = createOrder({ // Cria e salva um novo pedido.
      restaurant: deliveryData.restaurantName, // Envia o nome do restaurante.
      itemCount: deliveryData.checkout.itemCount, // Envia a quantidade dos itens.
      items: deliveryData.checkout.items, // Envia a lista de produtos.
      total: deliveryData.checkout.total, // Envia o valor total.
    });
    clearRestaurantCart(String(deliveryData.restaurantId)); // Remove do carrinho os itens que acabaram de virar pedido.
    const trackedDelivery = { ...deliveryData, orderId: order.id }; // Copia os dados e acrescenta o ID do pedido criado.
    setDelivery(trackedDelivery); // Atualiza a tela para saber que o pedido foi confirmado.
    window.sessionStorage.setItem(
      DELIVERY_SUMMARY_KEY, // Define onde o dado será salvo.
      JSON.stringify(trackedDelivery) // Transforma o objeto em texto para o navegador armazenar.
    );
  }

  function advanceStep() { // Avança visualmente o andamento da entrega.
    if (!deliveryData.orderId) { // Sem pedido confirmado, não existe entrega para acompanhar.
      return; // Não permite avançar a timeline.
    }

    // Nunca deixa o índice passar da última etapa.
    setCurrentStep((step) => { // Usa o valor mais recente da etapa para calcular a próxima.
      const nextStep = Math.min(step + 1, deliverySteps.length - 1); // Soma 1 sem ultrapassar a última etapa.

      if (nextStep === deliverySteps.length - 1) { // Quando chega em “Pedido entregue”...
        updateOrderStatus(deliveryData.orderId!, "concluido"); // ...muda o pedido salvo para concluído.
      }

      return nextStep; // Salva a nova etapa no estado.
    });
  }

  return (
    <main className="delivery-page"> {/* Container principal da página. */}
      <header className="delivery-header"> {/* Cabeçalho com voltar, marca e status. */}
        <button
          type="button" // Indica que este botão não envia formulário.
          className="delivery-back" // Classe CSS do botão de voltar.
          onClick={() => navigate(-1)} // Volta uma página no histórico do navegador.
          aria-label="Voltar para a comparação" // Descreve a ação para leitores de tela.
        >
          ←
        </button>
        <span>Apetitch</span> {/* Nome da aplicação. */}
        <span className="delivery-header-status">Resumo</span> {/* Nome curto da tela atual. */}
      </header>

      <section className="delivery-content"> {/* Área que contém todas as informações da entrega. */}
        <span className="delivery-eyebrow"> {/* Texto pequeno acima do título. */}
          {isPickup ? "Retirada escolhida" : "Entrega escolhida"} {/* Escolhe o texto conforme a modalidade. */}
        </span>
        <h1>{delivery.restaurantName}</h1> {/* Mostra o nome do restaurante. */}
        <p className="delivery-description">
          Confira os dados da modalidade selecionada e confirme o pedido para acompanhar a entrega. {/* Explica o objetivo da página. */}
        </p>

        <article className="delivery-summary-card"> {/* Card com modalidade, prazo e taxa. */}
          <div className="delivery-icon">{isPickup ? "🥡" : "🛵"}</div> {/* Mostra ícone de retirada ou entrega. */}
          <div> {/* Grupo de informações da modalidade. */}
            <span>Modalidade</span> {/* Rótulo da informação. */}
            <strong>{delivery.deliveryName}</strong> {/* Nome da modalidade escolhida. */}
          </div>
          <div> {/* Grupo de informações do prazo. */}
            <span>{isPickup ? "Tempo de preparo" : "Previsão"}</span> {/* Muda o rótulo para retirada ou entrega. */}
            <strong>{delivery.time}</strong> {/* Mostra o tempo recebido. */}
          </div>
          <div> {/* Grupo de informações da taxa. */}
            <span>Taxa</span> {/* Rótulo da informação. */}
            <strong>{delivery.fee ? `R$ ${delivery.fee.toFixed(2).replace(".", ",")}` : "Sem taxa"}</strong> {/* Formata a taxa ou mostra que é gratuita. */}
          </div>
        </article>

        {delivery.checkout && ( // Só renderiza este resumo se existirem dados de carrinho.
          <section className="delivery-order-summary" aria-label="Resumo do pedido"> {/* Card acessível do resumo do pedido. */}
            <span>
              {delivery.checkout.itemCount} {delivery.checkout.itemCount === 1 ? "item" : "itens"} no pedido {/* Mostra quantidade e aplica singular ou plural. */}
            </span>
            <strong>R$ {delivery.checkout.total.toFixed(2).replace(".", ",")}</strong> {/* Mostra o valor total formatado. */}
          </section>
        )}

        <section className="delivery-timeline" aria-labelledby="delivery-timeline-title"> {/* Seção acessível da timeline. */}
          <div className="timeline-heading"> {/* Cabeçalho da timeline. */}
            <div> {/* Agrupa título e subtítulo. */}
              <span className="delivery-eyebrow">Acompanhamento</span> {/* Rótulo pequeno. */}
              <h2 id="delivery-timeline-title">Status da entrega</h2> {/* Título ligado ao aria-labelledby. */}
            </div>
            <span className="timeline-progress">{currentStep + 1} de {deliverySteps.length}</span> {/* Exibe, por exemplo, “2 de 4”. */}
          </div>

          <ol> {/* Lista ordenada das quatro etapas. */}
            {deliverySteps.map((step, index) => ( // Cria um item visual para cada texto do array.
              <li
                key={step} // Identificador único exigido pelo React para listas.
                className={index < currentStep ? "completed" : index === currentStep ? "current" : ""} // Define classe de concluída, atual ou futura.
              >
                <span>{index < currentStep ? "✓" : index + 1}</span> {/* Etapa concluída ganha ✓; as demais mostram o número. */}
                <strong>{step}</strong> {/* Mostra o nome da etapa. */}
              </li>
            ))}
          </ol>

          <button
            className="advance-delivery" // Classe CSS do botão de avanço.
            type="button" // Impede comportamento de envio de formulário.
            onClick={advanceStep} // Chama a função que passa para a próxima etapa.
            disabled={isFinished || !deliveryData.orderId} // Desabilita se terminou ou se o pedido ainda não foi confirmado.
          >
            {!deliveryData.orderId
              ? "Confirme o pedido para acompanhar" // Texto antes da criação do pedido.
              : isFinished
                ? "Entrega concluída" // Texto da última etapa.
                : "Avançar status de demonstração"} {/* Texto enquanto a entrega está em andamento. */}
          </button>
        </section>

        <label className="delivery-notifications"> {/* Rótulo clicável que envolve a opção de notificação. */}
          <span> {/* Agrupa os textos da opção. */}
            <strong>Atualizações da entrega</strong> {/* Título da opção. */}
            <small>Receber avisos sobre mudanças no status.</small> {/* Explicação menor. */}
          </span>
          <input
            type="checkbox" // Campo que pode ser marcado ou desmarcado.
            checked={notificationsEnabled} // Conecta o estado ao valor visual da caixa.
            onChange={() => setNotificationsEnabled((enabled) => !enabled)} // Inverte true para false e false para true.
          />
        </label>

        <button
          className="delivery-menu-button" // Classe CSS do botão principal.
          type="button" // Botão comum, sem envio de formulário.
          onClick={finishCheckout} // Cria o pedido, volta ao restaurante ou abre Meus pedidos.
        >
          {!delivery.checkout
            ? "Escolher itens do restaurante" // Sem carrinho, orienta a pessoa a escolher produtos.
            : deliveryData.orderId
              ? "Ver meus pedidos" // Com pedido criado, abre o histórico.
              : "Confirmar pedido"} {/* Com carrinho e sem pedido criado, confirma a compra. */}
        </button>
      </section>
    </main>
  );
}
