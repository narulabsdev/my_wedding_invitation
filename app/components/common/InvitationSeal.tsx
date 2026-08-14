import Image from "next/image";

const sealSrc = "/wedding/seals/sangho-steph-square-tassel.png";
const metadataSealSrc = "/wedding/seals/metadata-seal-transparent.png";

type InvitationSealProps = {
  className?: string;
  priority?: boolean;
  variant?: "square" | "metadata";
  alt?: string;
};

export function InvitationSeal({
  className = "",
  priority = false,
  variant = "square",
  alt = "",
}: InvitationSealProps) {
  const isMetadataSeal = variant === "metadata";

  return (
    <span
      className={`invitation-seal invitation-seal--${variant} ${className}`.trim()}
      aria-hidden={alt ? undefined : true}
    >
      <Image
        src={isMetadataSeal ? metadataSealSrc : sealSrc}
        alt={alt}
        width={isMetadataSeal ? 1294 : 1536}
        height={isMetadataSeal ? 835 : 1024}
        priority={priority}
        unoptimized
        sizes={isMetadataSeal ? "(max-width: 480px) 86vw, 340px" : "112px"}
        className="invitation-seal__image"
      />
    </span>
  );
}

export const invitationSealSrc = sealSrc;
export const invitationMetadataSealSrc = metadataSealSrc;
