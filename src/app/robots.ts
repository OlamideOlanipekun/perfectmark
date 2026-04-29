import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Hide sensitive areas from Google
    },
    sitemap: 'https://perfectmarktutorschoolproject.com/sitemap.xml',
  }
}
