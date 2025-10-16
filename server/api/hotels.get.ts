import { defineEventHandler, getQuery, createError } from "h3";
import { listHotels } from "~/server/data/hotels";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default defineEventHandler(async (event) => {
  const q = getQuery(event);

  if (q.error === "true") {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Erro interno do servidor",
    });
  }
  if (q.empty === "true") {
    return {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }

  const ids = typeof q.ids === "string" ? q.ids.split(",") : undefined;
  const destination =
    typeof q.destination === "string" ? q.destination : undefined;
  const priceMin = q.price_min ? Number(q.price_min) : undefined;
  const sort = (q.sort as "price" | "rating" | "name") || undefined;
  const page = q.page ? Number(q.page) : 1;
  const limit = q.limit ? Number(q.limit) : 10;

  const result = listHotels({
    ids,
    destination,
    priceMin,
    sort,
    page,
    limit,
    projection: "list",
  });

  await sleep(Math.random() * 1000 + 500);

  return result;
});
