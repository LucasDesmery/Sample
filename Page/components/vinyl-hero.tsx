"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, HelpCircle, ChevronsUpDown, Check } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DailyRandomData {
  date: string;
  Question: {
    id: number;
    answer_id: number;
    artista: string;
    nombre: string;
    sampling_url: string;
    urlYT: string;
  };
  Answer: {
    id: number;
    song_title: string;
    artist_name: string;
    urlYT?: string;
  };
}

interface VinylHeroProps {
  title?: string;
  titleColor?: string;
  showInput?: boolean;
  linkText?: string;
  linkUrl?: string;
  videoId?: string | null;
  data?: DailyRandomData;
}

const availableSongs = [
  { value: "hyperborea-biosphere", label: "Hyperborea - Biosphere" },
  { value: "creep-radiohead", label: "Creep - Radiohead" },
  { value: "rubber-ring-johnny-marr", label: "Rubber Ring - Johnny Marr" },
  { value: "walk-on-the-wild-side-david-bowie", label: "Walk on the Wild Side - David Bowie" },
  { value: "the-third-planet-biosphere", label: "The Third Planet - Biosphere" },
  { value: "idioteque-radiohead", label: "Idioteque - Radiohead" },
  { value: "everything-in-its-right-place-radiohead", label: "Everything in Its Right Place - Radiohead" },
  { value: "no-surprises-radiohead", label: "No Surprises - Radiohead" },
  { value: "optimistic-radiohead", label: "Optimistic - Radiohead" },
  { value: "climbing-up-the-walls-radiohead", label: "Climbing Up the Walls - Radiohead" },
  { value: "let-down-radiohead", label: "Let Down - Radiohead" },
  { value: "paranoid-android-radiohead", label: "Paranoid Android - Radiohead" },
  { value: "street-spirit-fade-out-radiohead", label: "Street Spirit (Fade Out) - Radiohead" },
  { value: "you-and-whose-army-radiohead", label: "You and Whose Army? - Radiohead" },
  { value: "asleep-johnny-marr", label: "Asleep - Johnny Marr" },
  { value: "girlfriend-in-a-coma-johnny-marr", label: "Girlfriend in a Coma - Johnny Marr" },
  { value: "getting-away-with-it-johnny-marr", label: "Getting Away With It - Johnny Marr" },
  { value: "under-pressure-david-bowie", label: "Under Pressure - David Bowie" },
  { value: "lets-dance-david-bowie", label: "Let's Dance - David Bowie" },
  { value: "fame-david-bowie", label: "Fame - David Bowie" },
  { value: "heroes-david-bowie", label: "Heroes - David Bowie" },
  { value: "space-oddity-david-bowie", label: "Space Oddity - David Bowie" },
  { value: "starman-david-bowie", label: "Starman - David Bowie" },
  { value: "the-passenger-david-bowie", label: "The Passenger - David Bowie" },
  { value: "nightclubbing-david-bowie", label: "Nightclubbing - David Bowie" },
  { value: "ashes-to-ashes-david-bowie", label: "Ashes to Ashes - David Bowie" },
  { value: "evil-interpol", label: "Evil - Interpol" },
  { value: "head-in-the-ceiling-fan-title-fight", label: "Head in the Ceiling Fan - Title Fight" },
  { value: "numb-but-i-still-feel-it-title-fight", label: "Numb, but I Still Feel It - Title Fight" },
  { value: "safe-in-your-skin-title-fight", label: "Safe in Your Skin - Title Fight" },
  { value: "where-am-i-title-fight", label: "Where Am I? - Title Fight" },
  { value: "like-a-ritual-title-fight", label: "Like a Ritual - Title Fight" },
  { value: "your-pain-is-mine-now-title-fight", label: "Your Pain Is Mine Now - Title Fight" },
  { value: "de-msica-ligera-soda-stereo", label: "De Música Ligera - Soda Stereo" },
  { value: "perdonar-es-divino-gustavo-cerati", label: "Perdonar Es Divino - Gustavo Cerati" },
  { value: "back-to-life-willy-crook", label: "Back to Life - Willy Crook" },
  { value: "la-bestia-pop-patricio-rey-y-sus-redonditos-de-ricota", label: "La Bestia Pop - Patricio Rey y sus Redonditos de Ricota" },
  { value: "masacre-en-el-puticlub-patricio-rey-y-sus-redonditos-de-ricota", label: "Masacre en El Puticlub - Patricio Rey y sus Redonditos de Ricota" },
  { value: "am-fri-frufi-fali-fru-patricio-rey-y-sus-redonditos-de-ricota", label: "Ñam Fri Frufi Fali Fru - Patricio Rey y sus Redonditos de Ricota" },
  { value: "luzbelito-y-las-sirenas-patricio-rey-y-sus-redonditos-de-ricota", label: "Luzbelito Y Las Sirenas - Patricio Rey y sus Redonditos de Ricota" },
  { value: "el-pibe-de-los-astilleros-patricio-rey-y-sus-redonditos-de-ricota", label: "El Pibe De Los Astilleros - Patricio Rey y sus Redonditos de Ricota" },
  { value: "el-arte-del-buen-comer-patricio-rey-y-sus-redonditos-de-ricota", label: "El Arte Del Buen Comer - Patricio Rey y sus Redonditos de Ricota" },
  { value: "una-piba-con-la-remera-de-greenpeace-patricio-rey-y-sus-redonditos-de-ricota", label: "Una Piba Con La Remera De Greenpeace... - Patricio Rey y sus Redonditos de Ricota" },
  { value: "salir-a-asustar-divididos", label: "Salir a Asustar - Divididos" },
  { value: "el-farolito-los-piojos", label: "El Farolito - Los Piojos" },
  { value: "lamento-boliviano-los-enanitos-verdes", label: "Lamento Boliviano - Los Enanitos Verdes" },
  { value: "la-muralla-verde-los-enanitos-verdes", label: "La Muralla Verde - Los Enanitos Verdes" },
  { value: "amores-lejanos-los-enanitos-verdes", label: "Amores Lejanos - Los Enanitos Verdes" },
  { value: "astoria-andrs-calamaro", label: "Astoria - Andrés Calamaro" },
  { value: "flaca-andrs-calamaro", label: "Flaca - Andrés Calamaro" },
  { value: "para-siempre-andrs-calamaro", label: "Para Siempre - Andrés Calamaro" },
  { value: "una-vela-quilmes-rock-2003-intoxicados", label: "Una Vela (Quilmes Rock 2003) - Intoxicados" },
  { value: "una-vela-intoxicados", label: "Una Vela - Intoxicados" },
  { value: "nunca-quise-intoxicados", label: "Nunca Quise - Intoxicados" },
  { value: "tango-en-segunda-sui-generis", label: "Tango en Segunda - Sui Generis" },
  { value: "las-increbles-aventuras-del-seor-tijeras-sui-generis", label: "Las Increíbles Aventuras Del Señor Tijeras - Sui Generis" },
  { value: "pecados-para-dos-virus", label: "Pecados Para Dos - Virus" },
  { value: "una-luna-de-miel-en-la-mano-virus", label: "Una Luna De Miel en La Mano - Virus" },
  { value: "last-christmas-wham", label: "Last Christmas - Wham!" },
  { value: "everything-she-wants-wham", label: "Everything She Wants - Wham!" },
  { value: "wake-me-up-before-you-go-go-wham", label: "Wake Me Up Before You Go-Go - Wham!" },
  { value: "freedom-wham", label: "Freedom - Wham!" },
  { value: "club-tropicana-wham", label: "Club Tropicana - Wham!" },
  { value: "im-your-man-wham", label: "I'm Your Man - Wham!" },
  { value: "wham-rap-enjoy-what-you-do-wham", label: "Wham Rap! (Enjoy What You Do) - Wham!" },
  { value: "young-guns-go-for-it-wham", label: "Young Guns (Go for It) - Wham!" },
  { value: "the-edge-of-heaven-wham", label: "The Edge of Heaven - Wham!" },
  { value: "la-rubia-tarada-sumo", label: "La Rubia Tarada - Sumo" },
  { value: "que-me-pisen-sumo", label: "Que Me Pisen - Sumo" },
  { value: "mejor-no-hablar-de-ciertas-cosas-sumo", label: "Mejor No Hablar De Ciertas Cosas - Sumo" },
  { value: "white-trash-sumo", label: "White Trash - Sumo" },
  { value: "bzrp-music-sessions-9-dillom", label: "BZRP Music Sessions #9 - Dillom" },
  { value: "agosto-en-tucumn-mercedes-sosa", label: "Agosto en Tucumán - Mercedes Sosa" },
  { value: "hasta-la-victoria-mercedes-sosa", label: "Hasta La Victoria - Mercedes Sosa" },
  { value: "juanito-laguna-remonta-un-barrilete-mercedes-sosa", label: "Juanito Laguna Remonta Un Barrilete - Mercedes Sosa" },
  { value: "la-maza-mercedes-sosa", label: "La Maza - Mercedes Sosa" },
  { value: "alfonsina-y-el-mar-mercedes-sosa", label: "Alfonsina Y El Mar - Mercedes Sosa" },
  { value: "volver-a-los-17-mercedes-sosa", label: "Volver a Los 17 - Mercedes Sosa" },
  { value: "la-trama-y-el-desenlace-jorge-drexler", label: "La Trama Y El Desenlace - Jorge Drexler" },
  { value: "sacar-la-voz-jorge-drexler", label: "Sacar La Voz - Jorge Drexler" },
  { value: "la-edad-del-cielo-jorge-drexler", label: "La Edad Del Cielo - Jorge Drexler" },
  { value: "a-estos-hombres-tristes-almendra", label: "A Estos Hombres Tristes - Almendra" },
  { value: "fermn-almendra", label: "Fermín - Almendra" },
  { value: "que-el-viento-borr-tus-manos-almendra", label: "Que El Viento Borró Tus Manos - Almendra" },
  { value: "muchacha-ojos-de-papel-almendra", label: "Muchacha (Ojos De Papel) - Almendra" },
  { value: "hielo-en-la-ciudad-almendra", label: "Hielo en La Ciudad - Almendra" },
  { value: "plegaria-para-un-nio-dormido-almendra", label: "Plegaria Para Un Niño Dormido - Almendra" },
  { value: "ana-no-duerme-almendra", label: "Ana No Duerme - Almendra" },
  { value: "para-ir-almendra", label: "Para Ir - Almendra" },
  { value: "final-almendra", label: "Final - Almendra" },
  { value: "desconfio-pappos-blues", label: "Desconfio - Pappo's Blues" },
  { value: "tren-al-sur-gustavo-santaolalla", label: "Tren Al Sur - Gustavo Santaolalla" },
  { value: "bibo-no-aozoraendless-flightbabel-gustavo-santaolalla", label: "Bibo No Aozora/Endless Flight/Babel - Gustavo Santaolalla" },
  { value: "la-camisa-negra-gustavo-santaolalla", label: "La Camisa Negra - Gustavo Santaolalla" },
  { value: "de-usuahia-a-la-quiaca-gustavo-santaolalla", label: "De Usuahia a La Quiaca - Gustavo Santaolalla" },
  { value: "pachuco-gustavo-santaolalla", label: "Pachuco - Gustavo Santaolalla" },
  { value: "de-ushuaia-la-quiaca-gustavo-santaolalla", label: "De Ushuaia La Quiaca - Gustavo Santaolalla" },
  { value: "can-emptiness-be-filled-gustavo-santaolalla", label: "Can Emptiness Be Filled - Gustavo Santaolalla" },
  { value: "left-behind-together-gustavo-santaolalla", label: "Left Behind (Together) - Gustavo Santaolalla" },
  { value: "a-dios-le-pido-gustavo-santaolalla", label: "A Dios Le Pido - Gustavo Santaolalla" },
  { value: "remember-me-do-natalia-lafourcade", label: "Remember Me (Dúo) - Natalia Lafourcade" },
  { value: "otra-vez-natalia-lafourcade", label: "Otra Vez - Natalia Lafourcade" },
  { value: "para-qu-sufrir-cover-audio-natalia-lafourcade", label: "Para Qué Sufrir (Cover Audio) - Natalia Lafourcade" },
  { value: "hasta-la-raz-natalia-lafourcade", label: "Hasta La Raíz - Natalia Lafourcade" },
  { value: "amame-peterib-pescado-rabioso", label: "Amame Peteribí - Pescado Rabioso" },
  { value: "cementerio-club-pescado-rabioso", label: "Cementerio Club - Pescado Rabioso" },
  { value: "post-crucifixin-pescado-rabioso", label: "Post-Crucifixión - Pescado Rabioso" },
  { value: "me-voy-julieta-venegas", label: "Me Voy - Julieta Venegas" },
  { value: "eres-para-mi-julieta-venegas", label: "Eres Para Mi - Julieta Venegas" },
  { value: "lento-julieta-venegas", label: "Lento - Julieta Venegas" },
  { value: "omens-of-love-luis-alberto-spinetta", label: "Omens of Love - Luis Alberto Spinetta" },
  { value: "cementerio-club-luis-alberto-spinetta", label: "Cementerio Club - Luis Alberto Spinetta" },
  { value: "fermn-luis-alberto-spinetta", label: "Fermín - Luis Alberto Spinetta" },
  { value: "post-crucifixin-luis-alberto-spinetta", label: "Post-Crucifixión - Luis Alberto Spinetta" },
  { value: "como-un-perro-luis-alberto-spinetta", label: "Como Un Perro - Luis Alberto Spinetta" },
  { value: "viento-del-azur-luis-alberto-spinetta", label: "Viento Del Azur - Luis Alberto Spinetta" },
  { value: "viejas-mascarillas-luis-alberto-spinetta", label: "Viejas Mascarillas - Luis Alberto Spinetta" },
  { value: "las-habladuras-del-mundo-luis-alberto-spinetta", label: "Las Habladurías Del Mundo - Luis Alberto Spinetta" },
  { value: "la-mano-de-dios-rodrigo", label: "La Mano De Dios - Rodrigo" },
  { value: "lo-mejor-del-amor-rodrigo", label: "Lo Mejor Del Amor - Rodrigo" },
  { value: "como-le-digo-rodrigo", label: "Como Le Digo - Rodrigo" },
  { value: "ocho-cuarenta-rodrigo", label: "Ocho Cuarenta - Rodrigo" },
  { value: "cherry-coloured-funk-cocteau-twins", label: "Cherry Coloured Funk - Cocteau Twins" },
  { value: "heaven-or-las-vegas-cocteau-twins", label: "Heaven or Las Vegas - Cocteau Twins" },
  { value: "lorelei-cocteau-twins", label: "Lorelei - Cocteau Twins" },
  { value: "beatrix-cocteau-twins", label: "Beatrix - Cocteau Twins" },
  { value: "alice-cocteau-twins", label: "Alice - Cocteau Twins" },
  { value: "frou-frou-foxes-in-midsummer-fires-cocteau-twins", label: "Frou-frou Foxes in Midsummer Fires - Cocteau Twins" },
  { value: "fifty-fifty-clown-cocteau-twins", label: "Fifty-Fifty Clown - Cocteau Twins" },
  { value: "saoko-rosala", label: "SAOKO - ROSALÍA" },
  { value: "con-altura-rosala", label: "Con Altura - ROSALÍA" },
  { value: "money-lisa", label: "MONEY - LISA" },
  { value: "lalisa-lisa", label: "LALISA - LISA" },
  { value: "rockstar-lisa", label: "Rockstar - LISA" },
  { value: "new-woman-lisa", label: "New Woman - LISA" },
  { value: "hold-my-liquor-arca", label: "Hold My Liquor - Arca" },
  { value: "send-it-up-arca", label: "Send It Up - Arca" },
  { value: "feminine-arca", label: "Feminine - Arca" },
  { value: "lionsong-arca", label: "Lionsong - Arca" },
  { value: "arca", label: "@@@@@ - Arca" },
  { value: "tears-in-the-club-arca", label: "Tears in the Club - Arca" },
  { value: "suicide-doors-arca", label: "Suicide Doors - Arca" },
  { value: "la-femme-dargent-air", label: "La Femme D'Argent - Air" },
  { value: "sexy-boy-air", label: "Sexy Boy - Air" },
  { value: "all-i-need-air", label: "All I Need - Air" },
  { value: "les-professionnels-air", label: "Les Professionnels - Air" },
  { value: "alone-in-kyoto-air", label: "Alone in Kyoto - Air" },
  { value: "le-soleil-est-prs-de-moi-air", label: "Le Soleil Est Près De Moi - Air" },
  { value: "remember-air", label: "Remember - Air" },
  { value: "playground-love-air", label: "Playground Love - Air" },
  { value: "chamber-of-reflection-mac-demarco", label: "Chamber of Reflection - Mac DeMarco" },
  { value: "on-the-level-mac-demarco", label: "On the Level - Mac DeMarco" },
  { value: "another-one-mac-demarco", label: "Another One - Mac DeMarco" },
  { value: "moonlight-on-the-river-mac-demarco", label: "Moonlight on the River - Mac DeMarco" },
  { value: "kiss-of-life-sade", label: "Kiss of Life - Sade" },
  { value: "is-it-a-crime-sade", label: "Is It a Crime - Sade" },
  { value: "like-a-tattoo-sade", label: "Like a Tattoo - Sade" },
  { value: "smooth-operator-sade", label: "Smooth Operator - Sade" },
  { value: "jezebel-sade", label: "Jezebel - Sade" },
  { value: "the-sweetest-taboo-sade", label: "The Sweetest Taboo - Sade" },
  { value: "cherish-the-day-sade", label: "Cherish the Day - Sade" },
  { value: "pearls-sade", label: "Pearls - Sade" },
  { value: "i-will-be-your-friend-sade", label: "I Will Be Your Friend - Sade" },
  { value: "fear-sade", label: "Fear - Sade" },
  { value: "eyes-without-a-face-billy-idol", label: "Eyes Without a Face - Billy Idol" },
  { value: "white-wedding-billy-idol", label: "White Wedding - Billy Idol" },
  { value: "rebel-yell-billy-idol", label: "Rebel Yell - Billy Idol" },
  { value: "dancing-with-myself-billy-idol", label: "Dancing With Myself - Billy Idol" },
  { value: "mony-mony-billy-idol", label: "Mony Mony - Billy Idol" },
  { value: "flesh-for-fantasy-billy-idol", label: "Flesh for Fantasy - Billy Idol" },
  { value: "heroin-billy-idol", label: "Heroin - Billy Idol" },
  { value: "glory-box-portishead", label: "Glory Box - Portishead" },
  { value: "sour-times-portishead", label: "Sour Times - Portishead" },
  { value: "strangers-portishead", label: "Strangers - Portishead" },
  { value: "numb-portishead", label: "Numb - Portishead" },
  { value: "wandering-star-portishead", label: "Wandering Star - Portishead" },
  { value: "only-you-portishead", label: "Only You - Portishead" },
  { value: "biscuit-portishead", label: "Biscuit - Portishead" },
  { value: "machine-gun-portishead", label: "Machine Gun - Portishead" },
  { value: "roads-portishead", label: "Roads - Portishead" },
  { value: "humming-portishead", label: "Humming - Portishead" },
  { value: "silver-soul-beach-house", label: "Silver Soul - Beach House" },
  { value: "master-of-none-beach-house", label: "Master of None - Beach House" },
  { value: "gila-beach-house", label: "Gila - Beach House" },
  { value: "space-song-beach-house", label: "Space Song - Beach House" },
  { value: "new-year-beach-house", label: "New Year - Beach House" },
  { value: "lemon-glow-beach-house", label: "LEMON GLOW - Beach House" },
  { value: "other-people-beach-house", label: "Other People - Beach House" },
  { value: "myth-beach-house", label: "Myth - Beach House" },
  { value: "walk-in-the-park-beach-house", label: "Walk in the Park - Beach House" },
  { value: "apple-orchard-beach-house", label: "Apple Orchard - Beach House" },
  { value: "cracking-crumb", label: "Cracking - Crumb" },
  { value: "locket-crumb", label: "Locket - Crumb" },
  { value: "for-the-damaged-coda-blonde-redhead", label: "For the Damaged Coda - Blonde Redhead" },
  { value: "in-particular-blonde-redhead", label: "In Particular - Blonde Redhead" },
  { value: "for-the-damage-blonde-redhead", label: "For the Damage - Blonde Redhead" },
  { value: "tons-confession-blonde-redhead", label: "Tons Confession - Blonde Redhead" },
  { value: "misery-is-a-butterfly-blonde-redhead", label: "Misery Is a Butterfly - Blonde Redhead" },
  { value: "love-or-prison-blonde-redhead", label: "Love or Prison - Blonde Redhead" },
  { value: "falling-man-blonde-redhead", label: "Falling Man - Blonde Redhead" },
  { value: "weak-for-your-love-thee-sacred-souls", label: "Weak for Your Love - Thee Sacred Souls" },
  { value: "can-i-call-you-rose-thee-sacred-souls", label: "Can I Call You Rose? - Thee Sacred Souls" },
  { value: "future-lover-thee-sacred-souls", label: "Future Lover - Thee Sacred Souls" },
  { value: "saudade-vem-correndo-stan-getz", label: "Saudade Vem Correndo - Stan Getz" },
  { value: "the-peacocks-stan-getz", label: "The Peacocks - Stan Getz" },
  { value: "the-girl-from-ipanema-stan-getz", label: "The Girl From Ipanema - Stan Getz" },
  { value: "samba-triste-stan-getz", label: "Samba Triste - Stan Getz" },
  { value: "keep-dreamin-stan-getz", label: "Keep Dreamin' - Stan Getz" },
  { value: "moonlight-in-vermont-stan-getz", label: "Moonlight in Vermont - Stan Getz" },
  { value: "five-hundred-miles-high-stan-getz", label: "Five Hundred Miles High - Stan Getz" },
  { value: "manha-de-carnival-stan-getz", label: "Manha De Carnival - Stan Getz" },
  { value: "corcovado-getzgilberto-version-stan-getz", label: "Corcovado (Getz/Gilberto Version) - Stan Getz" },
  { value: "samba-de-uma-nota-so-stan-getz", label: "Samba De Uma Nota So - Stan Getz" },
  { value: "lovefool-the-cardigans", label: "Lovefool - The Cardigans" },
  { value: "my-favourite-game-the-cardigans", label: "My Favourite Game - The Cardigans" },
  { value: "explode-the-cardigans", label: "Explode - The Cardigans" },
  { value: "eraserewind-the-cardigans", label: "Erase/Rewind - The Cardigans" },
  { value: "ngel-de-los-perdedores-el-soldado", label: "Ángel De Los Perdedores - El Soldado" },
  { value: "baker-street-gerry-rafferty", label: "Baker Street - Gerry Rafferty" },
  { value: "stuck-in-the-middle-with-you-gerry-rafferty", label: "Stuck in the Middle With You - Gerry Rafferty" },
  { value: "right-down-the-line-gerry-rafferty", label: "Right Down the Line - Gerry Rafferty" },
  { value: "new-street-blues-gerry-rafferty", label: "New Street Blues - Gerry Rafferty" },
  { value: "somethings-got-a-hold-on-me-etta-james", label: "Something's Got a Hold on Me - Etta James" },
  { value: "my-funny-valentine-etta-james", label: "My Funny Valentine - Etta James" },
  { value: "id-rather-go-blind-etta-james", label: "I'd Rather Go Blind - Etta James" },
  { value: "at-last-etta-james", label: "At Last - Etta James" },
  { value: "dont-cry-baby-etta-james", label: "Don't Cry Baby - Etta James" },
  { value: "stlouis-blues-etta-james", label: "St.Louis Blues - Etta James" },
  { value: "tell-mama-etta-james", label: "Tell Mama - Etta James" },
  { value: "fu-gee-la-fugees", label: "Fu-Gee-La - Fugees" },
  { value: "killing-me-softly-fugees", label: "Killing Me Softly - Fugees" },
  { value: "how-many-mics-fugees", label: "How Many Mics - Fugees" },
  { value: "nappy-heads-remix-fugees", label: "Nappy Heads (Remix) - Fugees" },
  { value: "rumble-in-the-jungle-fugees", label: "Rumble in the Jungle - Fugees" },
  { value: "daydreamin-jill-scott", label: "Daydreamin' - Jill Scott" },
  { value: "he-loves-me-lyzel-in-e-flat-jill-scott", label: "He Loves Me (Lyzel in E Flat) - Jill Scott" },
  { value: "golden-jill-scott", label: "Golden - Jill Scott" },
  { value: "slowly-surely-jill-scott", label: "Slowly Surely - Jill Scott" },
  { value: "a-long-walk-jill-scott", label: "A Long Walk - Jill Scott" },
  { value: "love-rain-jill-scott", label: "Love Rain - Jill Scott" },
  { value: "watching-me-jill-scott", label: "Watching Me - Jill Scott" },
  { value: "real-gangsta-love-trueno", label: "REAL GANGSTA LOVE - Trueno" },
  { value: "faithful-bilal", label: "Faithful - Bilal" },
  { value: "institutionalized-bilal", label: "Institutionalized - Bilal" },
  { value: "forever-begins-bilal", label: "Forever Begins - Bilal" },
  { value: "forget-lianne-la-havas", label: "Forget - Lianne La Havas" },
  { value: "ghost-lianne-la-havas", label: "Ghost - Lianne La Havas" },
  { value: "is-your-love-big-enough-lianne-la-havas", label: "Is Your Love Big Enough? - Lianne La Havas" },
  { value: "please-dont-make-me-cry-lianne-la-havas", label: "Please Don’t Make Me Cry - Lianne La Havas" },
  { value: "balloon-tyler-the-creator", label: "Balloon - Tyler, The Creator" },
  { value: "what-a-day-tyler-the-creator", label: "WHAT a DAY - Tyler, The Creator" },
  { value: "maiden-voyage-everything-in-its-right-place-robert-glasper", label: "Maiden Voyage / Everything in Its Right Place - Robert Glasper" },
  { value: "no-wrong-no-right-robert-glasper", label: "No Wrong No Right - Robert Glasper" },
  { value: "for-you-robert-glasper", label: "For You - Robert Glasper" },
  { value: "wesleys-theory-thundercat", label: "Wesley's Theory - Thundercat" },
  { value: "them-changes-thundercat", label: "Them Changes - Thundercat" },
  { value: "complexion-a-zulu-love-thundercat", label: "Complexion (A Zulu Love) - Thundercat" },
  { value: "after-last-night-thundercat", label: "After Last Night - Thundercat" },
  { value: "xxx-kendrick-lamar", label: "XXX. - Kendrick Lamar" },
  { value: "bitch-dont-kill-my-vibe-kendrick-lamar", label: "Bitch, Don't Kill My Vibe - Kendrick Lamar" },
  { value: "ruido-de-magia-invisible", label: "Ruido De Magia - Invisible" },
  { value: "en-una-lejana-playa-del-animus-invisible", label: "En Una Lejana Playa Del Animus - Invisible" },
  { value: "los-libros-de-la-buena-memoria-invisible", label: "Los Libros De La Buena Memoria - Invisible" },
  { value: "pleamar-de-aguilas-invisible", label: "Pleamar De Aguilas - Invisible" },
  { value: "a-journey-invisible", label: "A Journey - Invisible" },
  { value: "perdonado-nio-condenado-invisible", label: "Perdonado (Niño Condenado) - Invisible" },
  { value: "alarma-entre-los-ngeles-invisible", label: "Alarma Entre Los Ángeles - Invisible" },
  { value: "doscientos-aos-invisible", label: "Doscientos Años - Invisible" },
  { value: "see-you-again-kali-uchis", label: "See You Again - Kali Uchis" },
  { value: "10-kali-uchis", label: "10% - Kali Uchis" },
  { value: "lottery-kali-uchis", label: "Lottery - Kali Uchis" },
  { value: "muekita-kali-uchis", label: "Muñekita - Kali Uchis" },
  { value: "gotta-get-up-interlude-kali-uchis", label: "Gotta Get Up (Interlude) - Kali Uchis" },
  { value: "get-you-kali-uchis", label: "Get You - Kali Uchis" },
  { value: "telepata-kali-uchis", label: "Telepatía - Kali Uchis" },
  { value: "shut-up-my-moms-calling-hotel-ugly", label: "Shut Up My Moms Calling - Hotel Ugly" },
  { value: "the-less-i-know-the-better-tame-impala", label: "The Less I Know the Better - Tame Impala" },
  { value: "new-person-same-old-mistakes-tame-impala", label: "New Person, Same Old Mistakes - Tame Impala" },
  { value: "one-more-hour-tame-impala", label: "One More Hour - Tame Impala" },
  { value: "why-wont-you-make-up-your-mind-tame-impala", label: "Why Won't You Make Up Your Mind? - Tame Impala" },
  { value: "feels-like-we-only-go-backwards-tame-impala", label: "Feels Like We Only Go Backwards - Tame Impala" },
  { value: "let-it-happen-tame-impala", label: "Let It Happen - Tame Impala" },
  { value: "reality-in-motion-tame-impala", label: "Reality in Motion - Tame Impala" },
  { value: "intro-orion-sun", label: "Intro - Orion Sun" },
  { value: "mirage-orion-sun", label: "Mirage - Orion Sun" },
  { value: "pride-steve-lacy", label: "PRIDE. - Steve Lacy" },
  { value: "bad-habit-steve-lacy", label: "Bad Habit - Steve Lacy" },
  { value: "jet-fuel-steve-lacy", label: "Jet Fuel - Steve Lacy" },
  { value: "silkk-da-shocka-steve-lacy", label: "Silkk Da Shocka - Steve Lacy" },
  { value: "mistrio-do-planeta-novos-baianos", label: "Mistério Do Planeta - Novos Baianos" },
  { value: "a-menina-dana-novos-baianos", label: "A Menina Dança - Novos Baianos" },
  { value: "preciso-me-encontrar-cartola", label: "Preciso Me Encontrar - Cartola" },
  { value: "peito-vazio-cartola", label: "Peito Vazio - Cartola" },
  { value: "o-mundo-um-moinho-cartola", label: "O Mundo É Um Moinho - Cartola" },
  { value: "outono-rosa-passos", label: "Outono - Rosa Passos" },
  { value: "besame-mucho-rosa-passos", label: "Besame Mucho - Rosa Passos" },
  { value: "latinoamrica-maria-rita", label: "Latinoamérica - Maria Rita" },
  { value: "dos-gardenias-maria-rita", label: "Dos Gardenias - Maria Rita" },
  { value: "carolina-carol-bela-toquinho", label: "Carolina Carol Bela - Toquinho" },
  { value: "deixa-toquinho", label: "Deixa - Toquinho" },
  { value: "o-bem-amado-toquinho", label: "O Bem Amado - Toquinho" },
  { value: "eu-sei-que-vou-te-amar-toquinho", label: "Eu Sei Que Vou Te Amar - Toquinho" },
  { value: "tarde-em-itapoan-toquinho", label: "Tarde Em Itapoan - Toquinho" },
  { value: "o-dia-da-criaao-el-da-de-la-creacin-toquinho", label: "O Dia Da Criaçao (El Día De La Creación) - Toquinho" },
  { value: "testamento-toquinho", label: "Testamento - Toquinho" },
  { value: "escravo-da-alegria-toquinho", label: "Escravo Da Alegria - Toquinho" },
  { value: "ltimo-romance-los-hermanos", label: "Último Romance - Los Hermanos" },
  { value: "quetzal-los-hermanos", label: "Quetzal - Los Hermanos" },
  { value: "welcome-to-los-hermanos-los-hermanos", label: "Welcome to Los Hermanos - Los Hermanos" },
  { value: "ela-partiu-tim-maia", label: "Ela Partiu - Tim Maia" },
  { value: "eu-amo-voc-tim-maia", label: "Eu Amo Você - Tim Maia" },
  { value: "me-d-motivo-tim-maia", label: "Me Dê Motivo - Tim Maia" },
  { value: "o-caminho-do-bem-tim-maia", label: "O Caminho Do Bem - Tim Maia" },
  { value: "sossego-tim-maia", label: "Sossego - Tim Maia" },
  { value: "where-is-my-other-half-tim-maia", label: "Where Is My Other Half - Tim Maia" },
  { value: "contacto-com-o-mundo-racional-tim-maia", label: "Contacto Com O Mundo Racional - Tim Maia" },
  { value: "lets-have-a-ball-tonight-tim-maia", label: "Let's Have a Ball Tonight - Tim Maia" },
  { value: "que-beleza-tim-maia", label: "Que Beleza - Tim Maia" },
  { value: "azul-da-cr-do-mar-tim-maia", label: "Azul Da Côr Do Mar - Tim Maia" },
  { value: "vanguarda-o-terno", label: "Vanguarda? - O Terno" },
  { value: "trem-das-onze-adoniran-barbosa", label: "Trem Das Onze - Adoniran Barbosa" },
  { value: "despejo-na-favela-adoniran-barbosa", label: "Despejo Na Favela - Adoniran Barbosa" },
  { value: "tiro-ao-lvaro-adoniran-barbosa", label: "Tiro Ao Álvaro - Adoniran Barbosa" },
  { value: "joga-a-chave-adoniran-barbosa", label: "Joga a Chave - Adoniran Barbosa" },
  { value: "malemolencia-cu", label: "Malemolencia - Céu" },
  { value: "lenda-cu", label: "Lenda - Céu" },
  { value: "voc-me-vira-a-cabea-me-tira-do-srio-alcione", label: "Você Me Vira a Cabeça (Me Tira Do Sério) - Alcione" },
  { value: "pra-qu-negar-alcione", label: "Pra Quê Negar? - Alcione" },
  { value: "nzambi-muadiakime-alcione", label: "Nzambi / Muadiakime - Alcione" },
  { value: "no-deixe-o-samba-morrer-alcione", label: "Não Deixe O Samba Morrer - Alcione" },
  { value: "faz-uma-loucura-por-mim-alcione", label: "Faz Uma Loucura Por Mim - Alcione" },
  { value: "mandingueira-bid", label: "Mandingueira - BiD" },
  { value: "father-stretch-my-hands-pt-1-kanye-west", label: "Father Stretch My Hands Pt. 1 - Kanye West" },
  { value: "wats-wrong-isaiah-rashad", label: "Wat's Wrong - Isaiah Rashad" },
  { value: "i-shot-you-down-isaiah-rashad", label: "I Shot You Down - Isaiah Rashad" },
  { value: "heavenly-father-isaiah-rashad", label: "Heavenly Father - Isaiah Rashad" },
  { value: "smile-isaiah-rashad", label: "Smile - Isaiah Rashad" },
  { value: "knock-knock-mac-miller", label: "Knock Knock - Mac Miller" },
  { value: "kool-aid-and-frozen-pizza-mac-miller", label: "Kool Aid and Frozen Pizza - Mac Miller" },
  { value: "perfect-circle-god-speed-mac-miller", label: "Perfect Circle / God Speed - Mac Miller" },
  { value: "donald-trump-mac-miller", label: "Donald Trump - Mac Miller" },
  { value: "brackish-blvck-svm", label: "Brackish - Blvck Svm" },
  { value: "rara-vez-milo-j", label: "Rara Vez - Milo j" },
  { value: "blackout-nicki-nicole", label: "Blackout 🧊 - Nicki Nicole" },
  { value: "change-in-the-house-of-flies-deftones", label: "Change (In the House of Flies) - Deftones" },
  { value: "sextape-deftones", label: "Sextape - Deftones" },
  { value: "entombed-deftones", label: "Entombed - Deftones" },
  { value: "beauty-school-deftones", label: "Beauty School - Deftones" },
  { value: "my-own-summer-shove-it-deftones", label: "My Own Summer (Shove It) - Deftones" },
  { value: "around-the-fur-deftones", label: "Around the Fur - Deftones" },
  { value: "be-quiet-and-drive-far-away-deftones", label: "Be Quiet and Drive (Far Away) - Deftones" },
  { value: "cherry-waves-deftones", label: "Cherry Waves - Deftones" },
  { value: "all-smiles-over-here-the-garden", label: "All Smiles Over Here :) - The Garden" },
  { value: "good-morning-captain-slint", label: "Good Morning Captain - Slint" },
  { value: "eyes-of-a-stranger-julie", label: "Eyes of a Stranger - julie" },
  { value: "one-last-kiss-julie", label: "One Last Kiss - julie" },
  { value: "do-i-wanna-know-arctic-monkeys", label: "Do I Wanna Know? - Arctic Monkeys" },
  { value: "knee-socks-arctic-monkeys", label: "Knee Socks - Arctic Monkeys" },
  { value: "505-arctic-monkeys", label: "505 - Arctic Monkeys" },
  { value: "cornerstone-arctic-monkeys", label: "Cornerstone - Arctic Monkeys" },
  { value: "i-wanna-be-yours-arctic-monkeys", label: "I Wanna Be Yours - Arctic Monkeys" },
  { value: "r-u-mine-arctic-monkeys", label: "R U Mine? - Arctic Monkeys" },
  { value: "gloria-in-excelsis-deo-gloria-version-patti-smith", label: "Gloria: In Excelsis Deo / Gloria (Version) - Patti Smith" },
  { value: "elegie-patti-smith", label: "Elegie - Patti Smith" },
  { value: "free-money-patti-smith", label: "Free Money - Patti Smith" },
  { value: "stockholm-interview-patti-smith", label: "Stockholm Interview - Patti Smith" },
  { value: "deceptacon-le-tigre", label: "Deceptacon - Le Tigre" },
  { value: "phanta-le-tigre", label: "Phanta - Le Tigre" },
  { value: "happy-house-siouxsie-and-the-banshees", label: "Happy House - Siouxsie and the Banshees" },
  { value: "spellbound-siouxsie-and-the-banshees", label: "Spellbound - Siouxsie and the Banshees" },
  { value: "kiss-them-for-me-siouxsie-and-the-banshees", label: "Kiss Them for Me - Siouxsie and the Banshees" },
  { value: "cities-in-dust-siouxsie-and-the-banshees", label: "Cities in Dust - Siouxsie and the Banshees" },
  { value: "metal-postcard-mittageisen-siouxsie-and-the-banshees", label: "Metal Postcard (Mittageisen) - Siouxsie and the Banshees" },
  { value: "skin-siouxsie-and-the-banshees", label: "Skin - Siouxsie and the Banshees" },
  { value: "red-light-siouxsie-and-the-banshees", label: "Red Light - Siouxsie and the Banshees" },
  { value: "rebel-girl-bikini-kill", label: "Rebel Girl - Bikini Kill" },
  { value: "double-dare-ya-bikini-kill", label: "Double Dare Ya - Bikini Kill" },
  { value: "suck-my-left-one-bikini-kill", label: "Suck My Left One - Bikini Kill" },
  { value: "rip-bikini-kill", label: "R.I.P. - Bikini Kill" },
  { value: "pretend-were-dead-l7", label: "Pretend Were Dead - L7" },
  { value: "musical-fanzine-team-dresch", label: "Musical Fanzine - Team Dresch" },
  { value: "spoon-sonic-youth-mix-sonic-youth", label: "Spoon (Sonic Youth Mix) - Sonic Youth" },
  { value: "kool-thing-sonic-youth", label: "Kool Thing - Sonic Youth" },
  { value: "schizophrenia-sonic-youth", label: "Schizophrenia - Sonic Youth" },
  { value: "shadow-of-a-doubt-sonic-youth", label: "Shadow of a Doubt - Sonic Youth" },
  { value: "death-valley-69-sonic-youth", label: "Death Valley '69 - Sonic Youth" },
  { value: "one-beat-sleater-kinney", label: "One Beat - Sleater-Kinney" },
  { value: "boredom-buzzcocks", label: "Boredom - Buzzcocks" },
  { value: "everybodys-happy-nowadays-buzzcocks", label: "Everybody's Happy Nowadays - Buzzcocks" },
  { value: "what-do-i-get-buzzcocks", label: "What Do I Get? - Buzzcocks" },
  { value: "love-will-tear-us-apart-joy-division", label: "Love Will Tear Us Apart - Joy Division" },
  { value: "shes-lost-control-joy-division", label: "She's Lost Control - Joy Division" },
  { value: "atrocity-exhibition-joy-division", label: "Atrocity Exhibition - Joy Division" },
  { value: "disorder-joy-division", label: "Disorder - Joy Division" },
  { value: "new-dawn-fades-joy-division", label: "New Dawn Fades - Joy Division" },
  { value: "transmission-joy-division", label: "Transmission - Joy Division" },
  { value: "shadowplay-joy-division", label: "Shadowplay - Joy Division" },
  { value: "no-love-lost-joy-division", label: "No Love Lost - Joy Division" },
  { value: "warsaw-joy-division", label: "Warsaw - Joy Division" },
  { value: "sketch-artist-kim-gordon", label: "Sketch Artist - Kim Gordon" },
  { value: "love-like-anthrax-entertainment-version-gang-of-four", label: "Love Like Anthrax (Entertainment! Version) - Gang Of Four" },
  { value: "ether-gang-of-four", label: "Ether - Gang Of Four" },
  { value: "what-we-all-want-gang-of-four", label: "What We All Want - Gang Of Four" },
  { value: "love-like-anthrax-gang-of-four", label: "Love Like Anthrax - Gang Of Four" },
  { value: "damaged-goods-gang-of-four", label: "Damaged Goods - Gang Of Four" },
  { value: "is-it-love-gang-of-four", label: "Is It Love - Gang Of Four" },
  { value: "i-love-a-man-in-uniform-gang-of-four", label: "I Love a Man in Uniform - Gang Of Four" },
  { value: "sri-lanka-sex-hotel-the-dead-milkmen", label: "Sri Lanka Sex Hotel - The Dead Milkmen" },
  { value: "at-the-moment-the-dead-milkmen", label: "At the Moment - The Dead Milkmen" },
  { value: "blue-monday-new-order", label: "Blue Monday - New Order" },
  { value: "bizarre-love-triangle-new-order", label: "Bizarre Love Triangle - New Order" },
  { value: "confusion-pump-panel-reconstruction-mix-new-order", label: "Confusion (Pump Panel Reconstruction Mix) - New Order" },
  { value: "true-faith-new-order", label: "True Faith - New Order" },
  { value: "confusion-new-order", label: "Confusion - New Order" },
  { value: "temptation-new-order", label: "Temptation - New Order" },
  { value: "blue-monday-1988-new-order", label: "Blue Monday 1988 - New Order" },
  { value: "your-silent-face-new-order", label: "Your Silent Face - New Order" },
  { value: "toska-molchat-doma", label: "Toska - Molchat Doma" },
  { value: "lovesong-the-cure", label: "Lovesong - The Cure" },
  { value: "close-to-me-the-cure", label: "Close to Me - The Cure" },
  { value: "lullaby-the-cure", label: "Lullaby - The Cure" },
  { value: "lets-go-to-bed-the-cure", label: "Let's Go to Bed - The Cure" },
  { value: "1015-saturday-night-the-cure", label: "10:15 Saturday Night - The Cure" },
  { value: "a-forest-the-cure", label: "A Forest - The Cure" },
  { value: "just-like-heaven-the-cure", label: "Just Like Heaven - The Cure" },
  { value: "boys-dont-cry-the-cure", label: "Boys Don't Cry - The Cure" },
  { value: "the-lovecats-the-cure", label: "The Lovecats - The Cure" },
]

import { useRouter } from "next/navigation"

// ... (imports remain the same)

export default function VinylHero({
  title = "SAMPLE",
  titleColor = "text-white",
  videoId = "dQw4w9WgXcQ",
  showInput = true,
  linkText,
  linkUrl,
  data,
}: VinylHeroProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const router = useRouter()

  const [attempts, setAttempts] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!data) return

    const selectedSong = availableSongs.find((song) => song.value === value)
    const expectedLabel = `${data.Answer.song_title} - ${data.Answer.artist_name}`

    if (selectedSong && selectedSong.label === expectedLabel) {
      router.push("/exito")
    } else {
      // Add to attempts if not already there
      if (selectedSong && !attempts.includes(selectedSong.label)) {
        setAttempts((prev) => [...prev, selectedSong.label])
      }
      setValue("") // Clear input
    }
  }

  const getYoutubeId = (url: string | null | undefined) => {
    if (!url) return ""
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : url
  }

  const embedId = getYoutubeId(videoId)

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6">
        <h1 className={`text-4xl font-bold tracking-wider ${titleColor}`}>{title}</h1>
        <Button variant="ghost" size="icon" className="h-10 w-10 text-white hover:bg-white/10 border border-white/20">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Ayuda</span>
        </Button>
      </div>

      {/* Left Half Vinyl */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {/* Grooves effect */}
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-gray-700/20"
              style={{
                inset: `${i * 4}px`,
              }}
            />
          ))}

          {/* Center label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center shadow-xl">
            <div className="w-12 h-12 rounded-full bg-background border-4 border-gray-900" />
          </div>
        </div>
      </div>

      {/* Right Half Vinyl */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] pointer-events-none">
        <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-gray-900 via-gray-800 to-black">
          {/* Grooves effect */}
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-gray-700/20"
              style={{
                inset: `${i * 4}px`,
              }}
            />
          ))}

          {/* Center label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center shadow-xl">
            <div className="w-12 h-12 rounded-full bg-background border-4 border-gray-900" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="space-y-8">
            {/* YouTube Video Player */}
            {embedId && (
              <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-800 shadow-2xl bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${embedId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {showInput ? (
              <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
                <form onSubmit={handleSubmit} className="flex gap-3 w-full">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="flex-1 h-12 justify-between bg-card border-border text-foreground"
                      >
                        {value ? availableSongs.find((song) => song.value === value)?.label : "Selecciona una canción..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[600px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar canción..." />
                        <CommandList>
                          <CommandEmpty>Esa canción no está en la base de datos</CommandEmpty>
                          <CommandGroup>
                            {availableSongs.map((song) => (
                              <CommandItem
                                key={song.value}
                                value={song.value}
                                onSelect={(currentValue: string) => {
                                  setValue(currentValue === value ? "" : currentValue)
                                  setOpen(false)
                                }}
                              >
                                <Check
                                  className={cn("mr-2 h-4 w-4", value === song.value ? "opacity-100" : "opacity-0")}
                                />
                                {song.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <Button type="submit" size="icon" className="h-12 w-12 bg-gray-900 hover:bg-gray-800 text-white shrink-0">
                    <ArrowRight className="h-5 w-5" />
                    <span className="sr-only">Enviar</span>
                  </Button>
                </form>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => router.push("/derrota")}
                >
                  Rendirse
                </Button>
              </div>
            ) : (
              linkText &&
              linkUrl && (
                <div className="text-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold text-xl px-8 py-6"
                  >
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      {linkText}
                      <ArrowRight className="h-6 w-6" />
                    </a>
                  </Button>
                </div>
              )
            )}

            {/* Incorrect Attempts List */}
            {attempts.length > 0 && showInput && (
              <div className="mt-8 max-w-2xl mx-auto">
                <h3 className="text-red-500 font-semibold mb-4 text-center">Intentos fallidos:</h3>
                <ul className="space-y-2">
                  {attempts.map((attempt, index) => (
                    <li key={index} className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-red-200 flex items-center gap-2">
                      <span className="text-red-500">✕</span> {attempt}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
