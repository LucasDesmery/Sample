'use client';

import { useState, useEffect, useTransition } from 'react';
import { getPendingQuestion, submitReview, getReviewStats, type Question } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Check, X, Loader2 } from 'lucide-react';

export default function ReviewPage() {
    const [question, setQuestion] = useState<Question | null>(null);
    const [stats, setStats] = useState<{ total: number; reviewed: number; kept: number; remaining: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const loadData = async () => {
        setLoading(true);
        try {
            const [q, s] = await Promise.all([getPendingQuestion(), getReviewStats()]);
            setQuestion(q);
            setStats(s);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleReview = (status: number) => {
        if (!question) return;

        startTransition(async () => {
            await submitReview(question.id, status);
            await loadData();
        });
    };

    // Helper to extract YouTube ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading && !question) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!question) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-black text-white p-4">
                <h1 className="text-2xl font-bold mb-4">No more questions to review!</h1>
                <p>Great job.</p>
                {stats && (
                    <div className="mt-4 text-center text-gray-400">
                        <p>Total: {stats.total}</p>
                        <p>Reviewed: {stats.reviewed}</p>
                        <p>Kept: {stats.kept}</p>
                    </div>
                )}
            </div>
        );
    }

    const videoId = getYouTubeId(question.urlYT);

    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
            <div className="w-full max-w-4xl flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Data Review</h1>
                {stats && (
                    <div className="text-sm text-gray-400 flex gap-4">
                        <span>Remaining: {stats.remaining}</span>
                        <span>Kept: {stats.kept}</span>
                    </div>
                )}
            </div>

            <Card className="w-full max-w-3xl bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>{question.artista} - {question.nombre}</span>
                        <span className="text-xs text-gray-500">ID: {question.id}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    {/* Video Player */}
                    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden border border-zinc-800">
                        {videoId ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Invalid YouTube URL
                            </div>
                        )}
                    </div>

                    {/* Sampling URL */}
                    <div className="flex justify-center">
                        <a
                            href={question.sampling_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ExternalLink size={16} />
                            Open Sampling URL
                        </a>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-8 pb-8">
                    <Button
                        onClick={() => handleReview(0)}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-full w-32"
                    >
                        {isPending ? <Loader2 className="animate-spin" /> : <><X className="mr-2" /> NO</>}
                    </Button>

                    <Button
                        onClick={() => handleReview(1)}
                        disabled={isPending}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full w-32"
                    >
                        {isPending ? <Loader2 className="animate-spin" /> : <><Check className="mr-2" /> SI</>}
                    </Button>
                </CardFooter>
            </Card>

            <div className="mt-8 text-zinc-500 text-sm">
                <p>Keyboard shortcuts: Coming soon (Use mouse for now)</p>
            </div>
        </div>
    );
}
