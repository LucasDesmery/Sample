from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import requests
import time
import sqlite3



conn = sqlite3.connect(".venv/samples.db")
cursor = conn.cursor()

rock_top_100_slugs = [
    ("Nirvana", "Smells-Like-Teen-Spirit"),
    ("The-Killers", "Mr.-Brightside"),
    ("Radiohead", "Creep"),
    ("Nirvana", "Come-as-You-Are"),
    ("Gorillaz", "Feel-Good-Inc."),
    ("Coldplay", "Yellow"),
    ("Coldplay", "Viva-la-Vida"),
    ("Radiohead", "Karma-Police"),
    ("Radiohead", "No-Surprises"),
    ("Linkin-Park", "In-the-End"),
    ("System-of-a-Down", "Chop-Suey!"),
    ("Franz-Ferdinand", "Take-Me-Out"),
    ("Foo-Fighters", "Everlong"),
    ("Red-Hot-Chili-Peppers", "Californication"),
    ("Coldplay", "The-Scientist"),
    ("The-White-Stripes", "Seven-Nation-Army"),
    ("Linkin-Park", "Numb"),
    ("The-Killers", "Somebody-Told-Me"),
    ("Arctic-Monkeys", "Do-I-Wanna-Know?"),
    ("Arctic-Monkeys", "505"),
    ("Red-Hot-Chili-Peppers", "Under-the-Bridge"),
    ("Coldplay", "Clocks"),
    ("Kings-of-Leon", "Sex-on-Fire"),
    ("Muse", "Supermassive-Black-Hole"),
    ("Nirvana", "Lithium"),
    ("Oasis", "Wonderwall"),
    ("Tears-for-Fears", "Everybody-Wants-to-Rule-the-World"),
    ("Red-Hot-Chili-Peppers", "Scar-Tissue"),
    ("Guns-N%27-Roses", "Sweet-Child-o%27-Mine"),
    ("Katy-Perry", "I-Kissed-a-Girl"),
    ("Nirvana", "Heart-Shaped-Box"),
    ("Evanescence", "Bring-Me-to-Life"),
    ("The-Cranberries", "Zombie"),
    ("Arctic-Monkeys", "Why%27d-You-Only-Call-Me-When-You%27re-High?"),
    ("The-Police", "Every-Breath-You-Take"),
    ("Coldplay", "Fix-You"),
    ("Tame-Impala", "The-Less-I-Know-the-Better"),
    ("Paramore", "Misery-Business"),
    ("Gorillaz", "Clint-Eastwood"),
    ("Nirvana", "About-a-Girl"),
    ("Arctic-Monkeys", "I-Wanna-Be-Yours"),
    ("The-Strokes", "Reptilia"),
    ("Arctic-Monkeys", "Fluorescent-Adolescent"),
    ("System-of-a-Down", "Toxicity"),
    ("Red-Hot-Chili-Peppers", "Can%27t-Stop"),
    ("Green-Day", "Basket-Case"),
    ("blink-182", "All-the-Small-Things"),
    ("Radiohead", "Paranoid-Android"),
    ("Red-Hot-Chili-Peppers", "Otherside"),
    ("Radiohead", "High-and-Dry"),
    ("Green-Day", "American-Idiot"),
    ("Keane", "Somewhere-Only-We-Know"),
    ("Maroon-5", "This-Love"),
    ("R.E.M.", "Losing-My-Religion"),
    ("Michael-Jackson", "Beat-It"),
    ("The-Cranberries", "Linger"),
    ("Snow-Patrol", "Chasing-Cars"),
    ("Coldplay", "Sparks"),
    ("The-Strokes", "Someday"),
    ("Rage-Against-the-Machine", "Killing-in-the-Name"),
    ("The-Killers", "When-You-Were-Young"),
    ("Radiohead", "Fake-Plastic-Trees"),
    ("The-Cure", "Friday-I%27m-in-Love"),
    ("Queen", "Bohemian-Rhapsody"),
    ("Kings-of-Leon", "Use-Somebody"),
    ("Guns-N%27-Roses", "Welcome-to-the-Jungle"),
    ("Nirvana", "Dumb"),
    ("The-Cure", "Boys-Don%27t-Cry"),
    ("Radiohead", "All-I-Need"),
    ("Gorillaz", "DARE"),
    ("The-Cure", "Just-Like-Heaven"),
    ("Green-Day", "Boulevard-of-Broken-Dreams"),
    ("Soundgarden", "Black-Hole-Sun"),
    ("Radiohead", "Exit-Music-(for-a-Film)"),
    ("Weezer", "Buddy-Holly"),
    ("Arctic-Monkeys", "R-U-Mine?"),
    ("AC/DC", "Highway-to-Hell"),
    ("Hozier", "Take-Me-to-Church"),
    ("Arctic-Monkeys", "I-Bet-You-Look-Good-on-the-Dancefloor"),
    ("AC/DC", "Back-in-Black"),
    ("Red-Hot-Chili-Peppers", "Dani-California"),
    ("Radiohead", "Jigsaw-Falling-Into-Place"),
    ("Weezer", "Island-in-the-Sun"),
    ("Foo-Fighters", "The-Pretender"),
    ("Toto", "Africa"),
    ("My-Chemical-Romance", "Teenagers"),
    ("Panic!-at-the-Disco", "I-Write-Sins-Not-Tragedies"),
    ("Radiohead", "Let-Down"),
    ("Linkin-Park", "Faint"),
    ("Nirvana", "In-Bloom"),
    ("Creedence-Clearwater-Revival", "Fortunate-Son"),
    ("Pink-Floyd", "Wish-You-Were-Here"),
    ("The-Strokes", "Last-Nite"),
    ("Gorillaz", "On-Melancholy-Hill"),
    ("Linkin-Park", "One-Step-Closer"),
    ("Pixies", "Where-Is-My-Mind?"),
    ("System-of-a-Down", "Lonely-Day"),
    ("Bon-Jovi", "Livin%27-on-a-Prayer"),
    ("The-Fray", "How-to-Save-a-Life"),
]
original_song_id=2
with sync_playwright() as p:
    browser = p.chromium.launch(headless=False,args=["--disable-blink-features=AutomationControlled"]
)  # Usá False si querés ver el navegador
    context = browser.new_context(user_agent="Mozilla/5.0 ...")

    for artist, title in rock_top_100_slugs:
        url = f"https://www.whosampled.com/{artist}/{title}/"
        page = context.new_page()
        try:
            page.goto(url, timeout=60000, wait_until="domcontentloaded")

            # Esperar 3 segundos (3000 ms) después de cargar la página


        except Exception as e:
            print(f"Error cargando {url}: {e}")
            page.wait_for_timeout(1000)
            continue

        html = page.content()
        soup = BeautifulSoup(html, "html.parser")

        # Extraer <img alt> de td.tdata__td1
        alt_textos = []
        for td in soup.find_all("td", class_="tdata__td1"):
            img = td.find("img")
            if img and img.has_attr("alt"):
                alt_textos.append(img["alt"])

        print(f"\nSamples para {artist} — {title}:")
        for texto in alt_textos:
            cursor.execute("""
                           INSERT
                           OR IGNORE INTO samples (original_song_id, sample_title)
                    VALUES (?, ?)
                           """, (original_song_id, texto))
        original_song_id+=1

    page.close()
    conn.commit()
    conn.close()

    context.close()
    browser.close()