import { Router } from "express";
import { Restaurant } from "../models/Restaurant";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const restaurants = await Restaurant.find();

    res.json(restaurants);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao buscar restaurantes.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurante não encontrado.",
      });
    }

    res.json(restaurant);
  } catch {
    res.status(400).json({
      message: "ID de restaurante inválido.",
    });
  }
});

export default router;