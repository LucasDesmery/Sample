import React from 'react';

export default function LoadingScreen() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">
            <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-4 bg-neutral-900 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Cargando...</h2>
            <p className="text-neutral-400 text-center max-w-md px-4">
                Si es la primera vez que entras hoy, esto puede tardar unos segundos mientras despertamos al servidor.
            </p>
        </div>
    );
}
