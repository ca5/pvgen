import "./index.css";
import { parseMedia } from "@remotion/media-parser";
import { Composition, staticFile } from "remotion";
import { Audiogram } from "./Audiogram/Main";
import { audiogramSchema } from "./Audiogram/schema";
import { FPS } from "./helpers/ms-to-frame";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Audiogram"
        component={Audiogram}
        width={1080}
        height={1080}
        schema={audiogramSchema}
        defaultProps={{
          // audio settings
          audioOffsetInSeconds: 0,
          audioFileUrl: staticFile("sample-audio.wav"),
          // podcast data
          coverImageUrl: staticFile("sample-cover.jpeg"),
          albumName: "My Awesome Album",
          titleColor: "rgba(255, 255, 255, 0.93)",
          songs: [
            { trackNumber: 1, title: "Intro", artist: "Artist A", startInSeconds: 0, endInSeconds: 5 },
            { trackNumber: 2, title: "Main Track", artist: "Artist B", startInSeconds: 5, endInSeconds: 15 },
            { trackNumber: 3, title: "Outro", artist: "Artist C", startInSeconds: 15, endInSeconds: 20 },
          ],
          // visualizer settings
          visualizer: {
            type: "spectrum",
            color: "#F4B941",
            numberOfSamples: "256" as const,
            linesToDisplay: 65,
            freqRangeStartIndex: 0,
            mirrorWave: true,
          },
        }}
        // Determine the length of the video based on the duration of the audio file
        calculateMetadata={async ({ props }) => {
          const { slowDurationInSeconds } = await parseMedia({
            src: props.audioFileUrl,
            acknowledgeRemotionLicense: true,
            fields: {
              slowDurationInSeconds: true,
            },
          });

          return {
            durationInFrames: Math.floor(
              (slowDurationInSeconds - props.audioOffsetInSeconds) * FPS,
            ),
            props,
            fps: FPS,
          };
        }}
      />
    </>
  );
};
