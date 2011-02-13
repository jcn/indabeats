"""
importer.py
"""

import beats

import urllib
import simplejson as json
import tempfile
import uuid
import hashlib
import os

api_key = "4r9FS5iEcrS7tjWCZ0El"
song_url = "http://api.indabamusic.com/1/media/random_song?format=json&oauth_consumer_key=" + api_key
samples_dir = 'samples'

def fetch_song_json():
    h = urllib.urlopen(song_url)
    content = h.read()
    h.close()

    return content

def source_filename(md5):
    return os.path.join(samples_dir, md5, md5 + ".mp3")

def download_song(url):
    h = urllib.urlopen(url)
    song = h.read()
    h.close

    md5 = hashlib.md5(song).hexdigest()
    path = os.path.join(samples_dir, md5)

    os.makedirs(path)
    
    file = open(source_filename(md5), "w")
    file.write(song)
    file.close()

    return md5


def auth_url(url):
    return url + "?oauth_consumer_key=" + api_key

def write_metadata(song_json, md5):
    file = open(os.path.join(samples_dir, md5, "metadata.json"), "w")
    file.write(song_json)
    
    return True

def main(my_sample_dir=None):
    if my_sample_dir:
      sample_dir = my_sample_dir

    song_json = fetch_song_json()

    song_dict = json.loads(song_json)

    md5 = download_song(auth_url(song_dict['song']['assets']['preview']))

    write_metadata(song_json, md5)

    if os.fork() == 0:
        return md5
    
    else:
        # run the processor
        path = os.path.join(samples_dir, md5)
        beats.main(source_filename(md5), os.path.join(path, "output"))
        return
