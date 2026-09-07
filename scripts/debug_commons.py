"""Same length (75569) = cached HTML. Test with curl to see if api.php works outside urllib."""
import subprocess
url = 'https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=search&gsrsearch=roasted%20potatoes%20dish&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url%7Cmime%7Csize&iiurlwidth=1600'
r = subprocess.run(["curl", "-s", "-H", "User-Agent: PairDishContentBot/1.0 (admin@pairdish.com)", "--max-time", "40", url],
                   capture_output=True, text=True)
print("exit:", r.returncode, "len:", len(r.stdout))
print(r.stdout[:400])