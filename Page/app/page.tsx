"use client";

import { useEffect, useState } from "react";
import VinylHero from "@/components/vinyl-hero";
import LoadingScreen from "@/components/loading-screen";
import ErrorScreen from "@/components/error-screen";
import CountdownTimer from "@/components/countdown-timer";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { getDailyRandom } from "@/service";

type GameStatus = "playing" | "success" | "defeat";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [errorCount, setErrorCount] = useState(0);
  const [attemptDetails, setAttemptDetails] = useState<Array<{ type: 'wrong' | 'artist-match' }>>([]);
  const [copied, setCopied] = useState(false);

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
    const savedErrorCount = localStorage.getItem("sample_error_count");
    const savedAttemptDetails = localStorage.getItem("sample_attempt_details");
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // If saved date matches today and we have a status, restore it
    if (savedDate === today && savedStatus) {
      setGameStatus(savedStatus as GameStatus);
      if (savedErrorCount) {
        setErrorCount(parseInt(savedErrorCount, 10));
      }
      if (savedAttemptDetails) {
        setAttemptDetails(JSON.parse(savedAttemptDetails));
      }
    } else if (savedDate !== today) {
      // Clear old data if it's a new day
      localStorage.removeItem("sample_game_date");
      localStorage.removeItem("sample_game_status");
      localStorage.removeItem("sample_error_count");
      localStorage.removeItem("sample_attempt_details");
    }
  }, []);

  const handleSuccess = (errors: number, details: Array<{ type: 'wrong' | 'artist-match' }>) => {
    const today = new Date().toISOString().split("T")[0];
    setGameStatus("success");
    setErrorCount(errors);
    setAttemptDetails(details);
    localStorage.setItem("sample_game_date", today);
    localStorage.setItem("sample_game_status", "success");
    localStorage.setItem("sample_error_count", errors.toString());
    localStorage.setItem("sample_attempt_details", JSON.stringify(details));
  };

  const handleDefeat = () => {
    const today = new Date().toISOString().split("T")[0];
    setGameStatus("defeat");
    localStorage.setItem("sample_game_date", today);
    localStorage.setItem("sample_game_status", "defeat");
  };

  const handleCopyResults = async () => {
    const emojiScore = attemptDetails.map(a => a.type === 'artist-match' ? '🟡' : '🔴').join('') + '🟢';
    const message = `¡Acerté en Sample!
${emojiScore}

Jugá en: https://lucasdesmery.github.io/Sample/`;

    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
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
              <CountdownTimer />
              <div className="mt-6 flex justify-center items-center gap-3">
                <div className="flex items-center gap-2 text-4xl">
                  {attemptDetails.map((attempt, i) => (
                    <span key={i}>{attempt.type === 'artist-match' ? '🟠' : '🔴'}</span>
                  ))}
                  <span>🟢</span>
                </div>
                <Button
                  onClick={handleCopyResults}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-white/20 hover:bg-white/10"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <div className="mt-6">
                Seguis teniendo el don Jose, sos una crack, te amo eternamente
                <br />
                feliz aniversario !! &lt;3&lt;3&lt;3&lt;3&lt;3
              </div>
            </>
          }
        />
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
        message={
          <>
            <CountdownTimer />
            <div className="mt-6">
              Washed??? Joda seguis teniendo el don, proba mañana, te amo muchisimo, sos el amor de mi vida, feliz aniversario!!
            </div>
          </>
        }
      />
    </main>
  );
}
