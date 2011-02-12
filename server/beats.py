#!/usr/bin/env python
# encoding: utf=8
"""
beats.py
"""
import echonest.audio as audio
from echonest.selection import have_pitch_max,have_pitches_max
import random

usage = """
Usage: 
    python beats.py <input_filename> <output_filename>

Example:
    python beats.py sample.mp3 output_prefix
"""

def main(input_filename, output_prefix):
    audiofile = audio.LocalAudioFile(input_filename)
    beats = audiofile.analysis.beats

    for x in range(16):
        collect = audio.AudioQuantumList()
        index = random.randint(0, len(beats))
        collect.append(beats[index])
        out = audio.getpieces(audiofile, collect)
        out.encode(output_prefix + str(x))

if __name__ == '__main__':
    import sys

    try:
        input_filename = sys.argv[1]
        output_prefix = sys.argv[2]
    except:
        print usage
        sys.exit(-1)

    main(input_filename, output_prefix)
