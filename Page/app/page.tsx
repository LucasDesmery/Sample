"use client";

import { useEffect, useState } from "react";
import VinylHero from "@/components/vinyl-hero";
import { getDailyRandom } from "@/service";

export default function Page() {
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
        title={`${data.Answer.artista} - ${data.Answer.nombre}`}
        showInput={true}
        linkText={`${data.Question.artista} - ${data.Question.nombre}`}
        linkUrl={data.Question.urlYT}
        videoId={data.Answer.urlYT}
        data={data}
      />
    </main>
  );
}
