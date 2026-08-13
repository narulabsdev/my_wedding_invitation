import Image from "next/image";

const sealSrc = "/wedding/seals/sangho-steph-square-tassel.png";

type InvitationSealProps = {
  className?: string;
  priority?: boolean;
};

export function InvitationSeal({
  className = "",
  priority = false,
}: InvitationSealProps) {
  return (
    <span
      className={`invitation-seal ${className}`.trim()}
      aria-hidden="true"
    >
      <Image
        src={sealSrc}
        alt=""
        width={1536}
        height={1024}
        priority={priority}
        unoptimized
        sizes="112px"
        className="invitation-seal__image"
      />
    </span>
  );
}

export const invitationSealSrc = sealSrc;
