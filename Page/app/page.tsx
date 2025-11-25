"use client";

import { useEffect, useState } from "react";
import VinylHero from "@/components/vinyl-hero";
import LoadingScreen from "@/components/loading-screen";
import ErrorScreen from "@/components/error-screen";
import { getDailyRandom } from "@/service";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(false);
    getDailyRandom()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen onRetry={fetchData} />;
  }

  if (!data || !data.Question) {
    return <ErrorScreen onRetry={fetchData} />;
  }

  return (
    <main className="min-h-screen">
      <VinylHero
        title={`${data.Question.artista} - ${data.Question.nombre}`}
        showInput={true}
        linkText={`${data.Question.artista} - ${data.Question.nombre}`}
        linkUrl={data.Question.urlYT}
        videoId={data.Question.urlYT}
        data={data}
      />
    </main>
  );
}
