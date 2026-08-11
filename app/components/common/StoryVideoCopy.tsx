import type { StoryVideo } from "../../content/invitation";

type StoryVideoCopyProps = {
  scene: StoryVideo;
  className: string;
};

export function StoryVideoCopy({ scene, className }: StoryVideoCopyProps) {
  return (
    <div className={className} data-story-video-copy>
      {scene.eyebrow ? <p>{scene.eyebrow}</p> : null}
      <h2>
        {scene.title.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h2>
      {scene.detail ? <small>{scene.detail}</small> : null}
    </div>
  );
}
