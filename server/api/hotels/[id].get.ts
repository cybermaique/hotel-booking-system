import { defineEventHandler, getRouterParam, createError } from "h3";
import { findHotelById } from "~/server/data/hotels";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Parâmetro 'id' é obrigatório",
    });
  }

  await sleep(Math.random() * 800 + 300);

  const hotel = findHotelById(id);
  if (!hotel) {
    throw createError({
      statusCode: 404,
      statusMessage: "Hotel Not Found",
      message: "Hotel não encontrado",
    });
  }

  return hotel;
});
