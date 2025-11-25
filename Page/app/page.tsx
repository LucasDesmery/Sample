"use client";

import { useEffect, useState } from "react";
import VinylHero from "@/components/vinyl-hero";
import LoadingScreen from "@/components/loading-screen";
import ErrorScreen from "@/components/error-screen";
import CountdownTimer from "@/components/countdown-timer";
import { getDailyRandom } from "@/service";

type GameStatus = "playing" | "success" | "defeat";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");

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

  // Load game state from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedDate = localStorage.getItem("sample_game_date");
    const savedStatus = localStorage.getItem("sample_game_status");
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // If saved date matches today and we have a status, restore it
    if (savedDate === today && savedStatus) {
      setGameStatus(savedStatus as GameStatus);
    } else if (savedDate !== today) {
      // Clear old data if it's a new day
      localStorage.removeItem("sample_game_date");
      localStorage.removeItem("sample_game_status");
    }
  }, []);

  const handleSuccess = () => {
    const today = new Date().toISOString().split("T")[0];
    setGameStatus("success");
    localStorage.setItem("sample_game_date", today);
    localStorage.setItem("sample_game_status", "success");
  };

  const handleDefeat = () => {
    const today = new Date().toISOString().split("T")[0];
    setGameStatus("defeat");
    localStorage.setItem("sample_game_date", today);
    localStorage.setItem("sample_game_status", "defeat");
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen onRetry={fetchData} />;
  }

  if (!data || !data.Question) {
    return <ErrorScreen onRetry={fetchData} />;
  }

  // Playing state - show game input
  if (gameStatus === "playing") {
    return (
      <main className="min-h-screen">
        <VinylHero
          title={`${data.Question.artista} - ${data.Question.nombre}`}
          showInput={true}
          linkText={`${data.Question.artista} - ${data.Question.nombre}`}
          linkUrl={data.Question.urlYT}
          videoId={data.Question.urlYT}
          data={data}
          onSuccess={handleSuccess}
          onDefeat={handleDefeat}
        />
      </main>
    );
  }

  // Success state
  if (gameStatus === "success") {
    return (
      <main className="min-h-screen">
        <VinylHero
          title="ÉXITO"
          titleColor="text-green-500"
          videoId={null}
          showInput={false}
          linkText="VER RESPUESTA"
          linkUrl={data.Question.sampling_url}
          data={data}
          message={
            <>
              Seguis teniendo el don Jose, sos una crack, te amo eternamente
              <br />
              feliz aniversario !! &lt;3&lt;3&lt;3&lt;3&lt;3
            </>
          }
        />
        <CountdownTimer />
      </main>
    );
  }

  // Defeat state
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
        message="Washed??? Joda seguis teniendo el don, proba mañana, te amo muchisimo, sos el amor de mi vida, feliz aniversario!!"
      />
      <CountdownTimer />
    </main>
  );
}
