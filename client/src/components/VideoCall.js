import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const VideoCall = ({ partnerId, onClose }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [socket, setSocket] = useState(null);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [error, setError] = useState('');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const myUserId = localStorage.getItem('userId');

  const getLocalMedia = async () => {
    if (localStreamRef.current) return localStreamRef.current;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;
    setLocalStream(stream);
    return stream;
  };

  const rtcConfig = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  const ensurePeerConnection = () => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection(rtcConfig);
    peerConnectionRef.current = pc;

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (stream) {
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          targetUserId: partnerId,
          senderUserId: myUserId,
          candidate: event.candidate,
        });
      }
    };

    return pc;
  };

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('userOnline', (userId) => {
      if (userId === partnerId) setPartnerOnline(true);
    });

    newSocket.on('userOffline', (userId) => {
      if (userId === partnerId) setPartnerOnline(false);
    });

    newSocket.on('offer', async ({ offer, senderUserId }) => {
      try {
        const pc = ensurePeerConnection();
        const stream = await getLocalMedia();

        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        newSocket.emit('answer', {
          targetUserId: senderUserId,
          senderUserId: myUserId,
          answer,
        });

        setIsCallActive(true);
      } catch (err) {
        console.error('Error handling offer:', err);
        setError('Не удалось принять входящий звонок');
      }
    });

    newSocket.on('answer', async ({ answer }) => {
      try {
        const pc = peerConnectionRef.current;
        if (!pc) return;
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (err) {
        console.error('Error handling answer:', err);
        setError('Ошибка обработки ответа WebRTC');
      }
    });

    newSocket.on('ice-candidate', async ({ candidate }) => {
      try {
        const pc = peerConnectionRef.current;
        if (!pc || !candidate) return;
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    });

    newSocket.emit('register', myUserId);

    return () => {
      newSocket.off('userOnline');
      newSocket.off('userOffline');
      newSocket.off('offer');
      newSocket.off('answer');
      newSocket.off('ice-candidate');
      newSocket.disconnect();

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [partnerId]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const startCall = async () => {
    if (!socket) {
      setError('Сокет еще не готов, попробуйте снова');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const stream = await getLocalMedia();
      const pc = ensurePeerConnection();

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('offer', {
        targetUserId: partnerId,
        senderUserId: myUserId,
        offer,
      });

      setIsCallActive(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setError('Ошибка доступа к камере/микрофону');
    } finally {
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (socket) {
      socket.emit('leaveConversation', partnerId);
    }

    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    onClose();
  };

  if (!partnerOnline) {
    return (
      <div className="video-call-container">
        <h3>Ждем подключение...</h3>
        {error && <p style={{ color: '#d14343' }}>{error}</p>}
        <button onClick={startCall} disabled={isConnecting}>
          {isConnecting ? 'Подключение...' : 'Начать звонок'}
        </button>
      </div>
    );
  }

  return (
    <div className="video-call-container">
      {error && <p style={{ color: '#d14343' }}>{error}</p>}
      <div className="video-controls">
        <button onClick={endCall}>Завершить</button>
        <span>{isCallActive ? 'Звонок активен' : 'Звонок завершен'}</span>
      </div>
      
      <div className="video-grid">
        <div className="video-box">
          <h3>Вы</h3>
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
        <div className="video-box">
          <h3>Участник</h3>
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCall;