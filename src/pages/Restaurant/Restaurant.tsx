import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createOrder } from "../../services/orderService";
import {
	getFavoriteRestaurantIds,
	getCurrentUser,
	getRestaurantFeedbacks,
	saveFavoriteRestaurantIds,
	saveRestaurantFeedback,
} from "../../services/appState";
import {
	clearRestaurantCart,
	getRestaurantCart,
	saveRestaurantCart,
} from "../../services/cartService";

import { getRestaurantById } from "../../services/restaurantService";

import type { Restaurant as RestaurantType } from "../../types/restaurant";

import "./Restaurant.css";

export function Restaurant() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [favorite, setFavorite] = useState(() =>
		id ? getFavoriteRestaurantIds().includes(id) : false,
	);

	const [cart, setCart] = useState<Record<number, number>>(() =>
		id ? getRestaurantCart(id) : {},
	);
	const [showOpeningHours, setShowOpeningHours] = useState(false);
	const [showCartReview, setShowCartReview] = useState(false);
	const [customFeedbacks, setCustomFeedbacks] = useState<Feedback[]>(() =>
		id ? getRestaurantFeedbacks(id) : [],
	);
	const [feedbackRating, setFeedbackRating] = useState(5);
	const [feedbackComment, setFeedbackComment] = useState("");
	const [feedbackMessage, setFeedbackMessage] = useState("");

	const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		async function loadRestaurant() {
			if (!id) {
				setError("Restaurante não encontrado.");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError("");

				const data = await getRestaurantById(id);

				setRestaurant(data);
			} catch (error) {
				console.error("Erro ao carregar restaurante:", error);

				setError("Não foi possível carregar o restaurante.");
			} finally {
				setLoading(false);
			}
		}

		loadRestaurant();
	}, [id]);

	function addToCart(itemId: number) {
		setCart((current) => {
			const updatedCart = {
				...current,
				[itemId]: (current[itemId] || 0) + 1,
			};

			if (id) {
				saveRestaurantCart(id, updatedCart);
			}

			return updatedCart;
		});
	}

	function removeFromCart(itemId: number) {
		setCart((current) => {
			const quantity = current[itemId] || 0;

			const updatedCart = { ...current };

			if (quantity <= 1) {
				delete updatedCart[itemId];
			} else {
				updatedCart[itemId] = quantity - 1;
			}

			if (id) {
				saveRestaurantCart(id, updatedCart);
			}

			return updatedCart;
		});
	}

	function toggleFavorite() {
		if (!id) {
			return;
		}

		const currentFavorites = getFavoriteRestaurantIds();

		const updatedFavorites = favorite
			? currentFavorites.filter((favoriteId) => favoriteId !== id)
			: [...currentFavorites, id];

		saveFavoriteRestaurantIds(updatedFavorites);

		setFavorite(!favorite);
	}

	if (loading) {
		return (
			<div className="restaurant-page">
				<p>Carregando restaurante...</p>
			</div>
		);
	}

	if (error || !restaurant) {
		return (
			<div className="restaurant-page">
				<p>{error || "Restaurante não encontrado."}</p>

				<button onClick={() => navigate("/home")}>Voltar</button>
			</div>
		);
	}

	const cartItems = restaurant.menu.filter((item) => cart[item.id]);

	const cartTotal = cartItems.reduce(
		(total, item) => total + item.price * cart[item.id],
		0,
	);

	const statusDetail =
		restaurant.status === "Aberto"
			? "Aberto agora"
			: restaurant.status === "Lotado"
				? "Aberto, com alta demanda"
				: "Fechado no momento";
	const restaurantName = restaurant.name;

	function finishOrder() {
		const itemCount = cartItems.reduce(
			(total, item) => total + cart[item.id],
			0,
		);

		createOrder({
			restaurant: restaurantName,
			itemCount,
			items: cartItems.map((item) => `${cart[item.id]}x ${item.name}`),
			total: cartTotal,
		});
		if (id) {
			clearRestaurantCart(id);
		}
		setCart({});
		setShowCartReview(false);
		navigate("/pedidos");
	}

	function submitFeedback(event: React.FormEvent) {
		event.preventDefault();

		if (!feedbackComment.trim() || !id) {
			setFeedbackMessage("Escreva um comentário antes de enviar.");
			return;
		}

		const feedback: Feedback = {
			author: getCurrentUser()?.name ?? "Cliente Apetitch",
			rating: feedbackRating,
			date: "Agora",
			comment: feedbackComment.trim(),
		};

		saveRestaurantFeedback(id, feedback);
		setCustomFeedbacks((current) => [feedback, ...current]);
		setFeedbackComment("");
		setFeedbackMessage("Avaliação enviada. Obrigado pelo feedback!");
	}

	const allFeedbacks = [...customFeedbacks, ...restaurant.feedbacks];
	const totalReviews = restaurant.reviews + customFeedbacks.length;

	return (
		<div className="restaurant-page">
			<header className="restaurant-header">
				<button
					className="back-button"
					onClick={() => navigate("/home")}
					aria-label="Voltar para a página inicial"
				>
					←
				</button>

				<div className="restaurant-header-title">
					<span>Apetitch</span>
				</div>

				<button
					className={`restaurant-favorite ${favorite ? "active" : ""}`}
					onClick={toggleFavorite}
					aria-label={
						favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
					}
					aria-pressed={favorite}
				>
					{favorite ? "♥" : "♡"}
				</button>
			</header>

			<main>
				<section className="restaurant-hero">
					<img
						src={restaurant.image}
						alt={restaurant.name}
						className="restaurant-cover"
					/>

					<div className="restaurant-overlay"></div>

					<div className="restaurant-hero-content">
						<span className="restaurant-category">
							{restaurant.category}
						</span>

						<h1>{restaurant.name}</h1>

						<div className="restaurant-rating">
							<span>★ {restaurant.rating}</span>
							<span>({restaurant.reviews} avaliações)</span>
						</div>
					</div>
				</section>

				<section className="restaurant-container">
					<div className="restaurant-info-card">
						<div className="info-item">
							<span className="info-icon">●</span>

							<div>
								<strong>{restaurant.status}</strong>

								<small>{statusDetail}</small>
							</div>
						</div>

						<div className="info-item">
							<span className="info-icon">⏱</span>

							<div>
								<strong>{restaurant.waitTime}</strong>

								<small>Tempo de espera</small>
							</div>
						</div>

						<div className="info-item">
							<span className="info-icon">$</span>

							<div>
								<strong>{restaurant.price}</strong>

								<small>Faixa de preço</small>
							</div>
						</div>

						<div className="info-item">
							<span className="info-icon">🛵</span>

							<div>
								<strong>{restaurant.deliveryTime}</strong>

								<small>Delivery</small>
							</div>
						</div>

						<div className="info-item">
							<span className="info-icon">📍</span>

							<div>
								<strong>{restaurant.distance}</strong>

								<small>Distância</small>
							</div>
						</div>
					</div>

					<section className="restaurant-description">
						<div className="restaurant-about">
							<div>
								<span className="section-label">
									Sobre o restaurante
								</span>

								<h2>Uma experiência feita para você.</h2>
							</div>

							<p>{restaurant.description}</p>
						</div>

						<div className="restaurant-address">
							<strong>📍 {restaurant.address}</strong>
							<span>
								{restaurant.location.neighborhood} ·{" "}
								{restaurant.location.city}, {restaurant.location.state}
								{restaurant.location.reference &&
									` · ${restaurant.location.reference}`}
							</span>
						</div>

						<div className="restaurant-details">
							<div className="detail-block">
								<div className="detail-heading">
									<span>🕒 Funcionamento</span>
									<button
										type="button"
										aria-expanded={showOpeningHours}
										aria-controls="opening-hours-list"
										onClick={() =>
											setShowOpeningHours((current) => !current)
										}
									>
										{showOpeningHours ? "Ocultar" : "Ver horários"}
									</button>
								</div>
								<strong>Consulte os horários por dia</strong>
								{showOpeningHours && (
									<ul
										className="opening-hours-list"
										id="opening-hours-list"
									>
										{restaurant.openingHours.map((schedule) => (
											<li key={schedule.day}>
												<span>{schedule.day}</span>
												<strong>{schedule.hours}</strong>
											</li>
										))}
									</ul>
								)}
							</div>

							<div className="detail-block">
								<span>Faixa de preço</span>
								<strong>{restaurant.priceRange}</strong>
							</div>

							<div className="detail-block order-details">
								<span>Como pedir</span>
								<div className="detail-tags">
									{restaurant.orderMethods.map((method) => (
										<span key={method}>{method}</span>
									))}
								</div>
							</div>

							<div className="detail-block contact-details">
								<span>Atendimento</span>
								<div className="detail-links">
									{restaurant.contactChannels.map((channel) => (
										<a
											key={channel.label}
											href={channel.href}
											target="_blank"
											rel="noreferrer"
										>
											{channel.label}: {channel.value}
										</a>
									))}
								</div>
							</div>
						</div>

						<a className="menu-access-button" href="#cardapio">
							Ver cardápio completo ↓
						</a>
					</section>

					<section className="menu-section" id="cardapio">
						<div className="menu-header">
							<div>
								<span className="section-label">Cardápio</span>

								<h2>Escolha seus favoritos</h2>
							</div>

							<span className="menu-count">
								{restaurant.menu.length} itens
							</span>
						</div>

						<div className="menu-list">
							{restaurant.menu.map((item) => (
								<article className="menu-item" key={item.id}>
									<img src={item.image} alt={item.name} />

									<div className="menu-item-content">
										<h3>{item.name}</h3>

										<p>{item.description}</p>

										<strong>
											R$ {item.price.toFixed(2).replace(".", ",")}
										</strong>
									</div>

									<div className="menu-actions">
										{cart[item.id] ? (
											<div className="quantity-control">
												<button
													aria-label={`Diminuir quantidade de ${item.name}`}
													onClick={() => removeFromCart(item.id)}
												>
													−
												</button>

												<span>{cart[item.id]}</span>

												<button
													aria-label={`Aumentar quantidade de ${item.name}`}
													onClick={() => addToCart(item.id)}
												>
													+
												</button>
											</div>
										) : (
											<button
												className="add-button"
												aria-label={`Adicionar ${item.name} ao carrinho`}
												onClick={() => addToCart(item.id)}
											>
												+
											</button>
										)}
									</div>
								</article>
							))}
						</div>
					</section>

					<section
						className="reviews-section"
						aria-labelledby="reviews-title"
					>
						<div className="reviews-header">
							<div>
								<span className="section-label">Avaliações</span>
								<h2 id="reviews-title">
									O que dizem sobre o restaurante
								</h2>
							</div>
							<div className="reviews-summary">
								<strong>★ {restaurant.rating}</strong>
								<span>{totalReviews} avaliações</span>
							</div>
						</div>

						<div className="feedback-list">
							{allFeedbacks.map((feedback) => (
								<article
									className="feedback-card"
									key={`${feedback.author}-${feedback.date}`}
								>
									<div>
										<strong>{feedback.author}</strong>
										<span>
											★ {feedback.rating} · {feedback.date}
										</span>
									</div>
									<p>{feedback.comment}</p>
								</article>
							))}
						</div>

						<form className="feedback-form" onSubmit={submitFeedback}>
							<label htmlFor="feedback-comment">
								Deixe sua avaliação
							</label>
							<div
								className="rating-picker"
								aria-label="Escolha uma nota"
							>
								{[1, 2, 3, 4, 5].map((rating) => (
									<button
										key={rating}
										type="button"
										className={
											rating <= feedbackRating ? "selected" : ""
										}
										onClick={() => setFeedbackRating(rating)}
										aria-label={`${rating} estrela${rating > 1 ? "s" : ""}`}
										aria-pressed={rating === feedbackRating}
									>
										★
									</button>
								))}
							</div>
							<textarea
								id="feedback-comment"
								value={feedbackComment}
								onChange={(event) =>
									setFeedbackComment(event.target.value)
								}
								placeholder="Conte como foi sua experiência"
								maxLength={280}
							/>
							{feedbackMessage && (
								<p className="feedback-message">{feedbackMessage}</p>
							)}
							<button type="submit">Enviar avaliação</button>
						</form>
					</section>

					<section className="comparison-section">
						<div>
							<span className="section-label">Apetitch</span>

							<h2>Compare antes de pedir</h2>

							<p>
								Veja opções de entrega e escolha a melhor alternativa
								para seu pedido.
							</p>
						</div>

						<button
							className="comparison-button"
							onClick={() => navigate(`/home?comparar=${id}`)}
						>
							Comparar delivery →
						</button>
					</section>
				</section>
			</main>

			{cartItems.length > 0 && (
				<div className="cart-bar">
					<div className="cart-summary">
						<span>
							{cartItems.reduce(
								(total, item) => total + cart[item.id],
								0,
							)}{" "}
							item(ns)
						</span>

						<strong>R$ {cartTotal.toFixed(2).replace(".", ",")}</strong>
					</div>

					<button onClick={() => setShowCartReview(true)}>
						Ver pedido →
					</button>
				</div>
			)}

			{showCartReview && (
				<div
					className="cart-review"
					role="dialog"
					aria-modal="true"
					aria-labelledby="cart-review-title"
				>
					<div className="cart-review-content">
						<button
							className="cart-review-close"
							type="button"
							onClick={() => setShowCartReview(false)}
							aria-label="Fechar revisão do pedido"
						>
							×
						</button>
						<span className="section-label">Revisar pedido</span>
						<h2 id="cart-review-title">{restaurantName}</h2>
						<div className="cart-review-items">
							{cartItems.map((item) => (
								<div key={item.id}>
									<span>
										{cart[item.id]}x {item.name}
									</span>
									<strong>
										R${" "}
										{(item.price * cart[item.id])
											.toFixed(2)
											.replace(".", ",")}
									</strong>
								</div>
							))}
						</div>
						<div className="cart-review-total">
							<span>Total</span>
							<strong>
								R$ {cartTotal.toFixed(2).replace(".", ",")}
							</strong>
						</div>
						<button
							className="confirm-order-button"
							onClick={finishOrder}
						>
							Confirmar pedido
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
