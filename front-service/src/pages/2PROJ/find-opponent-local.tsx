import React, { useState, useEffect } from "react";
import DataModel from "../../models/data-model";
import UserModel from "../../models/user-model";
import GameBoard from "./components/game-board";

// Définir un identifiant unique pour votre application
const APP_IDENTIFIER = "my-unique-app-id";

type OfferType = {
  pseudo: string;
  offer: string; // This will be JSON stringified RTCSessionDescriptionInit
  appId: string;
  userId: string;
};

type Props = {
  currentUser: UserModel;
  Data: DataModel;
};

const FindOpponentLocal: React.FC<Props> = ({ currentUser, Data }) => {
  const [pseudoT, setPseudoT] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [opponentFound, setOpponentFound] = useState(false);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const [offers, setOffers] = useState<OfferType[]>([]);

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.ondatachannel = (event) => {
      const dc = event.channel;
      console.log("Data channel received:", dc);
      dc.onopen = () => console.log("Data channel is open");
      dc.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Data channel message received:", message);
        if (message.type === "offer" && message.appId === APP_IDENTIFIER && message.userId !== currentUser._id) {
          setOffers((prevOffers) => [...prevOffers, message]);
        }
      };
    };

    setPeerConnection(pc);

    // Retrieve stored offers from localStorage on component mount and filter them
    const storedOffers = localStorage.getItem("offers");
    console.log("Stored offers on mount:", storedOffers);
    if (storedOffers) {
      const parsedOffers = JSON.parse(storedOffers);
      const filteredOffers = parsedOffers.filter(
        (offer: OfferType) => offer.appId === APP_IDENTIFIER && offer.userId !== currentUser._id
      );
      console.log("Filtered offers on mount:", filteredOffers);
      setOffers(filteredOffers);
    }
  }, [currentUser._id]);

  const startSearching = async () => {
    console.log("Starting search...");
    const pc = peerConnection!;
    const dc = pc.createDataChannel("game");
    setDataChannel(dc);

    dc.onopen = async () => {
      console.log("Data channel is open");

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("ICE Candidate:", event.candidate);
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log("Offer created:", offer);

      // Broadcast the offer via DataChannel
      const newOffer: OfferType = { pseudo, offer: JSON.stringify(offer), appId: APP_IDENTIFIER, userId: currentUser._id };
      console.log("Sending offer via DataChannel:", newOffer);
      dc.send(JSON.stringify({ type: "offer", ...newOffer }));

      // Store the offer locally with app identifier and user id
      const storedOffers = localStorage.getItem("offers");
      const parsedOffers = storedOffers ? JSON.parse(storedOffers) : [];
      const updatedOffers = [...parsedOffers, newOffer];
      localStorage.setItem("offers", JSON.stringify(updatedOffers));

      // Log the updated offers
      console.log("Updated offers:", updatedOffers);

      // Update the state excluding the current user's offer
      const filteredOffers = updatedOffers.filter((offer: OfferType) => offer.userId !== currentUser._id);
      console.log("Filtered offers after update:", filteredOffers);
      setOffers(filteredOffers);
    };

    dc.onmessage = (event) => console.log("Received message:", event.data);
    dc.onclose = () => console.log("Data channel is closed");
    dc.onerror = (error) => console.error("Data channel error:", error);
  };

  const handleConnection = async (offer: string) => {
    console.log("Handling connection for offer:", offer);
    const pc = peerConnection!;

    await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    console.log("Answer created:", answer);

    // Here you would share the answer with the offer creator
    // For simplicity, we'll log it
    alert(JSON.stringify(answer));

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

  const clearLocalStorage = () => {
    localStorage.clear();
    console.log("Local storage cleared");
    setOffers([]); // Clear the offers state as well
  };

  return (
    <div className="relative">
      {!opponentFound ? (
        <div className="absolute flex-center menu-pop-up">
          <div className="dark-background zi1"></div>
          <div className="dark-container zi3 w50">
            {!pseudo ? (
              <div className="flex-col g20 w100">
                <h2 className="m0">Choose pseudo :</h2>
                <input type="text" value={pseudoT} onChange={(e) => setPseudoT(e.target.value)} placeholder="Enter your pseudo" />
                <div
                  className="cta cta-blue mlauto"
                  onClick={() => {
                    setPseudo(pseudoT);
                    startSearching();
                  }}
                >
                  <span>Start Searching</span>
                </div>
              </div>
            ) : (
              <div className="flex-col g20 w100">
                <div className="flex-bet">
                  <h2 className="m0">Find Opponent in local network :</h2>
                  <h3 className="m0 txt-end">
                    Your a visible as :<br />
                    <span className="blue" onClick={() => setPseudo("")}>
                      {pseudo}
                    </span>
                  </h3>
                </div>

                <div className="flex-wrap g20 mb15 flex-center-align">
                  <div className="cta cta-blue" onClick={handleSignal}>
                    <span>Add ICE Candidate</span>
                  </div>
                  <div className="offers-list w100">
                    <div className="flex-center-align w100">
                      <h3 className="m0">Available Offers:</h3>
                      <div className="cta cta-red ml20" onClick={clearLocalStorage}>
                        <span>Clear Offers</span>
                      </div>
                    </div>
                    {offers.map((offer, index) => (
                      <div key={index} className="offer-item">
                        <p>{offer.pseudo}</p>
                        <div className="cta cta-normal blue-h" onClick={() => handleConnection(offer.offer)}>
                          <span>Connect</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
      <GameBoard currentUser={currentUser} Data={Data} OpponentTurn={() => { } } playersInfo={null} />
    </div>
  );
};

export default FindOpponentLocal;
