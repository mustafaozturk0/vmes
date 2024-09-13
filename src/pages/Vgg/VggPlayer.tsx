import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css"; // Include default Video.js styles
import "./video.css"; // Assuming this file holds your custom styles

interface VideoPlayerProps {
  options: any;
  onReady?: (player: any) => void;
}

const VggPlayer: React.FC<VideoPlayerProps> = ({ options, onReady }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (videoRef.current && !playerRef.current) {
      const videoElement = videoRef.current;
      const player = videojs(videoElement, options, () => {
        if (onReady) {
          onReady(player);
        }
      });
      playerRef.current = player;
    }
  }, [options, onReady]);

  return (
    <div data-vjs-player className="video-container">
      <video ref={videoRef} className="video-js vjs-default-skin vjs-640x360" />
    </div>
  );
};

export default VggPlayer;
