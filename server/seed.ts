import dotenv from "dotenv";

import { connectDatabase } from "./config/database";
import { Restaurant } from "./models/Restaurant";

dotenv.config();

const restaurants = [
	{
		name: "Bistrô Vila Madá",
		category: "Italiana",
		secondaryCategory: "Bistrô",

		rating: 4.7,
		reviews: 128,

		distance: 0.8,
		waitTime: "15 min",
		deliveryTime: "25–35 min",

		status: "Aberto",

		price: "$$",
		priceRange: "R$ 30–60",

		delivery: true,

		latitude: -3.7319,
		longitude: -38.5091,

		image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",

		description:
			"Um bistrô acolhedor com pratos italianos preparados com ingredientes selecionados.",

		address: "Rua dos Restaurantes, 120",

		location: {
			street: "Rua dos Restaurantes",
			neighborhood: "Aldeota",
			city: "Fortaleza",
			state: "CE",
			reference: "Próximo à praça",
		},

		openingHours: [
			{
				day: "Segunda a quinta",
				hours: "11:30 – 23:00",
			},
			{
				day: "Sexta e sábado",
				hours: "11:30 – 00:00",
			},
			{
				day: "Domingo",
				hours: "11:30 – 22:30",
			},
		],

		contactChannels: [
			{
				label: "WhatsApp",
				value: "(85) 99999-0000",
				href: "https://wa.me/5585999990000",
			},
			{
				label: "Instagram",
				value: "@apetitchrestaurante",
				href: "https://instagram.com",
			},
		],

		orderMethods: ["Delivery", "Retirada no local", "Pedido no restaurante"],

		menu: [
			{
				id: 1,
				name: "Pizza Margherita",
				description: "Molho de tomate, mozzarella e manjericão.",
				price: 39.9,
				image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
			},
			{
				id: 2,
				name: "Massa da Casa",
				description: "Massa artesanal com molho especial da casa.",
				price: 34.9,
				image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
			},
		],

		feedbacks: [
			{
				author: "Mariana",
				rating: 5,
				date: "Há 2 dias",
				comment: "Comida muito boa e atendimento excelente.",
			},
		],
	},

	{
		name: "Smoke House",
		category: "Hambúrguer",
		secondaryCategory: "Americana",
		rating: 4.5,
		distance: 1.2,
		deliveryTime: "20–30 min",
		latitude: -3.736,
		longitude: -38.503,
		image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
	},

	{
		name: "La Bella Pizza",
		category: "Pizza",
		secondaryCategory: "Italiana",
		rating: 4.6,
		distance: 1.6,
		deliveryTime: "30–40 min",
		latitude: -3.725,
		longitude: -38.515,
		image: "https://images.unsplash.com/photo-1579751626657-72bc17010498",
	},

	{
		name: "Sakura Sushi",
		category: "Japonesa",
		secondaryCategory: "Sushi",
		rating: 4.8,
		distance: 2.1,
		deliveryTime: "25–35 min",
		latitude: -3.741,
		longitude: -38.512,
		image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
	},

	{
		name: "Verde Vida",
		category: "Saudável",
		secondaryCategory: "Vegetariana",
		rating: 4.6,
		distance: 2.4,
		deliveryTime: "20–30 min",
		latitude: -3.728,
		longitude: -38.523,
		image: "https://images.unsplash.com/photo-1543362906-acfc16c67564",
	},
];

async function seed() {
	await connectDatabase();

	await Restaurant.deleteMany();

	await Restaurant.insertMany(restaurants);

	console.log("Restaurantes inseridos com sucesso!");

	process.exit(0);
}

seed();
