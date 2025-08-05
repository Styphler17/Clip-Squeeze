import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const defaultSEO = {
  title: 'ClipSqueeze - Free Online Video Compression Tool',
  description: 'Compress videos online for free with ClipSqueeze. Reduce video file size up to 90% while maintaining quality. No registration required, works in any browser.',
  keywords: 'video compression, online video compressor, free video compression, video file size reducer, video optimization, MP4 compression, video converter, web video tools',
  image: 'https://clip-squeeze.brastyphler.click/logo.png',
  type: 'website' as const,
  author: 'ClipSqueeze',
  url: 'https://clip-squeeze.brastyphler.click'
};

export const SEO: React.FC<SEOProps> = ({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url,
  type = defaultSEO.type,
  author = defaultSEO.author,
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  const location = useLocation();
  const currentUrl = url || `https://clip-squeeze.brastyphler.click${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update primary meta tags
    updateMetaTag('title', title);
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Update Open Graph tags
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:image', image);
    updatePropertyTag('og:url', currentUrl);
    updatePropertyTag('og:type', type);

    // Update Twitter tags
    updatePropertyTag('twitter:title', title);
    updatePropertyTag('twitter:description', description);
    updatePropertyTag('twitter:image', image);
    updatePropertyTag('twitter:url', currentUrl);

    // Update additional Open Graph tags if provided
    if (publishedTime) {
      updatePropertyTag('article:published_time', publishedTime);
    }
    if (modifiedTime) {
      updatePropertyTag('article:modified_time', modifiedTime);
    }
    if (section) {
      updatePropertyTag('article:section', section);
    }
    if (tags.length > 0) {
      tags.forEach(tag => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:tag');
        meta.content = tag;
        document.head.appendChild(meta);
      });
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = currentUrl;

  }, [title, description, keywords, image, currentUrl, type, author, publishedTime, modifiedTime, section, tags]);

  return null; // This component doesn't render anything
};

// Page-specific SEO components
export const VideoCompressorSEO: React.FC = () => (
  <SEO
    title="Video Compression - ClipSqueeze | Free Online Video Compressor"
    description="Compress videos online for free with ClipSqueeze. Reduce video file size up to 90% while maintaining quality. Support for MP4, AVI, MOV, MKV, and more formats."
    keywords="video compression, online video compressor, free video compression, MP4 compression, video file size reducer, video optimization"
    section="Video Compression"
  />
);



export const HistorySEO: React.FC = () => (
  <SEO
    title="Compression History - ClipSqueeze | Track Your Video Compressions"
    description="View your video compression history with ClipSqueeze. Track compression ratios, file sizes, and download your compressed videos. Manage your compression projects."
    keywords="compression history, video compression tracking, compression statistics, video compression log"
    section="History"
  />
);

export const AboutSEO: React.FC = () => (
  <SEO
    title="About ClipSqueeze - Free Online Video Compression Tool"
    description="Learn about ClipSqueeze, the free online video compression tool. Privacy-focused, client-side processing, and no registration required."
    keywords="about ClipSqueeze, video compression tool, online video tools, privacy-focused video compression"
    section="About"
  />
);

export const HowToUseSEO: React.FC = () => (
  <SEO
    title="How to Use ClipSqueeze - Video Compression Guide"
    description="Learn how to use ClipSqueeze for video compression. Step-by-step guide with tips and best practices for optimal video compression results."
    keywords="how to compress videos, video compression guide, ClipSqueeze tutorial, video compression tips, compression best practices"
    section="Guide"
  />
);

export const SettingsSEO: React.FC = () => (
  <SEO
    title="Settings - ClipSqueeze | Customize Your Video Compression"
    description="Customize your ClipSqueeze experience. Adjust compression settings, manage your data, and configure preferences for optimal video compression results."
    keywords="ClipSqueeze settings, compression settings, video compression preferences, data management"
    section="Settings"
  />
); 