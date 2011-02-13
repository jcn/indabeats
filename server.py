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

def server_root():
  return os.path.abspath('server')

def samples_dir():
  return os.path.abspath('samples')

@route('/')
def index():
  return static_file('index.html', root=web_root())

@route('/request_samples')
def request_song():
  hash = request.GET.get('id')

  if ((hash == None) or (hash.strip() == '')):
    hash = server.importer.main(samples_dir())

  else:
    hash = request.GET.get('id')

  return { 'poll_url': '/samples/' + hash, 'source_id': hash }

@route('/samples/:id')
def samples(id):
  try:
    response.content_type = 'application/json'
    return open(os.path.join(samples_dir(), id, 'processed')).read()
  except:
    abort(404)

@route('/samples/:id/:path')
def sample(id, path):
  return static_file(path, root=os.path.join(samples_dir(), id))

@route('/:path#.+#')
def static(path):
  return static_file(path, root=web_root())

run(host='localhost', port='8080')
