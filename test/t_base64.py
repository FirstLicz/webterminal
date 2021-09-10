import base64
import re
import requests

s = '4.blob,1.0,16.OiJMVF9DTElQQg==;'
print(isinstance(s, bytes))

regx = re.compile(r"^4\.blob,1\.0,\d+?\.(.*);")
ret = regx.findall(s)

print(ret)

print(base64.b64decode(ret[0]).decode())

extend_params = [
    "domain", "remote_app", "remote_app_args"
]

for x, e in enumerate(extend_params):
    print(x, e)

requests.post(None, data=None, verify=False, timeout=5)