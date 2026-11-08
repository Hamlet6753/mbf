"use client";
import Image from "next/image";
import Link from "next/link";
import { profileName, safeAvatarUrl, type ProfileView } from "@/lib/musicians";
export function ProfileAvatar({
  picture,
  name,
  className = "",
}: {
  picture: string | null;
  name: string;
  className?: string;
}) {
  const url = safeAvatarUrl(picture);
  return (
    <div className={`live-avatar ${className}`}>
      {url ? (
        <Image
          src={url}
          alt={`${name} avatar`}
          fill
          unoptimized
          sizes="(max-width:600px) 90vw, 320px"
        />
      ) : (
        <span aria-label={`${name}, no avatar`}>
          {name.slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
}
export function LiveMusicianCard({ view }: { view: ProfileView }) {
  const { profile } = view;
  const name = profileName(profile);
  return (
    <article className="musician-card">
      <div className="card-image">
        <ProfileAvatar picture={profile.picture} name={name} />
        {profile.available && (
          <span className="status available">
            <span aria-hidden="true" />
            Available
          </span>
        )}
      </div>
      <div className="card-body">
        <h3>{name}</h3>
        <p className="role">
          {view.roles.join(" / ") || view.instruments.join(" / ") || "Musician"}
        </p>
        <p className="location">{view.location}</p>
        <div className="tags">
          {view.genres.map((g) => (
            <span key={g}>{g}</span>
          ))}
        </div>
      </div>
      <Link className="card-link" href={`/musicians/${profile.id}`}>
        View Profile <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
