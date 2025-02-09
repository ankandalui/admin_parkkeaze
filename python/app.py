from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import eventlet

# Monkey patch before any other imports
eventlet.monkey_patch()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize SocketIO with HTTP transport
socketio = SocketIO(app, 
                   cors_allowed_origins="*",
                   async_mode='eventlet')

# Dictionary to store the latest output from each client
client_data = {}

@app.route('/')
def index():
    return "Socket.IO Server is running"

@socketio.on('client_data')
def handle_client_data(data):
    client_id = data['client_id']
    output = data['output']
    
    # Update the client data dictionary
    client_data[client_id] = output
    
    print(f"Received data from Client {client_id}: {output}")
    emit('update_data', {'client_id': client_id, 'output': output}, broadcast=True)

@socketio.on('connect')
def handle_connect():
    print("Client connected")

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected")

if __name__ == '__main__':
    # Use HTTP server
    socketio.run(app, 
                host='0.0.0.0', 
                port=5000, 
                debug=True,
                use_reloader=False,
                log_output=True)