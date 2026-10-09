import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
	getFavoriteRestaurantIds,
	saveFavoriteRestaurantIds,
} from "../../services/appState";

import { getRestaurants } from "../../services/restaurantService";

import type { Restaurant } from "../../types/restaurant";

import "./Home.css";

type DeliveryOptionId = "apetitch" | "partner" | "pickup";

type CheckoutDetails = {
	itemCount: number;
	items: string[];
	total: number;
};

const categories = [
	{ name: "Todos", icon: "🍽️" },
	{ name: "Pizza", icon: "🍕" },
	{ name: "Hambúrguer", icon: "🍔" },
	{ name: "Japonesa", icon: "🍣" },
	{ name: "Brasileira", icon: "🇧🇷" },
	{ name: "Italiana", icon: "🍝" },
];

export function Home() {
	const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
	useEffect(() => {
		async function loadRestaurants() {
			try {
				const data = await getRestaurants();

				setRestaurants(data);
			} catch (error) {
				console.error("Erro ao carregar restaurantes:", error);
			}
		}

		loadRestaurants();
	}, []);

	const navigate = useNavigate();
	const navigationLocation = useLocation();
	const [searchParams] = useSearchParams();
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("Todos");
	const [favorites, setFavorites] = useState(getFavoriteRestaurantIds);
	const [showFilters, setShowFilters] = useState(false);
	const [showAll, setShowAll] = useState(false);
	const [sort, setSort] = useState("proximidade");
	const [location, setLocation] = useState("Fortaleza, CE");
	const [isQueryComparisonDismissed, setIsQueryComparisonDismissed] =
		useState(false);
	const [selectedDeliveryOption, setSelectedDeliveryOption] =
		useState<DeliveryOptionId>("apetitch");
	const favoritesOnly = searchParams.get("favoritos") === "1";
	const queryComparisonRestaurant = restaurants.find(
		(restaurant) => restaurant.id === searchParams.get("comparar"),
	);
	const activeComparisonRestaurant = isQueryComparisonDismissed
		? undefined
		: queryComparisonRestaurant;
	const checkout = (
		navigationLocation.state as { checkout?: CheckoutDetails } | null
	)?.checkout;

	const deliveryOptions = activeComparisonRestaurant
		? [
				{
					id: "apetitch" as const,
					name: "Apetitch",
					fee: 6.99,
					time: activeComparisonRestaurant.deliveryTime,
					note: "Entrega acompanhada pelo app",
					highlight: "Melhor custo-benefício",
				},
				{
					id: "partner" as const,
					name: "Parceiro delivery",
					fee: 8.99,
					time: "35–50 min",
					note: "Opção alternativa de entrega",
				},
				{
					id: "pickup" as const,
					name: "Retirada no local",
					fee: 0,
					time: activeComparisonRestaurant.waitTime,
					note: "Sem taxa de entrega",
				},
			]
		: [];
	const chosenDeliveryOption = deliveryOptions.find(
		(option) => option.id === selectedDeliveryOption,
	);

	function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const term = search.trim();

		if (!term) {
			navigate("/explorar");
			return;
		}

		navigate(`/explorar?busca=${encodeURIComponent(term)}`);
	}

	const filteredRestaurants = useMemo(() => {
		let result = restaurants.filter((restaurant) => {
			const matchesSearch =
				restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
				restaurant.category.toLowerCase().includes(search.toLowerCase());

			const matchesCategory =
				selectedCategory === "Todos" ||
				restaurant.category === selectedCategory;

			return (
				matchesSearch &&
				matchesCategory &&
				(!favoritesOnly || favorites.includes(restaurant.id))
			);
		});

		if (sort === "avaliacao") {
			result = [...result].sort((a, b) => b.rating - a.rating);
		}

		if (sort === "tempo") {
			result = [...result].sort(
				(a, b) => parseInt(a.waitTime) - parseInt(b.waitTime),
			);
		}

		return result;
	}, [restaurants, favorites, favoritesOnly, search, selectedCategory, sort]);

	const displayedRestaurants = showAll
		? filteredRestaurants
		: filteredRestaurants.slice(0, 4);

	function toggleFavorite(id: string) {
		setFavorites((current) => {
			const updatedFavorites = current.includes(id)
				? current.filter((favoriteId) => favoriteId !== id)
				: [...current, id];

			saveFavoriteRestaurantIds(updatedFavorites);
			return updatedFavorites;
		});
	}

	function getLocation() {
		if (!navigator.geolocation) {
			alert("Seu navegador não suporta localização.");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			() => {
				setLocation("Sua localização atual");
			},
			() => {
				alert("Não foi possível obter sua localização.");
			},
		);
	}

	return (
		<div className="home">
			{/* HEADER */}
			<header className="home-header">
				<div className="header-top">
					<div className="brand">
						<span className="brand-icon">A</span>
						<span>Apetitch</span>
					</div>

					<div className="header-actions">
						<button
							className="location-button"
							onClick={getLocation}
							title="Usar minha localização"
						>
							<span>📍</span>
							<span className="location-text">{location}</span>
						</button>

						<button
							className="profile-button"
							onClick={() => navigate("/perfil")}
							aria-label="Abrir perfil"
						>
							👤
						</button>
					</div>
				</div>

				{/* BUSCA */}
				<div className="search-area">
					<form className="search-box" onSubmit={handleSearchSubmit}>
						<button
							type="submit"
							className="search-submit"
							aria-label="Pesquisar"
						>
							⌕
						</button>

						<input
							type="text"
							placeholder="Buscar restaurante, prato..."
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							aria-label="Buscar restaurante ou prato"
						/>

						{search && (
							<button
								type="button"
								className="clear-search"
								onClick={() => setSearch("")}
								aria-label="Limpar busca"
							>
								×
							</button>
						)}
					</form>

					<button
						className="filter-button"
						onClick={() => setShowFilters(!showFilters)}
						aria-label="Abrir filtros"
						aria-expanded={showFilters}
					>
						⚙
					</button>
				</div>

				{/* FILTROS */}
				{showFilters && (
					<div className="filter-panel">
						<strong>Ordenar por</strong>

						<div className="filter-options">
							<button
								className={sort === "proximidade" ? "active" : ""}
								onClick={() => setSort("proximidade")}
							>
								📍 Mais próximos
							</button>

							<button
								className={sort === "avaliacao" ? "active" : ""}
								onClick={() => setSort("avaliacao")}
							>
								⭐ Melhor avaliação
							</button>

							<button
								className={sort === "tempo" ? "active" : ""}
								onClick={() => setSort("tempo")}
							>
								⏱️ Menor espera
							</button>
						</div>
					</div>
				)}
			</header>

			<main>
				{/* BANNER */}
				<section className="welcome-section">
					<div>
						<span className="welcome-small">
							Coma melhor. Escolha melhor.
						</span>

						<h1>
							Encontre o restaurante
							<span> certo para você.</span>
						</h1>

						<p>
							Compare restaurantes, preços, avaliações e tempo de espera
							em um só lugar.
						</p>
					</div>

					<div className="welcome-food">🍔</div>
				</section>

				{/* CATEGORIAS */}
				<section className="section">
					<div className="section-title">
						<h2>Categorias</h2>
					</div>

					<div className="categories">
						{categories.map((category) => (
							<button
								key={category.name}
								className={`category ${
									selectedCategory === category.name ? "selected" : ""
								}`}
								onClick={() => setSelectedCategory(category.name)}
							>
								<div className="category-icon">{category.icon}</div>

								<span>{category.name}</span>
							</button>
						))}
					</div>
				</section>

				{/* DESTAQUES */}
				<section className="section">
					<div className="section-title">
						<div>
							<span className="section-subtitle">
								Recomendados para você
							</span>

							<h2>Restaurantes em destaque</h2>
						</div>

						<button
							className="see-all"
							onClick={() => setShowAll(!showAll)}
						>
							{showAll ? "Ver menos" : "Ver todos"}
						</button>
					</div>

					<div className="restaurant-grid">
						{displayedRestaurants.map((restaurant) => (
							<article className="restaurant-card" key={restaurant.id}>
								<div className="restaurant-image">
									<img src={restaurant.image} alt={restaurant.name} />

									<button
										className={`favorite ${
											favorites.includes(restaurant.id)
												? "favorited"
												: ""
										}`}
										onClick={() => toggleFavorite(restaurant.id)}
										aria-label={
											favorites.includes(restaurant.id)
												? `Remover ${restaurant.name} dos favoritos`
												: `Adicionar ${restaurant.name} aos favoritos`
										}
										aria-pressed={favorites.includes(restaurant.id)}
									>
										{favorites.includes(restaurant.id) ? "♥" : "♡"}
									</button>

									<span className="rating">
										⭐ {restaurant.rating}
									</span>
								</div>

								<div className="restaurant-content">
									<div className="restaurant-name-row">
										<h3>{restaurant.name}</h3>

										<span className="price">{restaurant.price}</span>
									</div>

									<p className="restaurant-category">
										{restaurant.category}
									</p>

									<div className="restaurant-info">
										<span>📍 {restaurant.distance}</span>
										<span>⭐ {restaurant.reviews}</span>
									</div>

									<div className="status-row">
										<span
											className={`status ${restaurant.status
												.toLowerCase()
												.replace(" ", "-")}`}
										>
											<span className="status-dot"></span>
											{restaurant.status}
										</span>

										<span className="wait">
											⏱️ {restaurant.waitTime}
										</span>
									</div>

									<div className="delivery-row">
										<span>
											🛵 Delivery: {restaurant.deliveryTime}
										</span>
									</div>

									<button
										className="restaurant-button"
										onClick={() =>
											navigate(`/restaurante/${restaurant.id}`)
										}
									>
										Ver restaurante
										<span>→</span>
									</button>
								</div>
							</article>
						))}
					</div>

					{displayedRestaurants.length === 0 && (
						<div className="empty-state">
							<span>🔎</span>
							<h3>Nenhum restaurante encontrado</h3>
							<p>
								{favoritesOnly
									? "Você ainda não favoritou restaurantes com estes filtros."
									: "Tente pesquisar outro nome ou categoria."}
							</p>
						</div>
					)}
				</section>

				{/* ATALHOS */}
				<section className="section">
					<div className="section-title">
						<div>
							<span className="section-subtitle">
								Tudo em um só lugar
							</span>

							<h2>O que você quer fazer?</h2>
						</div>
					</div>

					<div className="quick-actions">
						<button
							className="quick-card"
							onClick={() => navigate("/explorar?perto-de-mim=1")}
						>
							<span>🗺️</span>
							<div>
								<strong>Encontrar perto de mim</strong>
								<small>Veja restaurantes próximos</small>
							</div>
							<b>→</b>
						</button>

						<button
							className="quick-card"
							onClick={() => navigate("/pedidos")}
						>
							<span>📦</span>
							<div>
								<strong>Acompanhar pedido</strong>
								<small>Veja seus pedidos atuais</small>
							</div>
							<b>→</b>
						</button>
					</div>
				</section>
			</main>

			{/* NAVEGAÇÃO INFERIOR */}
			<nav className="bottom-navigation">
				<button className="nav-item active">
					<span>⌂</span>
					<small>Início</small>
				</button>

				<button className="nav-item" onClick={() => navigate("/explorar")}>
					<span>🗺️</span>
					<small>Explorar</small>
				</button>

				<button className="nav-item" onClick={() => navigate("/pedidos")}>
					<span>📦</span>
					<small>Pedidos</small>
				</button>

				<button
					className="nav-item"
					onClick={() => navigate("/favoritos")}
				>
					<span>♡</span>
					<small>Favoritos</small>
				</button>

				<button className="nav-item" onClick={() => navigate("/perfil")}>
					<span>👤</span>
					<small>Perfil</small>
				</button>
			</nav>

			{activeComparisonRestaurant && (
				<div
					className="comparison-modal"
					role="dialog"
					aria-modal="true"
					aria-labelledby="comparison-title"
				>
					<div className="comparison-modal-content">
						<button
							className="comparison-close"
							type="button"
							onClick={() => {
								setIsQueryComparisonDismissed(true);
							}}
							aria-label="Fechar comparador"
						>
							×
						</button>
						<span className="section-subtitle">Comparar delivery</span>
						<h2 id="comparison-title">
							{activeComparisonRestaurant.name}
						</h2>
						<p>
							Compare taxa, prazo e modalidade antes de escolher. Valores
							demonstrativos.
						</p>
						<div className="delivery-options">
							{deliveryOptions.map((option) => (
								<button
									key={option.id}
									type="button"
									className={`delivery-option ${selectedDeliveryOption === option.id ? "selected" : ""}`}
									onClick={() => setSelectedDeliveryOption(option.id)}
									aria-pressed={selectedDeliveryOption === option.id}
								>
									<span className="delivery-option-main">
										<strong>{option.name}</strong>
										<small>{option.note}</small>
									</span>
									<span className="delivery-option-value">
										<strong>
											{option.fee
												? `R$ ${option.fee.toFixed(2).replace(".", ",")}`
												: "Sem taxa"}
										</strong>
										<small>{option.time}</small>
									</span>
									{option.highlight && <em>{option.highlight}</em>}
								</button>
							))}
						</div>
						{chosenDeliveryOption && (
							<div className="comparison-selection" role="status">
								<span>
									Selecionado:{" "}
									<strong>{chosenDeliveryOption.name}</strong>
								</span>
								<span>
									{chosenDeliveryOption.fee
										? `Taxa de R$ ${chosenDeliveryOption.fee.toFixed(2).replace(".", ",")}`
										: "Você economiza na taxa de entrega"}
								</span>
							</div>
						)}
						<button
							className="comparison-continue"
							type="button"
							onClick={() => {
								if (!chosenDeliveryOption) return;

								const deliverySummary = {
									restaurantId: activeComparisonRestaurant.id,
									restaurantName: activeComparisonRestaurant.name,
									deliveryName: chosenDeliveryOption.name,
									fee: chosenDeliveryOption.fee,
									time: chosenDeliveryOption.time,
									mode: chosenDeliveryOption.id,
									checkout,
								};

								window.sessionStorage.setItem(
									"apetitch:delivery-summary",
									JSON.stringify(deliverySummary),
								);
								navigate("/entrega", { state: deliverySummary });
							}}
						>
							Ver resumo da entrega
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
