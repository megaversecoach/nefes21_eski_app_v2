from flask import Flask, jsonify
from services import *
from services.queueHelper import consumeEvents

app = Flask(__name__)

consumeEvents()

if __name__ == '__main__' :
    app.run(host='0.0.0.0', port=5000)