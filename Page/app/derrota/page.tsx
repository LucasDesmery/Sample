"use client";
import { useEffect, useState } from "react";
import VinylHero from "@/components/vinyl-hero";
import LoadingScreen from "@/components/loading-screen";
import ErrorScreen from "@/components/error-screen";
import { getDailyRandom } from "@/service";

export default function DerrotaPage() {
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

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen">
      <VinylHero
        title="DERROTA"
        titleColor="text-red-500"
        videoId={null}
        showInput={false}
        linkText="VER RESPUESTA"
        linkUrl={data.Question.sampling_url}
        data={data}
      />
    </main>
  );
}
