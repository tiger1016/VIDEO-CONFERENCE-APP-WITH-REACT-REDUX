// Vars
var isMuted;
var videoIsPaused;
var dataChanel = null;
const browserName = getBrowserName();
const url = window.location.href;
const roomHash = 'hello';
var mode = "camera";
// var isFullscreen = false;
var sendingCaptions = false;
var receivingCaptions = false;
const isWebRTCSupported =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia ||
  window.RTCPeerConnection;

// Element vars
const remoteVideoVanilla = document.getElementById("remote-video");
const remoteVideo = $("#remote-video");

var VideoChat = {
  connected: false,
  willInitiateCall: false,
  localICECandidates: [],
  socket: io(),
  remoteVideo: document.getElementById("remote-video"),
  recognition: undefined,

  // Call to getUserMedia (provided by adapter.js for cross browser compatibility)
  // asking for access to both the video and audio streams. If the request is
  // accepted callback to the onMediaStream function, otherwise callback to the
  // noMediaStream function.
  requestMediaStream: function (event) {
    logIt("requestMediaStream");
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        console.log(stream)
        VideoChat.onMediaStream(stream);
      })
      .catch((error) => {
        logIt(error);
        logIt(
          "Failed to get local webcam video, check webcam privacy settings"
        );
        // Keep trying to get user media
        setTimeout(VideoChat.requestMediaStream, 1000);
      });
  },

  // Called when a video stream is added to VideoChat
  onMediaStream: function (stream) {
    logIt("onMediaStream");
    VideoChat.localStream = stream;
    // Add the stream as video's srcObject.
    // Now that we have webcam video sorted, prompt user to share URL
    
    VideoChat.socket.emit("join", roomHash);
    // Add listeners to the websocket
    VideoChat.socket.on("full", chatRoomFull);
    VideoChat.socket.on("offer", VideoChat.onOffer);
    VideoChat.socket.on("ready", VideoChat.readyToCall);
    VideoChat.socket.on(
      "willInitiateCall",
      () => (VideoChat.willInitiateCall = true)
    );
  },

  // When we are ready to call, enable the Call button.
  readyToCall: function (event) {
    logIt("readyToCall");
    // First to join call will most likely initiate call
    if (VideoChat.willInitiateCall) {
      logIt("Initiating call");
      VideoChat.startCall();
    }
  },

  // Set up a callback to run when we have the ephemeral token to use Twilio's TURN server.
  startCall: function (event) {
    logIt("startCall >>> Sending token request...");
    VideoChat.socket.on("token", VideoChat.onToken(VideoChat.createOffer));
    VideoChat.socket.emit("token", roomHash);
  },

  // When we receive the ephemeral token back from the server.
  onToken: function (callback) {
    logIt("onToken");
    return function (token) {
      logIt("<<< Received token");
      // Set up a new RTCPeerConnection using the token's iceServers.
      VideoChat.peerConnection = new RTCPeerConnection({
        iceServers: token.iceServers,
      });
      // Add the local video stream to the peerConnection.
      VideoChat.localStream.getTracks().forEach(function (track) {
        VideoChat.peerConnection.addTrack(track, VideoChat.localStream);
      });
      // Add general purpose data channel to peer connection,
      // used for text chats, captions, and toggling sending captions
    
      // Set up callbacks for the connection generating iceCandidates or
      // receiving the remote media stream.
      VideoChat.peerConnection.onicecandidate = VideoChat.onIceCandidate;
      VideoChat.peerConnection.onaddstream = VideoChat.onAddStream;
      // Set up listeners on the socket
      VideoChat.socket.on("candidate", VideoChat.onCandidate);
      VideoChat.socket.on("answer", VideoChat.onAnswer);
      VideoChat.socket.on("requestToggleCaptions", () => toggleSendCaptions());
      VideoChat.socket.on("recieveCaptions", (captions) =>
        recieveCaptions(captions)
      );
      // Called when there is a change in connection state
      VideoChat.peerConnection.oniceconnectionstatechange = function (event) {
        switch (VideoChat.peerConnection.iceConnectionState) {
          case "connected":
            logIt("connected");
            // Once connected we no longer have a need for the signaling server, so disconnect
            VideoChat.socket.disconnect();
            break;
          case "disconnected":
            logIt("disconnected");
          case "failed":
            logIt("failed");
            // VideoChat.socket.connect
            // VideoChat.createOffer();
            // Refresh page if connection has failed
            location.reload();
            break;
          case "closed":
            logIt("closed");
            break;
        }
      };
      callback();
    };
  },

  // When the peerConnection generates an ice candidate, send it over the socket to the peer.
  onIceCandidate: function (event) {
    logIt("onIceCandidate");
    if (event.candidate) {
      logIt(
        `<<< Received local ICE candidate from STUN/TURN server (${event.candidate.address})`
      );
      if (VideoChat.connected) {
        logIt(`>>> Sending local ICE candidate (${event.candidate.address})`);
        VideoChat.socket.emit(
          "candidate",
          JSON.stringify(event.candidate),
          roomHash
        );
      } else {
        // If we are not 'connected' to the other peer, we are buffering the local ICE candidates.
        // This most likely is happening on the "caller" side.
        // The peer may not have created the RTCPeerConnection yet, so we are waiting for the 'answer'
        // to arrive. This will signal that the peer is ready to receive signaling.
        VideoChat.localICECandidates.push(event.candidate);
      }
    }
  },

  // When receiving a candidate over the socket, turn it back into a real
  // RTCIceCandidate and add it to the peerConnection.
  onCandidate: function (candidate) {
    // Update caption text
    rtcCandidate = new RTCIceCandidate(JSON.parse(candidate));
    logIt(
      `onCandidate <<< Received remote ICE candidate (${rtcCandidate.address} - ${rtcCandidate.relatedAddress})`
    );
    VideoChat.peerConnection.addIceCandidate(rtcCandidate);
  },

  // Create an offer that contains the media capabilities of the browser.
  createOffer: function () {
    logIt("createOffer >>> Creating offer...");
    VideoChat.peerConnection.createOffer(
      function (offer) {
        // If the offer is created successfully, set it as the local description
        // and send it over the socket connection to initiate the peerConnection
        // on the other side.
        VideoChat.peerConnection.setLocalDescription(offer);
        VideoChat.socket.emit("offer", JSON.stringify(offer), roomHash);
      },
      function (err) {
        logIt("failed offer creation");
        logIt(err, true);
      }
    );
  },

  // Create an answer with the media capabilities that both browsers share.
  // This function is called with the offer from the originating browser, which
  // needs to be parsed into an RTCSessionDescription and added as the remote
  // description to the peerConnection object. Then the answer is created in the
  // same manner as the offer and sent over the socket.
  createAnswer: function (offer) {
    logIt("createAnswer");
    return function () {
      logIt(">>> Creating answer...");
      rtcOffer = new RTCSessionDescription(JSON.parse(offer));
      VideoChat.peerConnection.setRemoteDescription(rtcOffer);
      VideoChat.peerConnection.createAnswer(
        function (answer) {
          VideoChat.peerConnection.setLocalDescription(answer);
          VideoChat.socket.emit("answer", JSON.stringify(answer), roomHash);
        },
        function (err) {
          logIt("Failed answer creation.");
          logIt(err, true);
        }
      );
    };
  },

  // When a browser receives an offer, set up a callback to be run when the
  // ephemeral token is returned from Twilio.
  onOffer: function (offer) {
    logIt("onOffer <<< Received offer");
    VideoChat.socket.on(
      "token",
      VideoChat.onToken(VideoChat.createAnswer(offer))
    );
    VideoChat.socket.emit("token", roomHash);
  },

  // When an answer is received, add it to the peerConnection as the remote description.
  onAnswer: function (answer) {
    logIt("onAnswer <<< Received answer");
    var rtcAnswer = new RTCSessionDescription(JSON.parse(answer));
    // Set remote description of RTCSession
    VideoChat.peerConnection.setRemoteDescription(rtcAnswer);
    // The caller now knows that the callee is ready to accept new ICE candidates, so sending the buffer over
    VideoChat.localICECandidates.forEach((candidate) => {
      logIt(`>>> Sending local ICE candidate (${candidate.address})`);
      // Send ice candidate over websocket
      VideoChat.socket.emit("candidate", JSON.stringify(candidate), roomHash);
    });
    // Reset the buffer of local ICE candidates. This is not really needed, but it's good practice
    VideoChat.localICECandidates = [];
  },

  // Called when a stream is added to the peer connection
  onAddStream: function (event) {
    logIt("onAddStream <<< Received new stream from remote. Adding it...");
    // Update remote video source
    VideoChat.remoteVideo.srcObject = event.stream;
    // Close the initial share url snackbar
    VideoChat.remoteVideo.style.background = "none";
    // Update connection status
    VideoChat.connected = true;
    // Hide caption status text
    // between adding a stream and the height of the video div changing
    setTimeout(() => rePositionLocalVideo(), 500);
    // var timesRun = 0;
    // var interval = setInterval(function () {
    //   timesRun += 1;
    //   if (timesRun === 10) {
    //     clearInterval(interval);
    //   }
    //   rePositionLocalVideo();
    // }, 300);
  },
};

// Get name of browser session using user agent
function getBrowserName() {
  var name = "Unknown";
  if (window.navigator.userAgent.indexOf("MSIE") !== -1) {
  } else if (window.navigator.userAgent.indexOf("Firefox") !== -1) {
    name = "Firefox";
  } else if (window.navigator.userAgent.indexOf("Opera") !== -1) {
    name = "Opera";
  } else if (window.navigator.userAgent.indexOf("Chrome") !== -1) {
    name = "Chrome";
  } else if (window.navigator.userAgent.indexOf("Safari") !== -1) {
    name = "Safari";
  }
  return name;
}

// Basic logging class wrapper
function logIt(message, error) {
  console.log(message);
}

// Called when socket receives message that room is full
function chatRoomFull() {
  alert(
    "Chat room is full. Check to make sure you don't have multiple open tabs, or try with a new room link"
  );
  // Exit room and redirect
  window.location.href = "/newcall";
}

// Called when window is resized
function windowResized() {
  rePositionLocalVideo();
  rePositionCaptions();
}

// Fullscreen
// function openFullscreen() {
//   try {
//     // var elem = document.getElementById("remote-video");
//     var elem = document.getElementById("body");
//     if (!isFullscreen) {
//       VideoChat.remoteVideo.classList.add("fullscreen");
//       isFullscreen = true;
//       if (elem.requestFullscreen) {
//         elem.requestFullscreen();
//       } else if (elem.mozRequestFullScreen) {
//         /* Firefox */
//         elem.mozRequestFullScreen();
//       } else if (elem.webkitRequestFullscreen) {
//         /* Chrome, Safari and Opera */
//
//         elem.webkitRequestFullscreen();
//         setTimeout(windowResized, 1000);
//       } else if (elem.msRequestFullscreen) {
//         /* IE/Edge */
//         elem.msRequestFullscreen();
//       }
//     } else {
//       isFullscreen = false;
//       VideoChat.remoteVideo.classList.remove("fullscreen");
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       } else if (document.mozCancelFullScreen) {
//         /* Firefox */
//         document.mozCancelFullScreen();
//       } else if (document.webkitExitFullscreen) {
//         /* Chrome, Safari and Opera */
//         document.webkitExitFullscreen();
//       } else if (document.msExitFullscreen) {
//         /* IE/Edge */
//         document.msExitFullscreen();
//       }
//     }
//   } catch (e) {
//     logIt(e);
//   }
//   setTimeout(windowResized, 1000);
// }
// End Fullscreen

// Mute microphone



// Recieve captions over datachannel

// Translation
// function translate(text) {
//   let fromLang = "en";
//   let toLang = "zh";
//   // let text = "hello how are you?";
//   const API_KEY = "APIKEYHERE";
//   let gurl = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
//   gurl += "&q=" + encodeURI(text);
//   gurl += `&source=${fromLang}`;
//   gurl += `&target=${toLang}`;
//   fetch(gurl, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//   })
//     .then((res) => res.json())
//     .then((response) => {
//       // console.log("response from google: ", response);
//       // return response["data"]["translations"][0]["translatedText"];
//       logIt(response);
//       var translatedText =
//         response["data"]["translations"][0]["translatedText"];
//       console.log(translatedText);
//       dataChanel.send("cap:" + translatedText);
//     })
//     .catch((error) => {
//       console.log("There was an error with the translation request: ", error);
//     });
// }
// End Translation


function startUp() {
  //  Try and detect in-app browsers and redirect
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  if (
    DetectRTC.isMobileDevice &&
    (ua.indexOf("FBAN") > -1 ||
      ua.indexOf("FBAV") > -1 ||
      ua.indexOf("Instagram") > -1)
  ) {
    if (DetectRTC.osName === "iOS") {
      window.location.href = "/notsupportedios";
    } else {
      window.location.href = "/notsupported";
    }
  }

  // Redirect all iOS browsers that are not Safari
  if (DetectRTC.isMobileDevice) {
    if (DetectRTC.osName === "iOS" && !DetectRTC.browser.isSafari) {
      window.location.href = "/notsupportedios";
    }
  }

  if (!isWebRTCSupported || browserName === "MSIE") {
    window.location.href = "/notsupported";
  }

  // Set tab title
  document.title = "Room - " + url.substring(url.lastIndexOf("/") + 1);

  // get webcam on load
  VideoChat.requestMediaStream();

  // Captions hidden by default
  // Make local video draggable

  // Show hide button labels on hover

  // Fade out / show UI on mouse move
  var timedelay = 1;
  function delayCheck() {
    if (timedelay === 5) {
      // $(".multi-button").fadeOut();
      $("#header").fadeOut();
      timedelay = 1;
    }
    timedelay = timedelay + 1;
  }

  navigator.mediaDevices.ondevicechange = () => window.location.reload();
}

startUp();
