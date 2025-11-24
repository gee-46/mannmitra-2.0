import React from 'react';
import { useTranslation } from 'react-i18next';
import PageWrapper from '../components/PageWrapper';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import { Music, Video } from 'lucide-react';

const calmingVideos = [
  { id: 'lE6RYpe9IT0', title: 'Relaxing Rain Sounds' },
  { id: 'L_LUpnjgPso', title: 'Peaceful Night, Crackling Fireplace' },
  { id: 'bn9F19Hi1Lk', title: 'Calm Ocean Waves Sounds' },
];

const mindfulPodcasts = [
  { id: '4rOoJ6Egrf8K2IrywzwOMk', title: 'Mindfulness Meditation', creator: 'The Daily Meditation Podcast' },
  { id: '0xOdWuktBQKWCv2mlVjizn', title: 'Sleep & Relaxation', creator: 'Sleep With Me' },
  { id: '3IM0lmZxpFAY7CwMuv9H4g', title: 'Positive Living', creator: 'The Happiness Lab' },
];

const Media = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <div className="py-6 space-y-8">
        <h1 className="text-3xl font-bold text-foreground">{t('media_page.title')}</h1>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
            <Video className="w-6 h-6 mr-3 text-primary" />
            {t('media_page.videos')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {calmingVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="!p-0 overflow-hidden group">
                  <div className="aspect-video overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                    ></iframe>
                  </div>
                  <h3 className="font-semibold p-4">{video.title}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
            <Music className="w-6 h-6 mr-3 text-accent" />
            {t('media_page.podcasts')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mindfulPodcasts.map((podcast, index) => (
              <motion.div
                key={podcast.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Card className="!p-0 overflow-hidden h-full hover:border-accent/50 transition-colors">
                  <iframe
                    style={{ borderRadius: '12px' }}
                    src={`https://open.spotify.com/embed/show/${podcast.id}?utm_source=generator&theme=0`}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={podcast.title}
                  ></iframe>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default Media;
