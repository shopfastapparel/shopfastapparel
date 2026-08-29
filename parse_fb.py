import requests, re

for s in ['/assets/chunk.935f4068141f7a93e057.js', '/assets/chunk.68975654436d4ac515ae.js']:
    r = requests.get('https://my.freshbooks.com' + s)
    matches = re.findall(r'https://[^\s\"\'`]+|/api/[^\s\"\'`]+|/service/[^\s\"\'`]+', r.text)
    print(s, len(matches))
    for m in matches:
        if 'invoice' in m.lower() or 'link' in m.lower() or 'bill' in m.lower():
            print('  ->', m[:100])
