export async function getDailyRandom() {
  const res = await fetch("https://sample-render-kk6y.onrender.com/daily-random");

  if (!res.ok) {
    throw new Error("Error al llamar la API");
  }

  return res.json();
}