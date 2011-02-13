"""
server.py
"""

import os
import server.importer
import sys

sys.path.append(os.path.abspath('server'))

from server.bottle import route, run, request, response, static_file, abort

server.bottle.debug(True)

def web_root():
  return os.path.abspath('web')

@route('/')
def index():
  return static_file('index.html', root=web_root())

@route('/:path#.+#')
def static(path):
  return static_file(path, root=web_root())

run(host='localhost', port='8080')
