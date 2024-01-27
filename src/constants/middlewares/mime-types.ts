export const __img_valid_mime_types = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/tiff",
  "image/bmp",
  "image/svg+xml",
];

export const __video_valid_mime_types = [
  "video/mp4",
  "video/ogg",
  "video/webm",
  "video/3gpp",
  "video/3gpp2",
  "video/avi",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/x-ms-wmv",
  "video/x-flv",
  "video/x-m4v",
  "video/mpeg",
  "video/mov",
];

export const __audio_valid_mime_types = [
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "audio/aac",
  "audio/x-m4a",
  "audio/x-matroska",
  "audio/x-ms-wma",
];

export const __valid_mime_types = [
  ...__img_valid_mime_types,
  ...__video_valid_mime_types,
  ...__audio_valid_mime_types,
];

export const __valid_mime_types_regex = new RegExp(
  `(${__valid_mime_types.join("|")})`,
  "i"
);

export const __valid_mime_types_regex_str = `(${__valid_mime_types.join("|")})`;

export const __valid_mime_types_str = __valid_mime_types.join(", ");

export const __valid_mime_types_regex_str_with_g = `(${__valid_mime_types.join(
  "|"
)})`;
