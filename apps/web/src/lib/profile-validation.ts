export type ProfileDraft = {
  firstname: string;
  lastname: string;
  username: string;
  place_id: string;
  bio: string;
  experience: string;
  available: boolean;
  in_search: boolean;
};
export function validateProfile(
  d: ProfileDraft,
  genres: number[],
  instruments: number[],
  roles: number[],
  publish: boolean,
) {
  if (d.username && !/^[a-z0-9_]{3,30}$/.test(d.username.trim()))
    return "Username must contain 3-30 lowercase letters, numbers or underscores.";
  if (
    d.firstname.length > 80 ||
    d.lastname.length > 80 ||
    d.bio.length > 3000 ||
    d.experience.length > 1000
  )
    return "One of the profile fields is too long.";
  if (
    publish &&
    (!d.firstname.trim() ||
      !d.username.trim() ||
      !d.place_id ||
      !genres.length ||
      !instruments.length ||
      !roles.length)
  )
    return "Add your first name, username, location, a genre, an instrument and a role before publishing.";
  return "";
}
export function validateAvatar(file: { type: string; size: number }) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return "Choose a JPEG, PNG or WebP image.";
  if (file.size > 5 * 1024 * 1024) return "Choose an image smaller than 5 MiB.";
  if (!file.size) return "This image is empty. Choose another file.";
  return "";
}
