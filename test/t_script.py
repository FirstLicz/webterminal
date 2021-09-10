import json
import sqlparse

a = "111"

try:
    a = json.loads("aaa,ddd")
except json.decoder.JSONDecodeError:
    pass

print(a)

sql = "select * from pub"
p_value = "pub"

ret = sqlparse.parse(sql)
for x in ret:
    print(x, type(x))
    print(x.tokens)

v_alias = p_value[:-1]
print(v_alias)

import os


print(os.name)