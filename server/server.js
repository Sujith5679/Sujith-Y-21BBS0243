const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let players = {}; 

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        console.log('Received message:', data);

        if (data.type === 'init') {
            const player = data.player;
            if (players[player]) {
                ws.send(JSON.stringify({ type: 'error', message: 'Player already connected.' }));
                ws.close();
            } else {
                players[player] = ws;
                ws.player = player; 
                console.log(`Player ${player} connected`);

                
                if (Object.keys(players).length === 2) {
                    const initialState = [
                        'A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-P3',
                        '', '', '', '', '',
                        '', '', '', '', '',
                        '', '', '', '', '',
                        'B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-P3'
                    ];
                    broadcastGameState(initialState);
                }
            }
        } else if (data.type === 'move') {
            
        }
    });

    ws.on('close', function() {
        console.log(`Player ${ws.player} disconnected`);
        delete players[ws.player];
    });
});

function broadcastGameState(state) {
    for (let player in players) {
        players[player].send(JSON.stringify({ type: 'gameState', state }));
    }
}

console.log('WebSocket server started on ws://localhost:8080');
