from requests import get

SOURCE = "https://scratch.mit.edu/discuss/post/6429679/source/"

with open('./src/main.js', 'w') as file:
    file.write(get(SOURCE).text)

get("https://mmws.chiroyce.repl.co/", headers={
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36."
})