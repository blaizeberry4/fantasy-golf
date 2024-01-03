import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PUP Golf',
    short_name: 'PUP Golf',
    description: 'A Fantasy Golf League for PUPs',
    start_url: '/events',
    display: 'fullscreen',
    orientation: 'portrait',
    background_color: '#fff',
    theme_color: '#9233ea',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}