import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Img, Sequence, useVideoConfig, useCurrentFrame } from "remotion";
import { Oscilloscope } from "./Oscilloscope";
import { Spectrum } from "./Spectrum";
import { WaitForFonts } from "./WaitForFonts";
import { FONT_FAMILY } from "./font";
import { AudiogramCompositionSchemaType } from "./schema";

export const Audiogram: React.FC<AudiogramCompositionSchemaType> = ({
  visualizer,
  audioFileUrl,
  coverImageUrl,
  albumName,
  songs,
  titleColor,
  audioOffsetInSeconds,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const audioOffsetInFrames = Math.round(audioOffsetInSeconds * fps);
  const baseNumberOfSamples = Number(visualizer.numberOfSamples);

  // Calculate current playback time in seconds
  const currentSeconds = frame / fps + audioOffsetInSeconds;

  // Find the currently playing song
  const currentSong = songs.find(
    (s) => currentSeconds >= s.startInSeconds && currentSeconds < s.endInSeconds
  ) || songs[0] || { title: "Unknown Song" };

  return (
    <AbsoluteFill>
      <Sequence from={-audioOffsetInFrames}>
        <Audio src={audioFileUrl} />

        {/* Blurred background image */}
        <AbsoluteFill>
          <Img
            src={coverImageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(40px) brightness(0.4)",
              transform: "scale(1.2)"
            }}
          />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontFamily: FONT_FAMILY,
          }}
        >
          {/* Main Cover Image */}
          <Img
            style={{
              borderRadius: "16px",
              width: "500px",
              height: "500px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              marginBottom: "40px"
            }}
            src={coverImageUrl}
          />

          {/* Album & Song Info */}
          <WaitForFonts>
            <div style={{ textAlign: "center", width: "100%" }}>
              <div
                style={{
                  lineHeight: "1.2",
                  fontWeight: 800,
                  color: titleColor,
                  fontSize: "56px",
                  marginBottom: "16px",
                  textShadow: "0 4px 10px rgba(0,0,0,0.5)"
                }}
              >
                {currentSong.trackNumber ? `${currentSong.trackNumber}. ` : ""}
                {currentSong.title}
              </div>
              <div
                style={{
                  lineHeight: "1",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "36px",
                  marginBottom: "16px",
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                }}
              >
                {currentSong.artist ? currentSong.artist : ""}
              </div>
              <div
                style={{
                  lineHeight: "1",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "32px",
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                }}
              >
                {albumName}
              </div>
            </div>
          </WaitForFonts>

          {/* Waveform Visualizer */}
          <div style={{
            marginTop: "60px",
            width: "800px",
            height: "150px",
          }}>
            {visualizer.type === "oscilloscope" ? (
              <Oscilloscope
                waveColor={visualizer.color}
                padding={visualizer.padding}
                audioSrc={audioFileUrl}
                key={audioFileUrl}
                numberOfSamples={baseNumberOfSamples}
                windowInSeconds={visualizer.windowInSeconds}
                posterization={visualizer.posterization}
                amplitude={visualizer.amplitude}
              />
            ) : visualizer.type === "spectrum" ? (
              <Spectrum
                barColor={visualizer.color}
                audioSrc={audioFileUrl}
                key={audioFileUrl}
                mirrorWave={visualizer.mirrorWave}
                numberOfSamples={baseNumberOfSamples * 4}
                freqRangeStartIndex={visualizer.freqRangeStartIndex}
                waveLinesToDisplay={visualizer.linesToDisplay}
              />
            ) : null}
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
