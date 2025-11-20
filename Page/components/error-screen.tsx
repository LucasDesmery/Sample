import React from 'react';

interface ErrorScreenProps {
    onRetry: () => void;
}

export default function ErrorScreen({ onRetry }: ErrorScreenProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 text-red-500"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Algo salió mal</h2>
            <p className="text-neutral-400 text-center max-w-md px-4 mb-8">
                No pudimos conectar con el servidor. Por favor, intenta de nuevo.
            </p>
            <button
                onClick={onRetry}
                className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors"
            >
                Reintentar
            </button>
        </div>
    );
}
