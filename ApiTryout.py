import requests

def get_samples(artist: str, title: str):
    artist_slug = artist.replace(" ", "-")
    title_slug = title.replace(" ", "-")
    url = f"https://whosampled-scraper.herokuapp.com/track/{artist_slug}/{title_slug}"

    r = requests.get(url)
    r.raise_for_status()
    return r.json()

if __name__ == "__main__":
    data = get_samples("The Cure", "Lovesong")
    print(data)
