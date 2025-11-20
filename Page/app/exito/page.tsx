"use client";
import { useEffect, useState } from "react";
import VinylHero from "@/components/vinyl-hero";
import { getDailyRandom } from "@/service";

export default function ExitoPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getDailyRandom()
      .then(setData)
      .catch((err) => console.error(err));
  }, []);

  if (!data) {
    return <div className="text-white text-center mt-20">Cargando...</div>;
  }

  return (
    <main className="min-h-screen">
      <VinylHero
        title="ÉXITO"
        titleColor="text-green-500"
        videoId={data.Answer.urlYT}
        showInput={false}
        linkText="Ver más información"
        linkUrl="https://example.com"
        data={data}
      />
    </main>
  );
}
