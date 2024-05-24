import React, { useState } from "react";
import DataModel from "../../models/data-model";
import UserModel from "../../models/user-model";
import GameBoard from "./components/game-board";

type Props = {
  currentUser: UserModel;
  Data: DataModel;
};

const FindOpponentLocal: React.FC<Props> = ({ currentUser, Data }) => {
  const [pseudo, setPseudo] = useState("");
  const [opponentFound, setOpponentFound] = useState(false);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);

  const startSearching = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const dc = pc.createDataChannel("game");
    setPeerConnection(pc);
    setDataChannel(dc);

    dc.onopen = () => console.log("Data channel is open");
    dc.onmessage = (event) => console.log("Received message:", event.data);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE Candidate:", event.candidate);
        alert(JSON.stringify(event.candidate));
      }
    };

    pc.createOffer().then((offer) => {
      pc.setLocalDescription(offer);
      console.log("Offer:", offer);
      alert(JSON.stringify(offer));
    });
  };

  const handleConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    setPeerConnection(pc);

    pc.ondatachannel = (event) => {
      const dc = event.channel;
      setDataChannel(dc);

      dc.onopen = () => console.log("Data channel is open");
      dc.onmessage = (event) => console.log("Received message:", event.data);
    };

    const answer = prompt("Enter the signaling data (offer) received from the other player:");
    if (answer) {
      const offer = JSON.parse(answer);
      pc.setRemoteDescription(new RTCSessionDescription(offer)).then(() => {
        pc.createAnswer().then((answer) => {
          pc.setLocalDescription(answer);
          console.log("Answer:", answer);
          alert(JSON.stringify(answer));
        });
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE Candidate:", event.candidate);
        alert(JSON.stringify(event.candidate));
      }
    };
  };

  const handleSignal = () => {
    const candidate = prompt("Enter the signaling data (candidate) received from the other player:");
    if (candidate && peerConnection) {
      peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
    }
  };

  return (
    <div className="main p20 flex-col relative flex-end-align g20">
      {!opponentFound ? (
        <div className="flex-col g20 w100">
          <h2>Find Opponent in local network:</h2>
          <div className="flex-wrap g20 w80 mb15 flex-center-align">
            <input type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder="Enter your pseudo" />
            <div className="cta cta-blue" onClick={startSearching}>
              <span>Start Searching</span>
            </div>
            <div className="cta cta-blue" onClick={handleConnection}>
              <span>Connect to Opponent</span>
            </div>
            <div className="cta cta-blue" onClick={handleSignal}>
              <span>Add ICE Candidate</span>
            </div>
          </div>
        </div>
      ) : (
        <GameBoard currentUser={currentUser} Data={Data} peerConnection={peerConnection} dataChannel={dataChannel} />
      )}
    </div>
  );
};

export default FindOpponentLocal;