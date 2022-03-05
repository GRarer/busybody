import gravatar from 'gravatar';

export function emailToGravatarURL(email: string): string {
  return gravatar.url(email, {
    s: '256', // scale images to 256x256 pixels
    d: 'identicon', // hash-based placeholder image if gravatar is not set
    rating: 'pg' // block images marked as containing nudity, violence, etc
  });
}
